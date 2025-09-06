"use client";

import { useState } from "react";
import Image from "next/image";
import bgImage from "../assets/bg.png";
import LawyerForm from "@/components/LawyerForm";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import logo from "../assets/logo.png";

export default function ElectoralDemocracyPage() {
  const { language, setLanguage } = useLanguage();
  const [showForm, setShowForm] = useState(false);

  const content = {
    hi: {
      title: "इलेक्टोरल डेमोक्रेसी टास्कफोर्स",
      description: "इलेक्टोरल डेमोक्रेसी टास्कफोर्स देशभर के जिला न्यायालय परिसरों में गठित की जाएगी, जिसमें स्वतंत्र अधिवक्ताओं, वकील संगठन और कानून के छात्रों को आमंत्रित किया गया है। यह पहल 'चुनावी लोकतंत्र की सुरक्षा' के विचार से प्रेरित है। इसका उद्देश्य है कि हर पात्र मतदाता को मतदान का अवसर मिले, चुनावी प्रक्रिया निष्पक्ष एवं पारदर्शी रहे और चुनाव से जुड़े आपराधिक मामलों पर तत्काल कार्यवाही हो।",
      start: "शुरू करें →"
    },
    en: {
      title: "Electoral Democracy Taskforce",
      description: "The Electoral Democracy Taskforce will be formed across district court premises in India, inviting independent advocates, bar associations and law students. Inspired by the idea of safeguarding electoral democracy, its purpose is to ensure every eligible voter can vote, the process remains fair and transparent, and election-related offences are acted upon promptly.",
      start: "Start →"
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
      <div className="relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center p-4 md:p-6">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Image src={logo} alt="VoteChori logo" width={200} height={50} className="h-10 md:h-12 w-auto" />
            </Link>
          </div>
          
          {/* Language Selector */}
          <button
            onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
            className="px-4 py-2 rounded-lg font-bold text-[#AD1818] border-2 border-[#AD1818] bg-white hover:bg-[#ad18180d] transition-colors flex items-center gap-2"
          >
            {language === 'hi' ? 'हिंदी' : 'English'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </header>

        {/* Main Content */}
        <div className="min-h-[calc(100vh-100px)] flex items-center justify-center p-4">
          <div className="w-full max-w-3xl">
            {!showForm ? (
              /* Description Card */
              <div className="bg-white/95 dark:bg-black/60 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100">
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-6">
                  {currentContent.title}
                </h1>
                <p className="text-neutral-700 dark:text-neutral-300 mb-8 leading-relaxed">
                  {currentContent.description}
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-3 rounded-lg font-bold text-[#AD1818] border-2 border-[#AD1818] bg-white hover:bg-[#ad18180d] transition-colors"
                >
                  {currentContent.start}
                </button>
              </div>
            ) : (
              /* Form */
              <LawyerForm />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
