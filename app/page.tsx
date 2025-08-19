"use client";

import Link from "next/link";
import Image from "next/image";
import bgImage from "./assets/bg.png";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { language, setLanguage } = useLanguage();

  const content = {
    hi: {
      title: "Taskforce For Electoral Democracy",
      subtitle: "इलेक्टोरल डेमोक्रेसी टास्कफोर्स | बिहार",
      description: "इलेक्टोरल डेमोक्रेसी टास्कफोर्स बिहार के सभी जिला न्यायालय परिसरों में गठित की जाएगी, जिसमें स्वतंत्र अधिवक्ताओं, वकील संगठन और कानून के छात्रों को आमंत्रित किया गया है। यह पहल राहुल गांधी के 'चुनावी लोकतंत्र की सुरक्षा' के विचार से प्रेरित है। इसका एकमात्र ध्येय यह है कि हर पात्र मतदाता को मतदान का अवसर मिले, चुनावी प्रक्रिया निष्पक्ष एवं पारदर्शी रहे और चुनाव से जुड़े आपराधिक मामलों पर तत्काल कार्यवाही हो।",
      electoralDemocracy: "इलेक्टोरल डेमोक्रेसी",
      legalTaskforce: "लीगल टास्कफोर्स",
      alliance: "गठबंधन",
      demandsMade: "ईसी मांगें की गईं",
      peopleCount: "28,19,731",
      peopleStand: "लोग पहले ही अपना रुख ले चुके हैं!",
      willYou: "क्या आप अगले होंगे?",
      language: "हिंदी"
    },
    en: {
      title: "Taskforce For Electoral Democracy",
      subtitle: "Electoral Democracy Taskforce | Bihar",
      description: "The Electoral Democracy Taskforce will be formed in all district court premises in Bihar, inviting independent advocates, lawyer organizations and law students. This initiative is inspired by Rahul Gandhi's idea of 'Protection of Electoral Democracy'. Its sole objective is to ensure that every eligible voter gets the opportunity to vote, the electoral process remains fair and transparent, and immediate action is taken on criminal cases related to elections.",
      electoralDemocracy: "Electoral Democracy",
      legalTaskforce: "Legal Taskforce",
      alliance: "Alliance",
      demandsMade: "EC DEMANDS MADE",
      peopleCount: "28,19,731",
      peopleStand: "People have already taken a stand!",
      willYou: "Will you be next?",
      language: "English"
    }
  };

  const currentContent = content[language];

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src={bgImage}
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="flex justify-between items-center p-4 md:p-6">
          {/* Logo Space - Left empty as requested */}
          <div className="w-32 h-12"></div>
          
          {/* Language Selector */}
          <button
            onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
            className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-white/20 transition-colors flex items-center gap-2"
          >
            {language === 'hi' ? 'हिंदी' : 'English'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Main Action Buttons */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-16">
            {/* Electoral Democracy Button */}
            <Link href="/electoral-democracy">
              <div className="group cursor-pointer">
                <div className="w-40 h-40 bg-[#AD1818] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#8B1414] transition-colors">
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                </div>
                <h3 className="text-center text-lg font-bold text-gray-900">
                  {currentContent.electoralDemocracy}
                </h3>
              </div>
            </Link>

            {/* Legal Taskforce Button */}
            <Link href="/legal-taskforce">
              <div className="group cursor-pointer">
                <div className="w-40 h-40 bg-[#AD1818] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#8B1414] transition-colors">
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 className="text-center text-lg font-bold text-gray-900">
                  {currentContent.legalTaskforce}
                </h3>
              </div>
            </Link>
          </div>

          {/* YouTube Video */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.youtube.com/embed/-cc9wpgIYPc"
                title="Vote Chori 2024"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* EC Demands Counter */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg border-2 border-gray-800 p-8 text-center">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                {currentContent.demandsMade}
              </h3>
              <div className="text-4xl md:text-6xl font-bold text-[#AD1818] mb-2">
                {currentContent.peopleCount}
              </div>
              <p className="text-sm text-gray-600 mb-1">
                {currentContent.peopleStand}
              </p>
              <p className="text-sm font-medium text-gray-800">
                {currentContent.willYou}
              </p>
            </div>
          </div>

          {/* Alliance Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              {currentContent.alliance}
            </h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="w-64 h-32 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-300 flex items-center justify-center"
                >
                  <span className="text-gray-400 text-sm">Coming Soon</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
