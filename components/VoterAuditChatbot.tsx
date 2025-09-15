"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from 'next/image';
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
  const [currentStep, setCurrentStep] = useState('language');
  const [language, setLanguage] = useState<'hindi' | 'english'>('english');
  const [userData, setUserData] = useState<UserData>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
  const [uploadedImages, setUploadedImages] = useState<ImageFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [districts, setDistricts] = useState<District[]>([]);
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState<string>('');
  const [certificates, setCertificates] = useState<{url: string; name: string | undefined;}[]>([]);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Language translations
  const translations = {
    hindi: {
      greeting: "नमस्ते! मैं वोटर रोल ऑडिट सहायक हूँ। मैं आपकी मतदाता सूची की विसंगतियों की रिपोर्ट करने में मदद करूंगा।",
      enterMobile: "शुरुआत करने के लिए, कृपया अपना मोबाइल नंबर दर्ज करें (10 अंक):",
      welcome: "आपका स्वागत है! आपने पहले से लॉगिन किया हुआ है।",
      enterName: "कृपया अपना नाम दर्ज करें:",
      selectState: "अब कृपया अपना राज्य चुनें:",
      selectDistrict: "अब कृपया अपना जिला चुनें:",
      selectAssembly: "अब कृपया अपना विधानसभा क्षेत्र चुनें:",
      enterBooth: "अब कृपया बूथ नंबर दर्ज करें:",
      enterDescription: "कृपया उस समस्या का विवरण दें जो आपने मतदाता सूची में देखी है:",
      uploadDocuments: "अब कृपया समस्या के प्रमाण के रूप में तस्वीरें या दस्तावेज अपलोड करें।",
      thankYou: "🎉 धन्यवाद! आपकी रिपोर्ट सफलतापूर्वक सबमिट हो गई है! वोटर रोल ऑडिट टीम जल्द ही इसकी समीक्षा करेगी।",
      certificate: "यहाँ आपका प्रमाण पत्र है:",
      downloadCertificate: "प्रमाण पत्र डाउनलोड करें",
      newComplaint: "नई शिकायत दर्ज करें"
    },
    english: {
      greeting: "Hello! I am the Voter Roll Audit Assistant. I will help you report discrepancies in the voter list.",
      enterMobile: "To get started, please enter your mobile number (10 digits):",
      welcome: "Welcome! You are already logged in.",
      enterName: "Please enter your name:",
      selectState: "Now please select your state:",
      selectDistrict: "Now please select your district:",
      selectAssembly: "Now please select your assembly constituency:",
      enterBooth: "Now please enter the booth number:",
      enterDescription: "Please describe the problem you observed in the voter list:",
      uploadDocuments: "Now please upload photos or documents as evidence of the problem.",
      thankYou: "🎉 Thank you! Your report has been submitted successfully! The Voter Roll Audit team will review it soon.",
      certificate: "Here is your certificate:",
      downloadCertificate: "Download Certificate",
      newComplaint: "Submit New Complaint"
    }
  };

  const getText = (key: keyof typeof translations.hindi) => translations[language][key];

  const initializeChat = () => {
    setMessages([]); // Clear existing messages
    addMessage("Please select your preferred language / कृपया अपनी पसंदीदा भाषा चुनें:", 'bot', ['English', 'हिंदी']);
    setCurrentStep('language');
  };

  const generateCertificate = async (userName: string) => {
    try {
      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return null;

      // Load the certificate template using native HTML Image constructor
      const templateImage = new (window as any).Image();
      templateImage.crossOrigin = 'anonymous';
      
      return new Promise<string>((resolve, reject) => {
        templateImage.onload = () => {
          // Set canvas size to match image
          canvas.width = templateImage.width;
          canvas.height = templateImage.height;
          
          // Draw the certificate template
          ctx.drawImage(templateImage, 0, 0);
          
          // Configure text styling for name
          ctx.fillStyle = '#000000'; // Black color
          ctx.font = 'bold 170px Arial';
          ctx.textAlign = 'center';
          
          // Calculate position (25% from top)
          const nameX = canvas.width / 2;
          const nameY = canvas.height * 0.31;
          
          // Add user name to certificate
          ctx.fillText(userName, nameX, nameY);
          
          // Convert to blob and create URL
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              resolve(url);
            } else {
              reject(new Error('Failed to create blob'));
            }
          }, 'image/png', 0.9);
        };
        
        templateImage.onerror = () => reject(new Error('Failed to load certificate template'));
        // Use PNG/JPG format instead of PDF for canvas compatibility
        templateImage.src = language === 'hindi' ? '/VoteChoriC-Hindi.jpg' : '/VoteChoriC-English.jpg';
      });
    } catch (error) {
      console.error('Certificate generation error:', error);
      return null;
    }
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
        setMessages([]); // Clear existing messages
        addMessage(getText('welcome'), 'bot');
        setTimeout(() => {
          addMessage(getText('enterDescription'), 'bot');
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
          typeMessage(language === 'hindi' ? "उपयोगकर्ता बनाया गया लेकिन लॉगिन में त्रुटि हुई। कृपया दोबारा कोशिश करें।" : "User created but login error occurred. Please try again.", 'bot');
          return false;
        }
      } else {
        typeMessage(result.message || (language === 'hindi' ? "उपयोगकर्ता बनाने में त्रुटि हुई।" : "Error creating user."), 'bot');
        return false;
      }
    } catch (error) {
      console.error('Create user error:', error);
      typeMessage(language === 'hindi' ? "नेटवर्क की समस्या है। कृपया दोबारा कोशिश करें।" : "Network problem. Please try again.", 'bot');
      return false;
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleLanguageSelection = (selectedLanguage: string) => {
    const langCode = selectedLanguage === 'English' ? 'english' : 'hindi';
    setLanguage(langCode);
    
    setTimeout(() => {
      addMessage(translations[langCode].greeting, 'bot');
      setTimeout(() => {
        addMessage(translations[langCode].enterMobile, 'bot');
        setCurrentStep('mobile');
      }, 1500);
    }, 500);
  };

  const handleStateSelection = (stateName: string) => {
    setUserData(prev => ({ ...prev, state: stateName }));

    typeMessage(language === 'hindi' ? "राज्य चुना गया। कृपया थोड़ा इंतजार करें..." : "State selected. Please wait...", 'bot');

    setTimeout(() => {
      const selectedState = indianStates.find((s: {name: string; key: string}) => s.name === stateName);
      if (selectedState) {
        const stateDistricts = indianDistricts.states.find((s: {key: string; districts: District[]}) => s.key === selectedState.key);
        if (stateDistricts && stateDistricts.districts.length > 0) {
          const districtOptions = stateDistricts.districts.map((d: District) => d.name);
          addMessage(getText('selectDistrict'), 'bot', districtOptions);
          setCurrentStep('district');
        } else {
          typeMessage(language === 'hindi' ? "इस राज्य के लिए जिले उपलब्ध नहीं हैं। कृपया दूसरा राज्य चुनें।" : "Districts not available for this state. Please select another state.", 'bot');
        }
      }
    }, 1500);
  };

  const handleDistrictSelection = (districtName: string) => {
    setUserData(prev => ({ ...prev, district: districtName }));

    typeMessage(language === 'hindi' ? "जिला चुना गया। विधानसभा क्षेत्र लोड हो रहे हैं..." : "District selected. Loading assembly constituencies...", 'bot');

    setTimeout(() => {
      const selectedState = indianStates.find((s: {name: string; key: string}) => s.name === userData.state);
      if (selectedState) {
        const assemblyData = AssemblySeatsDistrictWise.state.find((s: {stateKey: string; districts?: Array<{districtName: string; constituencies: Assembly[]}>}) => s.stateKey === selectedState.key);
        if (assemblyData && assemblyData.districts) {
          const selectedDistrict = assemblyData.districts.find((d: {districtName: string; constituencies: Assembly[]}) => d.districtName === districtName);
          if (selectedDistrict && selectedDistrict.constituencies.length > 0) {
            const assemblyOptions = selectedDistrict.constituencies.map((a: Assembly) => a.name);
            addMessage(getText('selectAssembly'), 'bot', assemblyOptions);
            setCurrentStep('assembly');
          } else {
            typeMessage(language === 'hindi' ? "इस जिले के लिए विधानसभा क्षेत्र उपलब्ध नहीं हैं। कृपया दूसरा जिला चुनें।" : "Assembly constituencies not available for this district. Please select another district.", 'bot');
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
    addMessage(language === 'hindi' ? `${files.length} फ़ाइल चुनी गई। अपलोड करने के लिए "अपलोड करें" पर क्लिक करें।` : `${files.length} files selected. Click "Upload" to upload them.`, 'user');
    event.target.value = '';
  };

  const handleUploadAll = async () => {
    const imagesToUpload = selectedImages.filter(img => !img.uploaded);
    if (imagesToUpload.length === 0) return;

    setIsUploading(true);
    addMessage(language === 'hindi' ? "फ़ाइलें अपलोड हो रही हैं..." : "Files are being uploaded...", 'bot');

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

      typeMessage(language === 'hindi' ? `${uploadedNewImages.length} फ़ाइलें सफलतापूर्वक अपलोड हो गईं! अब रिपोर्ट सबमिट करने के लिए "सबमिट करें" पर क्लिक करें।` : `${uploadedNewImages.length} files uploaded successfully! Now click "Submit" to submit the report.`, 'bot');
    } catch {
      typeMessage(language === 'hindi' ? "अपलोड में त्रुटि हुई। कृपया पुनः प्रयास करें।" : "Upload error occurred. Please try again.", 'bot');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitAudit = async () => {
    if (uploadedImages.length === 0) {
      typeMessage(language === 'hindi' ? "कृपया पहले दस्तावेज अपलोड करें।" : "Please upload documents first.", 'bot');
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      typeMessage(language === 'hindi' ? "सत्र समाप्त हो गया है। कृपया दोबारा लॉगिन करें।" : "Session expired. Please login again.", 'bot');
      setCurrentStep('mobile');
      return;
    }

    setIsSubmitting(true);
    addMessage(language === 'hindi' ? "रिपोर्ट सबमिट हो रही है..." : "Report is being submitted...", 'bot');

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        typeMessage(language === 'hindi' ? "सत्र समाप्त हो गया है। कृपया दोबारा लॉगिन करें।" : "Session expired. Please login again.", 'bot');
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
        // Generate certificate
        if (userData.name) {
          const certificateDataUrl = await generateCertificate(userData.name);
          if (certificateDataUrl) {
            setCertificates(prev => [...prev, {url: certificateDataUrl, name: userData.name}]);
          }
        }
        
        typeMessage(getText('thankYou'), 'bot');
        
        // Show certificate after thank you message
        setTimeout(() => {
          if (certificates.length > 0 || userData.name) {
            addMessage(getText('certificate'), 'bot');
          }
        }, 2000);

        setCurrentStep('completed');
      } else {
        typeMessage(language === 'hindi' ? "सबमिशन में त्रुटि हुई। कृपया पुनः प्रयास करें।" : "Submission error occurred. Please try again.", 'bot');
      }
    } catch (error) {
      console.error('Submission failed:', error);
      if (error && typeof error === 'object' && 'response' in error && 
          typeof error.response === 'object' && error.response && 
          'status' in error.response && error.response.status === 401) {
        typeMessage(language === 'hindi' ? "सत्र समाप्त हो गया है। कृपया दोबारा लॉगिन करें।" : "Session expired. Please login again.", 'bot');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setCurrentStep('mobile');
      } else {
        typeMessage(language === 'hindi' ? "सबमिशन में त्रुटि हुई। कृपया पुनः प्रयास करें।" : "Submission error occurred. Please try again.", 'bot');
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
          typeMessage(language === 'hindi' ? "कृपया 10 अंक का वैध मोबाइल नंबर दर्ज करें।" : "Please enter a valid 10-digit mobile number.", 'bot');
          return;
        }

        setUserData(prev => ({ ...prev, mobile: userMessage }));
        typeMessage(language === 'hindi' ? "मोबाइल नंबर की जांच हो रही है..." : "Checking mobile number...", 'bot');

        const userExists = await checkUserExists(userMessage);

        if (userExists === "exist") {
          const loginSuccess = await loginUser(userMessage);
          if (loginSuccess) {
            typeMessage(language === 'hindi' ? "स्वागत है! आप सफलतापूर्वक लॉगिन हो गए हैं।" : "Welcome! You have successfully logged in.", 'bot');
            setTimeout(() => {
              typeMessage(getText('enterDescription'), 'bot');
              setCurrentStep('description');
            }, 1500);
          } else {
            typeMessage(language === 'hindi' ? "लॉगिन में त्रुटि हुई। कृपया दोबारा कोशिश करें।" : "Login error occurred. Please try again.", 'bot');
          }
        } else if (userExists === "notexist") {
          // Store phone number for new user registration
          localStorage.setItem('registration_phone', userMessage);
          typeMessage(getText('enterName'), 'bot');
          setCurrentStep('name');
        } else {
          typeMessage(language === 'hindi' ? "कनेक्शन की समस्या है। कृपया दोबारा कोशिश करें।" : "Connection problem. Please try again.", 'bot');
        }
        break;

      case 'name':
        if (!userMessage.trim()) {
          typeMessage(language === 'hindi' ? "कृपया वैध नाम दर्ज करें।" : "Please enter a valid name.", 'bot');
          return;
        }
        setUserData(prev => ({ ...prev, name: userMessage }));
        typeMessage(getText('selectState'), 'bot');
        setTimeout(() => {
          const stateOptions = indianStates.map((state: {name: string; key: string}) => state.name);
          addMessage("", 'bot', stateOptions);
          setCurrentStep('state');
        }, 1000);
        break;

      case 'state':
        if (!indianStates.find((s: {name: string; key: string}) => s.name === userMessage)) {
          typeMessage(language === 'hindi' ? "कृपया दिए गए विकल्पों में से राज्य चुनें।" : "Please select a state from the given options.", 'bot');
          return;
        }
        handleStateSelection(userMessage);
        break;

      case 'district':
        if (!districts.find((d: District) => d.name === userMessage)) {
          typeMessage(language === 'hindi' ? "कृपया दिए गए विकल्पों में से जिला चुनें।" : "Please select a district from the given options.", 'bot');
          return;
        }
        handleDistrictSelection(userMessage);
        break;

      case 'assembly':
        if (!assemblies.find((a: Assembly) => a.name === userMessage)) {
          typeMessage(language === 'hindi' ? "कृपया दिए गए विकल्पों में से विधानसभा क्षेत्र चुनें।" : "Please select an assembly constituency from the given options.", 'bot');
          return;
        }
        setUserData(prev => ({ ...prev, assembly: userMessage }));
        typeMessage(getText('enterBooth'), 'bot');
        setCurrentStep('booth');
        break;

      case 'booth':
        if (!userMessage.trim()) {
          typeMessage(language === 'hindi' ? "कृपया वैध बूथ नंबर दर्ज करें।" : "Please enter a valid booth number.", 'bot');
          return;
        }
        setUserData(prev => ({ ...prev, boothNumber: userMessage }));

        // Check if this is a new user that needs to be created
        const registrationPhone = localStorage.getItem('registration_phone');
        if (registrationPhone && !isAuthenticated) {
          typeMessage(language === 'hindi' ? "उपयोगकर्ता खाता बनाया जा रहा है..." : "Creating user account...", 'bot');

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
            typeMessage(getText('enterDescription'), 'bot');
            setCurrentStep('description');
          } else {
            typeMessage(language === 'hindi' ? "खाता बनाने में त्रुटि हुई। कृपया दोबारा कोशिश करें।" : "Error creating account. Please try again.", 'bot');
            setCurrentStep('mobile');
          }
        } else {
          typeMessage(getText('enterDescription'), 'bot');
          setCurrentStep('description');
        }
        break;

      case 'description':
        if (!userMessage.trim()) {
          typeMessage(language === 'hindi' ? "कृपया समस्या का विवरण दें।" : "Please provide problem description.", 'bot');
          return;
        }
        setUserData(prev => ({ ...prev, description: userMessage }));
        typeMessage(getText('uploadDocuments'), 'bot');
        setTimeout(() => {
          setShowImageUpload(true);
          addMessage(language === 'hindi' ? "फ़ाइल अपलोड करने के लिए नीचे दिए गए बटन का उपयोग करें:" : "Use the button below to upload files:", 'bot');
        }, 1000);
        setCurrentStep('images');
        break;

      case 'completed':
        typeMessage(language === 'hindi' ? "आपकी रिपोर्ट पहले से ही सबमिट हो चुकी है। नई रिपोर्ट के लिए पेज को रिफ्रेश करें।" : "Your report has already been submitted. Refresh the page for a new report.", 'bot');
        break;

      default:
        typeMessage(language === 'hindi' ? "मुझे समझ नहीं आया। कृपया दिए गए निर्देशों का पालन करें।" : "I didn't understand. Please follow the given instructions.", 'bot');
    }
  };

  const handleOptionClick = (option: string) => {
    addMessage(option, 'user');

    switch (currentStep) {
      case 'language':
        handleLanguageSelection(option);
        break;
      case 'state':
        handleStateSelection(option);
        break;
      case 'district':
        handleDistrictSelection(option);
        break;
      case 'assembly':
        setUserData(prev => ({ ...prev, assembly: option }));
        typeMessage(getText('enterBooth'), 'bot');
        setCurrentStep('booth');
        break;
    }
  };

  const downloadCertificate = (certificateUrl: string, userName: string) => {
    if (certificateUrl && userName) {
      const link = document.createElement('a');
      link.href = certificateUrl;
      link.download = `${userName}_Certificate.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const startNewComplaint = () => {
    // Reset form data but keep user authentication
    setSelectedImages([]);
    setUploadedImages([]);
    setShowImageUpload(false);
    setUserData(prev => ({
      mobile: prev.mobile,
      name: prev.name,
      state: prev.state,
      district: prev.district,
      assembly: prev.assembly,
      boothNumber: prev.boothNumber,
      description: ''
    }));
    setCertificateUrl('');
    setCertificates([]);

    // Add message and move to description step
    addMessage(getText('enterDescription'), 'bot');
    setCurrentStep('description');
  };

  const changeLanguage = (newLanguage: 'hindi' | 'english') => {
    setLanguage(newLanguage);
    setShowLanguageModal(false);
  };

  const resetChat = () => {
    setMessages([]);
    setUserData({});
    setSelectedImages([]);
    setUploadedImages([]);
    setShowImageUpload(false);
    setIsAuthenticated(false);
    setCurrentStep('language');
    setCertificateUrl('');
    setCertificates([]);
    localStorage.removeItem('registration_phone');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Reinitialize chat after clearing everything
    setTimeout(() => {
      initializeChat();
    }, 100);
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
              <h1 className="font-bold text-xl text-gray-900">
                {language === 'hindi' ? 'वोटर रोल ऑडिट सहायक' : 'Voter Roll Audit Assistant'}
              </h1>
              <p className="text-sm text-gray-600">
                {language === 'hindi' ? 'मतदाता सूची विसंगति रिपोर्टिंग' : 'Voter List Discrepancy Reporting'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLanguageModal(true)}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
              title={language === 'hindi' ? 'भाषा बदलें' : 'Change Language'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </button>
            <button
              onClick={resetChat}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
              title={language === 'hindi' ? 'नई चैट शुरू करें' : 'Start New Chat'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
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

        {/* Certificate Preview */}
        {certificates.length > 0 && (
          <div className="space-y-4">
            {certificates.map((cert, index) => (
              <div key={index} className="flex justify-start">
                <div className="bg-white bg-opacity-95 backdrop-blur-sm shadow-lg px-4 py-3 rounded-2xl border border-gray-200 max-w-xs lg:max-w-md">
                  <div className="text-center">
                    <div className="mb-3">
                      <div className="w-24 h-16 mx-auto bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-md cursor-pointer hover:shadow-lg transition-shadow" onClick={() => downloadCertificate(cert.url, cert.name || 'certificate')}>
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">{language === 'hindi' ? `प्रमाण पत्र ${index + 1}` : `Certificate ${index + 1}`}</p>
                      <p className="text-xs text-gray-600">{cert.name}</p>
                    </div>
                    <button
                      onClick={() => downloadCertificate(cert.url, cert.name || 'certificate')}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg transition-all shadow-md flex items-center gap-2 mx-auto"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {getText('downloadCertificate')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New Complaint Button - Show after completion */}
        {currentStep === 'completed' && isAuthenticated && (
          <div className="flex justify-start">
            <div className="bg-white bg-opacity-95 backdrop-blur-sm shadow-lg px-4 py-3 rounded-2xl border border-gray-200">
              <button
                onClick={startNewComplaint}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all shadow-md flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                {getText('newComplaint')}
              </button>
            </div>
          </div>
        )}

        {(isTyping || isCreatingUser) && (
          <div className="flex justify-start">
            <div className="bg-white bg-opacity-95 backdrop-blur-sm shadow-lg px-4 py-3 rounded-2xl border border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                {isCreatingUser && <span className="text-xs text-gray-600 ml-2">{language === 'hindi' ? 'उपयोगकर्ता बनाया जा रहा है...' : 'Creating user...'}</span>}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Image Upload Section */}
      {showImageUpload && currentStep !== 'completed' && (
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
              {language === 'hindi' ? '📎 फ़ाइल चुनें' : '📎 Choose Files'}
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
                    {language === 'hindi' ? '⏳ अपलोड हो रहा...' : '⏳ Uploading...'}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {language === 'hindi' ? `📤 अपलोड करें (${selectedImages.length})` : `📤 Upload (${selectedImages.length})`}
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
                    {language === 'hindi' ? 'सबमिट हो रहा...' : 'Submitting...'}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {language === 'hindi' ? `✅ सबमिट करें (${uploadedImages.length} फ़ाइल)` : `✅ Submit (${uploadedImages.length} files)`}
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
                  <Image
                    src={image.url}
                    alt={image.name}
                    width={80}
                    height={80}
                    className="w-full h-20 object-cover rounded-lg border-2 border-yellow-300 shadow-sm"
                    unoptimized
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
                  <Image
                    src={image.url}
                    alt={image.name}
                    width={80}
                    height={80}
                    className="w-full h-20 object-cover rounded-lg border-2 border-green-300 shadow-sm"
                    unoptimized
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
      {currentStep !== 'images' && currentStep !== 'completed' && currentStep !== 'language' && (
        <div className="relative z-10 p-4 bg-transparent border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <textarea
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={
                  currentStep === 'mobile' ? 
                    (language === 'hindi' ? "मोबाइल नंबर दर्ज करें..." : "Enter mobile number...") :
                  currentStep === 'name' ? 
                    (language === 'hindi' ? "अपना नाम दर्ज करें..." : "Enter your name...") :
                  currentStep === 'booth' ? 
                    (language === 'hindi' ? "बूथ नंबर दर्ज करें..." : "Enter booth number...") :
                  currentStep === 'description' ? 
                    (language === 'hindi' ? "समस्या का विवरण दें..." : "Describe the problem...") :
                    (language === 'hindi' ? "यहाँ टाइप करें..." : "Type here...")
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

      {/* Language Change Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 m-4 max-w-sm w-full shadow-2xl">
            <h2 className="text-xl font-bold text-center mb-4 text-gray-800">
              {language === 'hindi' ? 'भाषा चुनें / Select Language' : 'Select Language / भाषा चुनें'}
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => changeLanguage('english')}
                className="w-full p-3 text-left text-[#000] bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all border border-gray-200 hover:border-blue-300"
              >
                English
              </button>
              <button
                onClick={() => changeLanguage('hindi')}
                className="w-full p-3 text-left text-[#000] bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all border border-gray-200 hover:border-blue-300"
              >
                हिंदी
              </button>
            </div>
            <button
              onClick={() => setShowLanguageModal(false)}
              className="w-full mt-4 p-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-gray-700"
            >
              {language === 'hindi' ? 'रद्द करें / Cancel' : 'Cancel / रद्द करें'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}