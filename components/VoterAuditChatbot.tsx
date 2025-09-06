"use client";
import React, { useState, useRef, useEffect } from "react";
import { indianStates, indianDistricts, AssemblySeatsDistrictWise } from '@/data/statesData';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  options?: string[] | null;
}

interface UserData {
  mobile?: string;
  name?: string;
  state?: string;
  district?: string;
  assembly?: string;
  boothNumber?: string;
  description?: string;
}

interface ImageFile {
  id: number;
  name: string;
  file: File;
  url: string;
  type: string;
  uploaded: boolean;
  cloudinaryUrl?: string;
}

interface District {
  id: number;
  key: string;
  name: string;
}

interface Assembly {
  id: number;
  name: string;
}

export default function VoterAuditChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState('init');
  const [userData, setUserData] = useState<UserData>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
  const [uploadedImages, setUploadedImages] = useState<ImageFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [districts, setDistricts] = useState<District[]>([]);
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initializeChat = () => {
    addMessage("नमस्ते! मैं वोटर रोल ऑडिट सहायक हूँ। मैं आपकी मतदाता सूची की विसंगतियों की रिपोर्ट करने में मदद करूंगा।", 'bot');
    setTimeout(() => {
      addMessage("शुरुआत करने के लिए, कृपया अपना मोबाइल नंबर दर्ज करें (10 अंक):", 'bot');
      setCurrentStep('mobile');
    }, 1500);
  };

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        setIsAuthenticated(true);
        setUserData(parsedUser);
        addMessage("आपका स्वागत है! आपने पहले से लॉगिन किया हुआ है।", 'bot');
        setTimeout(() => {
          addMessage("कृपया उस समस्या का विवरण दें जो आपने मतदाता सूची में देखी है।", 'bot');
          setCurrentStep('description');
        }, 1000);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        initializeChat();
      }
    } else {
      initializeChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle state selection and filter districts
  useEffect(() => {
    if (userData.state) {
      const selectedState = indianStates.find((s: {name: string; key: string}) => s.name === userData.state);
      if (selectedState) {
        const stateDistricts = indianDistricts.states.find((s: {key: string; districts: District[]}) => s.key === selectedState.key);
        if (stateDistricts) {
          setDistricts(stateDistricts.districts);
        }
      }
    }
  }, [userData.state]);

  // Handle district selection and filter assemblies
  useEffect(() => {
    if (userData.district && userData.state) {
      const selectedState = indianStates.find((s: {name: string; key: string}) => s.name === userData.state);
      if (selectedState) {
        const assemblyData = AssemblySeatsDistrictWise.state.find((s: {stateKey: string; districts?: Array<{districtName: string; constituencies: Assembly[]}>}) => s.stateKey === selectedState.key);
        if (assemblyData && assemblyData.districts) {
          const selectedDistrict = assemblyData.districts.find((d: {districtName: string; constituencies: Assembly[]}) => d.districtName === userData.district);
          if (selectedDistrict) {
            setAssemblies(selectedDistrict.constituencies);
          }
        }
      }
    }
  }, [userData.district, userData.state]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addMessage = (text: string, sender: 'user' | 'bot', options: string[] | null = null) => {
    setMessages(prev => [...prev, {
      id: Date.now() + Math.random(),
      text,
      sender,
      timestamp: new Date(),
      options
    }]);
  };

  const typeMessage = (text: string, sender: 'user' | 'bot', delay = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      addMessage(text, sender);
      setIsTyping(false);
    }, delay);
  };

  const checkUserExists = async (phone: string) => {
    try {
      const checkResponse = await fetch(`https://api.shaktiabhiyan.in/api/v1/voterAuditUser/check_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: phone })
      });

      let checkResult;
      try {
        checkResult = await checkResponse.json();
      } catch {
        checkResult = (await checkResponse.text()).replace(/"/g, '').trim();
      }

      return checkResult;
    } catch (err) {
      console.error('Check user error:', err);
      return null;
    }
  };

  const loginUser = async (phone: string) => {
    try {
      const loginResponse = await fetch(`https://api.shaktiabhiyan.in/api/v1/voterAuditUser/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phone })
      });

      const loginData = await loginResponse.json();

      if (loginData.status === 'success') {
        localStorage.setItem('token', loginData.token);
        localStorage.setItem('user', JSON.stringify(loginData.data.user));
        setIsAuthenticated(true);
        setUserData(loginData.data.user);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const createUser = async (userDataForCreation: {phone: string; name: string; state: string; district: string; assembly: string; boothNumber: string}) => {
    try {
      setIsCreatingUser(true);

      const response = await fetch('https://api.shaktiabhiyan.in/api/v1/voterAuditUser/create_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDataForCreation)
      });

      const result = await response.json();

      if (result.status === 'success') {
        // After creating user, login to get token
        const loginSuccess = await loginUser(userDataForCreation.phone);
        if (loginSuccess) {
          return true;
        } else {
          typeMessage("उपयोगकर्ता बनाया गया लेकिन लॉगिन में त्रुटि हुई। कृपया दोबारा कोशिश करें।", 'bot');
          return false;
        }
      } else {
        typeMessage(result.message || "उपयोगकर्ता बनाने में त्रुटि हुई।", 'bot');
        return false;
      }
    } catch (error) {
      console.error('Create user error:', error);
      typeMessage("नेटवर्क की समस्या है। कृपया दोबारा कोशिश करें।", 'bot');
      return false;
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleStateSelection = (stateName: string) => {
    setUserData(prev => ({ ...prev, state: stateName }));

    typeMessage("राज्य चुना गया। कृपया थोड़ा इंतजार करें...", 'bot');

    setTimeout(() => {
      const selectedState = indianStates.find((s: {name: string; key: string}) => s.name === stateName);
      if (selectedState) {
        const stateDistricts = indianDistricts.states.find((s: {key: string; districts: District[]}) => s.key === selectedState.key);
        if (stateDistricts && stateDistricts.districts.length > 0) {
          const districtOptions = stateDistricts.districts.map((d: District) => d.name);
          addMessage("अब कृपया अपना जिला चुनें:", 'bot', districtOptions);
          setCurrentStep('district');
        } else {
          typeMessage("इस राज्य के लिए जिले उपलब्ध नहीं हैं। कृपया दूसरा राज्य चुनें।", 'bot');
        }
      }
    }, 1500);
  };

  const handleDistrictSelection = (districtName: string) => {
    setUserData(prev => ({ ...prev, district: districtName }));

    typeMessage("जिला चुना गया। विधानसभा क्षेत्र लोड हो रहे हैं...", 'bot');

    setTimeout(() => {
      const selectedState = indianStates.find((s: {name: string; key: string}) => s.name === userData.state);
      if (selectedState) {
        const assemblyData = AssemblySeatsDistrictWise.state.find((s: {stateKey: string; districts?: Array<{districtName: string; constituencies: Assembly[]}>}) => s.stateKey === selectedState.key);
        if (assemblyData && assemblyData.districts) {
          const selectedDistrict = assemblyData.districts.find((d: {districtName: string; constituencies: Assembly[]}) => d.districtName === districtName);
          if (selectedDistrict && selectedDistrict.constituencies.length > 0) {
            const assemblyOptions = selectedDistrict.constituencies.map((a: Assembly) => a.name);
            addMessage("अब कृपया अपना विधानसभा क्षेत्र चुनें:", 'bot', assemblyOptions);
            setCurrentStep('assembly');
          } else {
            typeMessage("इस जिले के लिए विधानसभा क्षेत्र उपलब्ध नहीं हैं। कृपया दूसरा जिला चुनें।", 'bot');
          }
        }
      }
    }, 1500);
  };

  const uploadFile = async (file: File) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", 'auditvoter_preset');

    try {
      const api = `https://api.cloudinary.com/v1_1/dbjr4qedz/image/upload`;
      const response = await fetch(api, {
        method: 'POST',
        body: data
      });

      const result = await response.json();
      return result.secure_url;
    } catch (err) {
      console.log(err);
      throw new Error('File upload failed');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      file: file,
      url: URL.createObjectURL(file),
      type: 'file',
      uploaded: false
    }));

    setSelectedImages(prev => [...prev, ...newImages]);
    addMessage(`${files.length} फ़ाइल चुनी गई। अपलोड करने के लिए "अपलोड करें" पर क्लिक करें।`, 'user');
    event.target.value = '';
  };

  const handleUploadAll = async () => {
    const imagesToUpload = selectedImages.filter(img => !img.uploaded);
    if (imagesToUpload.length === 0) return;

    setIsUploading(true);
    addMessage("फ़ाइलें अपलोड हो रही हैं...", 'bot');

    try {
      const uploadPromises = imagesToUpload.map(async (image) => {
        const url = await uploadFile(image.file);
        return {
          ...image,
          cloudinaryUrl: url,
          uploaded: true
        };
      });

      const uploadedNewImages = await Promise.all(uploadPromises);
      setUploadedImages(prev => [...prev, ...uploadedNewImages]);
      setSelectedImages([]);

      typeMessage(`${uploadedNewImages.length} फ़ाइलें सफलतापूर्वक अपलोड हो गईं! अब रिपोर्ट सबमिट करने के लिए "सबमिट करें" पर क्लिक करें।`, 'bot');
    } catch {
      typeMessage("अपलोड में त्रुटि हुई। कृपया पुनः प्रयास करें।", 'bot');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitAudit = async () => {
    if (uploadedImages.length === 0) {
      typeMessage("कृपया पहले दस्तावेज अपलोड करें।", 'bot');
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      typeMessage("सत्र समाप्त हो गया है। कृपया दोबारा लॉगिन करें।", 'bot');
      setCurrentStep('mobile');
      return;
    }

    setIsSubmitting(true);
    addMessage("रिपोर्ट सबमिट हो रही है...", 'bot');

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        typeMessage("सत्र समाप्त हो गया है। कृपया दोबारा लॉगिन करें।", 'bot');
        setIsAuthenticated(false);
        setCurrentStep('mobile');
        return;
      }

      const auditData = {
        imageUrls: uploadedImages.map(img => img.cloudinaryUrl),
        description: userData.description,
        location: {
          state: userData.state,
          district: userData.district,
          assembly: userData.assembly,
          boothNumber: userData.boothNumber
        }
      };

      const response = await fetch('https://api.shaktiabhiyan.in/api/v1/voterAuditRecords/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(auditData)
      });

      const result = await response.json();

      if (result.status === 'success') {
        setShowSuccess(true);
        typeMessage("🎉 आपकी रिपोर्ट सफलतापूर्वक सबमिट हो गई है! वोटर रोल ऑडिट टीम जल्द ही इसकी समीक्षा करेगी।", 'bot');

        // Reset form data
        setUserData({});
        setUploadedImages([]);
        setSelectedImages([]);
        setShowImageUpload(false);
        setCurrentStep('completed');
      } else {
        typeMessage("सबमिशन में त्रुटि हुई। कृपया पुनः प्रयास करें।", 'bot');
      }
    } catch (error) {
      console.error('Submission failed:', error);
      if ((error as any).response?.status === 401) {
        typeMessage("सत्र समाप्त हो गया है। कृपया दोबारा लॉगिन करें।", 'bot');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setCurrentStep('mobile');
      } else {
        typeMessage("सबमिशन में त्रुटि हुई। कृपया पुनः प्रयास करें।", 'bot');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSend = async () => {
    if (!currentInput.trim()) return;

    const userMessage = currentInput.trim();
    addMessage(userMessage, 'user');
    setCurrentInput('');

    switch (currentStep) {
      case 'mobile':
        if (!/^\d{10}$/.test(userMessage)) {
          typeMessage("कृपया 10 अंक का वैध मोबाइल नंबर दर्ज करें।", 'bot');
          return;
        }

        setUserData(prev => ({ ...prev, mobile: userMessage }));
        typeMessage("मोबाइल नंबर की जांच हो रही है...", 'bot');

        const userExists = await checkUserExists(userMessage);

        if (userExists === "exist") {
          const loginSuccess = await loginUser(userMessage);
          if (loginSuccess) {
            typeMessage("स्वागत है! आप सफलतापूर्वक लॉगिन हो गए हैं।", 'bot');
            setTimeout(() => {
              typeMessage("कृपया उस समस्या का विवरण दें जो आपने मतदाता सूची में देखी है।", 'bot');
              setCurrentStep('description');
            }, 1500);
          } else {
            typeMessage("लॉगिन में त्रुटि हुई। कृपया दोबारा कोशिश करें।", 'bot');
          }
        } else if (userExists === "notexist") {
          // Store phone number for new user registration
          localStorage.setItem('registration_phone', userMessage);
          typeMessage("आप नए उपयोगकर्ता हैं। कृपया अपना नाम दर्ज करें:", 'bot');
          setCurrentStep('name');
        } else {
          typeMessage("कनेक्शन की समस्या है। कृपया दोबारा कोशिश करें।", 'bot');
        }
        break;

      case 'name':
        if (!userMessage.trim()) {
          typeMessage("कृपया वैध नाम दर्ज करें।", 'bot');
          return;
        }
        setUserData(prev => ({ ...prev, name: userMessage }));
        typeMessage("धन्यवाद! अब कृपया अपना राज्य चुनें:", 'bot');
        setTimeout(() => {
          const stateOptions = indianStates.map((state: {name: string; key: string}) => state.name);
          addMessage("", 'bot', stateOptions);
          setCurrentStep('state');
        }, 1000);
        break;

      case 'state':
        if (!indianStates.find((s: {name: string; key: string}) => s.name === userMessage)) {
          typeMessage("कृपया दिए गए विकल्पों में से राज्य चुनें।", 'bot');
          return;
        }
        handleStateSelection(userMessage);
        break;

      case 'district':
        if (!districts.find((d: District) => d.name === userMessage)) {
          typeMessage("कृपया दिए गए विकल्पों में से जिला चुनें।", 'bot');
          return;
        }
        handleDistrictSelection(userMessage);
        break;

      case 'assembly':
        if (!assemblies.find((a: Assembly) => a.name === userMessage)) {
          typeMessage("कृपया दिए गए विकल्पों में से विधानसभा क्षेत्र चुनें।", 'bot');
          return;
        }
        setUserData(prev => ({ ...prev, assembly: userMessage }));
        typeMessage("अब कृपया बूथ नंबर दर्ज करें:", 'bot');
        setCurrentStep('booth');
        break;

      case 'booth':
        if (!userMessage.trim()) {
          typeMessage("कृपया वैध बूथ नंबर दर्ज करें।", 'bot');
          return;
        }
        setUserData(prev => ({ ...prev, boothNumber: userMessage }));

        // Check if this is a new user that needs to be created
        const registrationPhone = localStorage.getItem('registration_phone');
        if (registrationPhone && !isAuthenticated) {
          typeMessage("उपयोगकर्ता खाता बनाया जा रहा है...", 'bot');

          const userDataForCreation = {
            phone: registrationPhone,
            name: userData.name || '',
            state: userData.state || '',
            district: userData.district || '',
            assembly: userData.assembly || '',
            boothNumber: userMessage
          };

          const userCreated = await createUser(userDataForCreation);

          if (userCreated) {
            localStorage.removeItem('registration_phone');
            typeMessage("खाता सफलतापूर्वक बनाया गया! अब कृपया उस समस्या का विवरण दें जो आपने मतदाता सूची में देखी है:", 'bot');
            setCurrentStep('description');
          } else {
            typeMessage("खाता बनाने में त्रुटि हुई। कृपया दोबारा कोशिश करें।", 'bot');
            setCurrentStep('mobile');
          }
        } else {
          typeMessage("कृपया उस समस्या का विवरण दें जो आपने मतदाता सूची में देखी है:", 'bot');
          setCurrentStep('description');
        }
        break;

      case 'description':
        if (!userMessage.trim()) {
          typeMessage("कृपया समस्या का विवरण दें।", 'bot');
          return;
        }
        setUserData(prev => ({ ...prev, description: userMessage }));
        typeMessage("अब कृपया समस्या के प्रमाण के रूप में तस्वीरें या दस्तावेज अपलोड करें।", 'bot');
        setTimeout(() => {
          setShowImageUpload(true);
          addMessage("फ़ाइल अपलोड करने के लिए नीचे दिए गए बटन का उपयोग करें:", 'bot');
        }, 1000);
        setCurrentStep('images');
        break;

      case 'completed':
        typeMessage("आपकी रिपोर्ट पहले से ही सबमिट हो चुकी है। नई रिपोर्ट के लिए पेज को रिफ्रेश करें।", 'bot');
        break;

      default:
        typeMessage("मुझे समझ नहीं आया। कृपया दिए गए निर्देशों का पालन करें।", 'bot');
    }
  };

  const handleOptionClick = (option: string) => {
    addMessage(option, 'user');

    switch (currentStep) {
      case 'state':
        handleStateSelection(option);
        break;
      case 'district':
        handleDistrictSelection(option);
        break;
      case 'assembly':
        setUserData(prev => ({ ...prev, assembly: option }));
        typeMessage("अब कृपया बूथ नंबर दर्ज करें:", 'bot');
        setCurrentStep('booth');
        break;
    }
  };

  const resetChat = () => {
    setMessages([]);
    setUserData({});
    setSelectedImages([]);
    setUploadedImages([]);
    setShowImageUpload(false);
    setShowSuccess(false);
    setCurrentStep('init');
    localStorage.removeItem('registration_phone'); // Clear registration phone if exists

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        setIsAuthenticated(true);
        setUserData(parsedUser);
        addMessage("आपका स्वागत है! आपने पहले से लॉगिन किया हुआ है।", 'bot');
        setTimeout(() => {
          addMessage("कृपया उस समस्या का विवरण दें जो आपने मतदाता सूची में देखी है।", 'bot');
          setCurrentStep('description');
        }, 1000);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        initializeChat();
      }
    } else {
      initializeChat();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-cover bg-center" style={{
      backgroundImage: "url('/bg.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Header */}
      <div className="relative z-10 bg-white bg-opacity-95 backdrop-blur-sm shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900">वोटर रोल ऑडिट सहायक</h1>
              <p className="text-sm text-gray-600">मतदाता सूची विसंगति रिपोर्टिंग</p>
            </div>
          </div>
          <button
            onClick={resetChat}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
            title="नई चैट शुरू करें"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg ${message.sender === 'user'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
              : 'bg-white bg-opacity-95 backdrop-blur-sm text-gray-800 border border-gray-200'
              }`}>
              {message.text && <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>}
              {message.options && (
                <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                  {message.options.map((option: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleOptionClick(option)}
                      className="block w-full text-left px-3 py-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all text-sm border border-gray-200 hover:border-blue-300"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {(isTyping || isCreatingUser) && (
          <div className="flex justify-start">
            <div className="bg-white bg-opacity-95 backdrop-blur-sm shadow-lg px-4 py-3 rounded-2xl border border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                {isCreatingUser && <span className="text-xs text-gray-600 ml-2">उपयोगकर्ता बनाया जा रहा है...</span>}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Image Upload Section */}
      {showImageUpload && (
        <div className="relative z-10 p-4 bg-white bg-opacity-95 backdrop-blur-sm border-t border-gray-200">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              📎 फ़ाइल चुनें
            </button>

            {selectedImages.length > 0 && (
              <button
                onClick={handleUploadAll}
                disabled={isUploading || isSubmitting}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-md"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ⏳ अपलोड हो रहा...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    📤 अपलोड करें ({selectedImages.length})
                  </>
                )}
              </button>
            )}

            {uploadedImages.length > 0 && (
              <button
                onClick={handleSubmitAudit}
                disabled={isSubmitting || isUploading}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    सबमिट हो रहा...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    ✅ सबमिट करें ({uploadedImages.length} फ़ाइल)
                  </>
                )}
              </button>
            )}
          </div>

          {/* Image Preview */}
          {(selectedImages.length > 0 || uploadedImages.length > 0) && (
            <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
              {selectedImages.map((image) => (
                <div key={image.id} className="relative">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-20 object-cover rounded-lg border-2 border-yellow-300 shadow-sm"
                  />
                  <span className="absolute top-1 right-1 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full shadow">⏳</span>
                  <button
                    onClick={() => setSelectedImages(prev => prev.filter(img => img.id !== image.id))}
                    className="absolute top-1 left-1 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center shadow-md transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
              {uploadedImages.map((image) => (
                <div key={image.id} className="relative">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-20 object-cover rounded-lg border-2 border-green-300 shadow-sm"
                  />
                  <span className="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow">✅</span>
                  <button
                    onClick={() => setUploadedImages(prev => prev.filter(img => img.id !== image.id))}
                    className="absolute top-1 left-1 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center shadow-md transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Input Section */}
      {currentStep !== 'images' && currentStep !== 'completed' && (
        <div className="relative z-10 p-4 bg-transparent border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <textarea
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={
                  currentStep === 'mobile' ? "मोबाइल नंबर दर्ज करें..." :
                  currentStep === 'name' ? "अपना नाम दर्ज करें..." :
                  currentStep === 'booth' ? "बूथ नंबर दर्ज करें..." :
                  currentStep === 'description' ? "समस्या का विवरण दें..." :
                  "यहाँ टाइप करें..."
                }
                className="w-full px-4 py-3 bg-white bg-opacity-95 backdrop-blur-sm border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none shadow-lg text-gray-800 placeholder-gray-500"
                rows={1}
              />
            </div>
            <button
              onClick={handleSend}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-3 rounded-full transition-all shadow-lg flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-200">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">सफलतापूर्वक सबमिट हुआ!</h2>
              <p className="text-gray-600 mb-6">आपकी रिपोर्ट सफलतापूर्वक सबमिट हो गई है। वोटर रोल ऑडिट टीम जल्द ही इसकी समीक्षा करेगी।</p>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  resetChat();
                }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all shadow-md"
              >
                नई रिपोर्ट करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
