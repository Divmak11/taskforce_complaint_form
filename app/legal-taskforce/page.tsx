"use client";

import { useState } from "react";
import Image from "next/image";
import bgImage from "../assets/bg.png";
import MultiStepForm from "@/components/MultiStepForm";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LegalTaskforcePage() {
  const { language, setLanguage } = useLanguage();
  const [started, setStarted] = useState(false);

  const content = {
    hi: {
      title: "Legal Taskforce",
      description: "यह फॉर्म चुनावी अनियमितताओं और शिकायतों की रिपोर्ट करने के लिए है। कृपया सभी आवश्यक जानकारी प्रदान करें ताकि हम आपकी शिकायत पर उचित कार्रवाई कर सकें।",
      start: "शुरू करें →",
      language: "English"
    },
    en: {
      title: "Legal Taskforce",
      description: "This form is for reporting electoral irregularities and complaints. Please provide all necessary information so that we can take appropriate action on your complaint.",
      start: "Start →",
      language: "हिंदी"
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
          {/* Logo Space - Left empty */}
          <div className="w-32 h-12"></div>
          
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

        <div className="min-h-[calc(100vh-100px)] flex items-center justify-center p-4">
          <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            {!started ? (
              <motion.section
                key="intro"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="bg-white/95 dark:bg-black/60 backdrop-blur-sm shadow-sm rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100"
              >
                <div className="p-6 md:p-8">
                  <h1 className="text-2xl md:text-3xl font-semibold mb-4 text-[var(--foreground)]">{currentContent.title}</h1>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{currentContent.description}</p>
                  <div className="mt-6">
                    <button
                      onClick={() => setStarted(true)}
                      className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-bold text-[#AD1818] border border-[#AD1818] bg-white hover:bg-[#ad18180d] focus:outline-none focus:ring-2 focus:ring-[#AD1818]/30"
                    >
                      {currentContent.start}
                    </button>
                  </div>
                </div>
              </motion.section>
            ) : (
              <motion.section
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                <MultiStepForm />
              </motion.section>
            )}
          </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
