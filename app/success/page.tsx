"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "../assets/logo.png";

export default function SuccessPage() {
  const { language, setLanguage } = useLanguage();

  const content = {
    hi: {
      title: "सफलतापूर्वक जमा किया गया",
      description: "विवरण साझा करने के लिए धन्यवाद। आपकी शिकायत दर्ज कर ली गई है।",
      cta: "एक और प्रतिक्रिया जमा करें",
    },
    en: {
      title: "Successful Submission",
      description: "Thank you for sharing the details. Your complaint has been recorded.",
      cta: "Submit another response",
    },
  } as const;

  const current = content[language as "hi" | "en"];

  return (
    <div className="min-h-screen p-6">
      {/* Header with logo and optional language toggle */}
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href="/">
            <Image src={logo} alt="VoteChori logo" width={200} height={50} className="h-10 md:h-12 w-auto" />
          </Link>
        </div>
        <button
          onClick={() => setLanguage(language === "hi" ? "en" : "hi")}
          className="px-4 py-2 rounded-lg font-bold text-[#AD1818] border-2 border-[#AD1818] bg-white hover:bg-[#ad18180d] transition-colors flex items-center gap-2"
        >
          {language === "hi" ? "हिंदी" : "English"}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </header>

      <div className="min-h-[calc(100vh-112px)] flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-neutral-200 p-10 max-w-lg w-full text-center shadow-sm text-neutral-900">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 10 }}
            className="mx-auto mb-6 h-24 w-24 rounded-full bg-green-100 flex items-center justify-center"
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-12 w-12 text-green-600"
            >
              <motion.path
                d="M20 6L9 17l-5-5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, ease: "easeInOut", delay: 0.2 }}
              />
            </motion.svg>
          </motion.div>
          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-2xl font-semibold mb-2"
          >
            {current.title}
          </motion.h1>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="text-neutral-700 mb-6"
          >
            {current.description}
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-bold text-[#AD1818] border-2 border-[#AD1818] bg-white hover:bg-[#ad18180d]"
            >
              {current.cta}
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
