"use client";

import Link from "next/link";
import Image from "next/image";
import bgImage from "./assets/bg.png";
import hallabolIcon from "./assets/hallabol_icon.png";
import iycIcon from "./assets/iyc_icon.png";
import icluIcon from "./assets/iclu_icon.png";
import logo from "./assets/logo.png";
import balanceIcon from "./assets/balance_icon.png";
import pointyFingerIcon from "./assets/pointyFingerIcon.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const { language, setLanguage } = useLanguage();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.innerWidth < 768);
    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);
    return () => {
      window.removeEventListener('resize', updateIsMobile);
    };
  }, []);

  const content = {
    hi: {
      title: "इलेक्टोरल डेमोक्रेसी टास्कफोर्स",
      subtitle: "इलेक्टोरल डेमोक्रेसी टास्कफोर्स | बिहार",
      description: "इलेक्टोरल डेमोक्रेसी टास्कफोर्स बिहार के सभी जिला न्यायालय परिसरों में गठित की जाएगी, जिसमें स्वतंत्र अधिवक्ताओं, वकील संगठन और कानून के छात्रों को आमंत्रित किया गया है। यह पहल राहुल गांधी के 'चुनावी लोकतंत्र की सुरक्षा' के विचार से प्रेरित है। इसका एकमात्र ध्येय यह है कि हर पात्र मतदाता को मतदान का अवसर मिले, चुनावी प्रक्रिया निष्पक्ष एवं पारदर्शी रहे और चुनाव से जुड़े आपराधिक मामलों पर तत्काल कार्यवाही हो।",
      electoralDemocracy: "कंप्लेंट करे",
      legalTaskforce: "लीगल टीम से जुड़ें",
      registerComplaint: "शिकायत दर्ज करें",
      alliance: "गठबंधन",
      demandsMade: "ईसी मांगें की गईं",
      peopleCount: "28,19,731",
      peopleStand: "लोग पहले ही अपना रुख ले चुके हैं!",
      willYou: "क्या आप अगले होंगे?",
      language: "हिंदी",
      heroTitle1: "स्टॉप वोट चोरी — बिहार में लोकतंत्र बचाओ",
      heroParagraph:
        "देशभर में हुए चुनाव में धांधली के बाद बिहार में इसे रोकना ही आज का राष्ट्र धर्म है। जनता के मत को बचाने के लिए और संविधान पर हो रहे हमले को रोकने के लिए हमारी टीम बनी है। इस अभियान से आज देशभर के युवा, नागरिक और मानवाधिकार संगठन जुड़ चुके हैं। आज जनता को ही साबित करना पड़ रहा है कि वह 'वोटर' है। इसीलिए बेहद जरूरी है की आप इस चुनाव पर अपनी निगाह बनाये रखें और कोई भी असंवैधानिक काम नहीं होने दें।",
      heroTitle2: "स्टॉप वोट चोरी अभियान यह संदेश देता है कि—",
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
      electoralDemocracy: "File Complaint",
      legalTaskforce: "Join Legal Team",
      registerComplaint: "Register Complaint",
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
  
  // metrics removed (EC Demands section is commented out)

  // Mobile alliance carousel state
  const [allianceIndex, setAllianceIndex] = useState(0);
  const allianceItems = [
    { src: hallabolIcon, alt: 'Alliance logo 1', w: 120, h: 120 },
    { src: iycIcon, alt: 'Alliance logo 2', w: 130, h: 140 },
    // ICLU 3x size on mobile (was ~180x90)
    { src: icluIcon, alt: 'Alliance logo 3', w: 540, h: 270 },
  ];
  const prevAlliance = () => setAllianceIndex((i) => (i - 1 + allianceItems.length) % allianceItems.length);
  const nextAlliance = () => setAllianceIndex((i) => (i + 1) % allianceItems.length);

  // Auto-advance alliance carousel on mobile
  useEffect(() => {
    if (!isMobile) return;
    const id = window.setInterval(() => {
      setAllianceIndex((i) => (i + 1) % allianceItems.length);
    }, 2500);
    return () => window.clearInterval(id);
  }, [isMobile, allianceItems.length]);

  const learnMoreLabel = language === 'hi' ? 'और जानें' : 'Learn More';

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-4 md:p-8">
      {/* Header with Logo and Language Selector on White Background */}
      <header className="flex justify-between items-center mb-4 md:mb-8">
        {/* VoteChori Logo */}
        <div className="flex items-center">
          <Image src={logo} alt="VoteChori logo" width={200} height={50} className="h-10 md:h-12 w-auto home-logo" />
        </div>
        
        {/* Language Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="px-4 py-2 rounded-lg font-bold text-[#AD1818] border-2 border-[#AD1818] bg-white hover:bg-[#ad18180d] transition-colors flex items-center gap-2 min-w-[120px] justify-between"
          >
            {language === 'hi' ? 'हिंदी' : 'English'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Language Dropdown */}
          {showLanguageDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border-2 border-[#AD1818] rounded-lg shadow-lg z-20">
              <button
                onClick={() => {
                  setLanguage('en');
                  setShowLanguageDropdown(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-[#ad18180d] transition-colors text-black ${
                  language === 'en' ? 'bg-[#ad18181a]' : ''
                }`}
              >
                English
              </button>
              <button
                onClick={() => {
                  setLanguage('hi');
                  setShowLanguageDropdown(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-[#ad18180d] transition-colors rounded-b-lg text-black ${
                  language === 'hi' ? 'bg-[#ad18181a]' : ''
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
                <div className="bg-white/90 md:bg-transparent rounded-xl p-4 md:p-0">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3 text-black">{currentContent.heroTitle1}</h1>
                  <p className="text-black leading-relaxed md:text-lg">{currentContent.heroParagraph}</p>
                  <div className="mt-4">
                    <Link
                      href="/stop-vote-chori"
                      className="inline-block px-5 py-2 rounded-lg font-bold text-[#AD1818] border-2 border-[#AD1818] bg-white hover:bg-[#ad18180d] transition-colors"
                    >
                      {learnMoreLabel} →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right: Card with key bullets */}
              <div className="md:col-span-2 md:justify-self-end md:max-w-sm w-full">
                <div className="relative overflow-hidden rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-gradient-to-br from-white/85 to-[#AD1818]/5 dark:from-black/60 dark:to-[#AD1818]/10 backdrop-blur-sm shadow-lg">
                  <div className="relative p-5 md:p-6">
                    <h2 className="text-lg md:text-xl font-semibold mb-3">{currentContent.heroTitle2}</h2>
                    <ul className="space-y-2.5 md:space-y-3 text-black/90 dark:text-white/90">
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
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 mt-8 mb-20">
            {/* Electoral Democracy Button */}
            <Link href="/legal-taskforce">
              <div className="group cursor-pointer">
                <div className="w-40 h-40 bg-[#AD1818] rounded-full flex items-center justify-center mb-4 transition-all duration-200 ease-out shadow-md group-hover:bg-[#8B1414] group-hover:shadow-2xl group-hover:-translate-y-1 group-hover:scale-105 cta-pulse">
                  <Image src={pointyFingerIcon} alt="Electoral Democracy" width={88} height={88} className="w-[88px] h-[88px] object-contain brightness-0 invert contrast-200 transition-transform duration-200 group-hover:scale-110" />
                </div>
                <h3 className="text-center text-lg font-bold text-black">
                  {currentContent.electoralDemocracy}
                </h3>
              </div>
            </Link>

            {/* Legal Taskforce Button */}
            <Link href="/electoral-democracy">
              <div className="group cursor-pointer">
                <div className="w-40 h-40 bg-[#AD1818] rounded-full flex items-center justify-center mb-4 transition-all duration-200 ease-out shadow-md group-hover:bg-[#8B1414] group-hover:shadow-2xl group-hover:-translate-y-1 group-hover:scale-105 cta-pulse">
                  <Image src={balanceIcon} alt="Legal Taskforce" width={88} height={88} className="w-[88px] h-[88px] object-contain brightness-0 invert contrast-200 transition-transform duration-200 group-hover:scale-110" />
                </div>
                <h3 className="text-center text-lg font-bold text-black">
                  {currentContent.legalTaskforce}
                </h3>
              </div>
            </Link>

            {/* Register Complaint Button */}
            <a href="#" onClick={(e) => { e.preventDefault(); /* TODO: Add chatbot integration */ }}>
              <div className="group cursor-pointer">
                <div className="w-40 h-40 bg-[#AD1818] rounded-full flex items-center justify-center mb-4 transition-all duration-200 ease-out shadow-md group-hover:bg-[#8B1414] group-hover:shadow-2xl group-hover:-translate-y-1 group-hover:scale-105 cta-pulse">
                  {/* Chat/Message Icon */}
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="w-[80px] h-[80px] text-white transition-transform duration-200 group-hover:scale-110">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    <path d="M8 9h8"/>
                    <path d="M8 13h6"/>
                  </svg>
                </div>
                <h3 className="text-center text-lg font-bold text-black">
                  {currentContent.registerComplaint}
                </h3>
              </div>
            </a>
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

          {/* EC Demands Carousel - commented out per request */}
          {/**
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
              {currentContent.demandsMade}
            </h2>
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
          **/}

          {/* Alliance Section */}
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-8 text-black">
              {currentContent.alliance}
            </h2>
            {/* Mobile carousel (one-at-a-time with arrows) */}
            <div className="-mx-4 px-4 md:hidden">
              <div className="relative flex items-center justify-center py-2" aria-label="Alliance carousel">
                {/* Slide */}
                <div className="w-full flex items-center justify-center min-h-[200px]">
                  <Image
                    key={allianceIndex}
                    src={allianceItems[allianceIndex].src}
                    alt={allianceItems[allianceIndex].alt}
                    width={allianceItems[allianceIndex].w}
                    height={allianceItems[allianceIndex].h}
                    sizes="(max-width: 768px) 90vw, 400px"
                    className="object-contain max-w-[90%] h-auto"
                    loading="eager"
                    priority
                    unoptimized
                  />
                </div>
                {/* Prev */}
                <button
                  type="button"
                  onClick={prevAlliance}
                  className="absolute left-0 top-1/2 -translate-y-1/2 ml-1 px-3 py-2 rounded-full font-bold text-[#AD1818] border-2 border-[#AD1818] bg-white hover:bg-[#ad18180d] active:scale-95"
                  aria-label="Previous"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {/* Next */}
                <button
                  type="button"
                  onClick={nextAlliance}
                  className="absolute right-0 top-1/2 -translate-y-1/2 mr-1 px-3 py-2 rounded-full font-bold text-[#AD1818] border-2 border-[#AD1818] bg-white hover:bg-[#ad18180d] active:scale-95"
                  aria-label="Next"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Desktop layout */}
            <div className="hidden md:grid grid-cols-3 items-center justify-items-center gap-8">
              <Image src={hallabolIcon} alt="Alliance logo 1" width={160} height={160} className="object-contain" />
              <Image src={iycIcon} alt="Alliance logo 2" width={180} height={160} className="object-contain" />
              <Image src={icluIcon} alt="Alliance logo 3" width={550} height={440} className="object-contain" />
            </div>
          </div>
          </main>
        </div>
      </div>
      
    </div>
  );
}
