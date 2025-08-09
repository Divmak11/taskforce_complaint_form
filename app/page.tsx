"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { HEADER } from "@/lib/content";
import MultiStepForm from "@/components/MultiStepForm";
import headerImg from "../ss.jpg";

export default function Home() {
  const [started, setStarted] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <AnimatePresence mode="wait">
          {!started ? (
            <motion.section
              key="intro"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="bg-white shadow-sm rounded-2xl overflow-hidden border border-neutral-200"
            >
              <div className="relative h-48 w-full">
                <Image src={headerImg} alt="Header" fill className="object-cover" priority />
              </div>
              <div className="p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-semibold mb-2">{HEADER.title}</h1>
                <p className="text-neutral-700 leading-relaxed mb-2">{HEADER.descriptionEn}</p>
                <p className="text-neutral-700 leading-relaxed">{HEADER.descriptionHi}</p>
                <div className="mt-6">
                  <button
                    onClick={() => setStarted(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-5 py-3 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    Start →
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
  );
}
