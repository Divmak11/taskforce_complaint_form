"use client";

import Link from "next/link";
import Image from "next/image";
import bgImage from "./assets/bg.png";
import a1 from "./assets/a1.jpeg";
import a2 from "./assets/a2.jpeg";
import a3 from "./assets/a3.jpeg";
import logo from "./assets/logo.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const { language, setLanguage } = useLanguage();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      language: "हिंदी",
      heroTitle1: "StopVoteChori – बिहार में लोकतंत्र बचाओ",
      heroParagraph:
        "2020 चुनाव ने दिखाया कि 12 वोट का भी फासला सत्ता तय कर सकता है। इस अभियान से आज देशभर के युवा, नागरिक और मानवाधिकार संगठन जुड़ चुके हैं। आज राजनीति वहाँ पहुँच गई है जहाँ नीतियों पर कानून तोड़ने के आरोप हैं और जनता को ही साबित करना पड़ रहा है कि वह 'वोटर' है। यही लोकतंत्र का सबसे बड़ा संकट है।",
      heroTitle2: "StopVoteChori अभियान यह संदेश देता है कि—",
      heroBullets: [
        "हर वोट की रक्षा जनता करेगी।",
        "हर गलती, हर गड़बड़ी पर सवाल उठेगा।",
        "और हर नागरिक लोकतंत्र का प्रहरी बनेगा।",
      ],
    },
    en: {
      title: "Taskforce For Electoral Democracy",
      subtitle: "Electoral Democracy Taskforce | Bihar",
      description: "The Electoral Democracy Taskforce will be formed in all district court premises in Bihar, inviting independent advocates, lawyer organizations and law students. This initiative is inspired by Rahul Gandhi's idea of 'Protection of Electoral Democracy'. Its sole objective is to ensure that every eligible voter gets the opportunity to vote, the electoral process remains fair and transparent, and immediate action is taken on criminal cases related to elections.",
      electoralDemocracy: "Electoral Democracy",
      legalTaskforce: "Legal Taskforce",
      alliance: "Alliances",
      demandsMade: "EC DEMANDS MADE",
      peopleCount: "28,19,731",
      peopleStand: "People have already taken a stand!",
      willYou: "Will you be next?",
      language: "English",
      heroTitle1: "StopVoteChori — Save Democracy in Bihar",
      heroParagraph:
        "The 2020 election showed that even a margin of 12 votes can decide power. Today, youth, citizens and human-rights groups across the country have rallied behind this campaign. Politics increasingly stands accused of breaking rules, and citizens are often forced to prove they are 'voters'. This is the gravest crisis for our democracy.",
      heroTitle2: "StopVoteChori stands for —",
      heroBullets: [
        "People will protect every vote.",
        "We will question every mistake and malpractice.",
        "Every citizen will be a sentinel of democracy.",
      ],
    }
  };

  const currentContent = content[language];
  
  const metrics = language === 'hi'
    ? [
        { title: currentContent.demandsMade, value: currentContent.peopleCount, subtitle: currentContent.peopleStand },
        { title: 'शिकायतें दर्ज', value: '1,24,512', subtitle: 'जिला स्तर पर रिपोर्ट्स' },
        { title: 'स्वयंसेवक सक्रिय', value: '12,340', subtitle: 'आज' },
      ]
    : [
        { title: currentContent.demandsMade, value: currentContent.peopleCount, subtitle: currentContent.peopleStand },
        { title: 'Complaints Filed', value: '1,24,512', subtitle: 'Reported at district level' },
        { title: 'Volunteers Active', value: '12,340', subtitle: 'Today' },
      ];

  const learnMoreLabel = language === 'hi' ? 'और जानें' : 'Learn More';

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      {/* Header with Logo and Language Selector on White Background */}
      <header className="flex justify-between items-center mb-4 md:mb-8">
        {/* VoteChori Logo */}
        <div className="flex items-center">
          <Image src={logo} alt="VoteChori logo" width={200} height={50} className="h-10 md:h-12 w-auto" />
        </div>
        
        {/* Language Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="px-4 py-2 border border-blue-400 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors flex items-center gap-2 min-w-[120px] justify-between"
          >
            {language === 'hi' ? 'हिंदी' : 'English'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Language Dropdown */}
          {showLanguageDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-blue-400 rounded-lg shadow-lg z-20">
              <button
                onClick={() => {
                  setLanguage('en');
                  setShowLanguageDropdown(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors ${
                  language === 'en' ? 'bg-blue-100' : ''
                }`}
              >
                English
              </button>
              <button
                onClick={() => {
                  setLanguage('hi');
                  setShowLanguageDropdown(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors rounded-b-lg ${
                  language === 'hi' ? 'bg-blue-100' : ''
                }`}
              >
                हिंदी
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area with Background Image */}
      <div className="relative rounded-lg overflow-hidden min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-12rem)]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={bgImage}
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Main Content */}
          <main className="container mx-auto px-4 py-8">
          {/* Hero Section (split: intro outside card, bullets inside card) */}
          <div className="max-w-6xl mx-auto mb-12 md:mb-16">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-10 items-start">
              {/* Left: Headline + intro + Learn More (outside card) */}
              <div className="md:col-span-3">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">{currentContent.heroTitle1}</h1>
                <p className="text-gray-800/95 leading-relaxed md:text-lg">{currentContent.heroParagraph}</p>
                <div className="mt-4">
                  <Link
                    href="/stop-vote-chori"
                    className="inline-block px-5 py-2 rounded-lg font-bold text-[#AD1818] border-2 border-[#AD1818] bg-white hover:bg-[#ad18180d] transition-colors"
                  >
                    {learnMoreLabel} →
                  </Link>
                </div>
              </div>

              {/* Right: Card with key bullets */}
              <div className="md:col-span-2 md:justify-self-end md:max-w-sm w-full">
                <div className="relative overflow-hidden rounded-2xl border border-gray-300 bg-gradient-to-br from-white/85 to-[#AD1818]/5 backdrop-blur-sm shadow-lg">
                  <div className="relative p-5 md:p-6">
                    <h2 className="text-lg md:text-xl font-semibold mb-3">{currentContent.heroTitle2}</h2>
                    <ul className="space-y-2.5 md:space-y-3 text-gray-800">
                      {(currentContent.heroBullets as string[]).map((b, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#AD1818]"></span>
                          <span className="md:text-lg">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 mt-8 mb-20">
            {/* Electoral Democracy Button */}
            <Link href="/electoral-democracy">
              <div className="group cursor-pointer">
                <div className="w-40 h-40 bg-[#AD1818] rounded-full flex items-center justify-center mb-4 transition-all duration-200 ease-out shadow-md group-hover:bg-[#8B1414] group-hover:shadow-2xl group-hover:-translate-y-1 group-hover:scale-105">
                  <svg className="w-16 h-16 text-white transition-transform duration-200 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
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
                <div className="w-40 h-40 bg-[#AD1818] rounded-full flex items-center justify-center mb-4 transition-all duration-200 ease-out shadow-md group-hover:bg-[#8B1414] group-hover:shadow-2xl group-hover:-translate-y-1 group-hover:scale-105">
                  <svg className="w-16 h-16 text-white transition-transform duration-200 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
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

          {/* EC Demands Carousel */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
              {currentContent.demandsMade}
            </h2>
            {/* Mobile carousel */}
            <div className="-mx-4 px-4 md:hidden">
              <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
                {metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="min-w-[260px] bg-white/90 backdrop-blur-sm rounded-xl border-2 border-gray-800 p-6 snap-center h-80 flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-xs font-medium text-gray-600 mb-2">{m.title}</h3>
                      <div className="text-4xl font-bold text-[#AD1818] mb-2">{m.value}</div>
                      <p className="text-sm text-gray-600">{m.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop 3-up */}
            <div className="hidden md:grid grid-cols-3 gap-6">
              {metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="bg-white/90 backdrop-blur-sm rounded-xl border-2 border-gray-800 p-6 h-96 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">{m.title}</h3>
                    <div className="text-5xl font-bold text-[#AD1818] mb-2">{m.value}</div>
                    <p className="text-sm text-gray-600">{m.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alliance Section */
          }
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              {currentContent.alliance}
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-6">
              {[a1, a2, a3].map((logo, idx) => (
                <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-300 p-4">
                  <Image src={logo} alt={`Alliance logo ${idx + 1}`} width={140} height={60} className="object-contain" />
                </div>
              ))}
            </div>
          </div>
          </main>
        </div>
      </div>
      
    </div>
  );
}
