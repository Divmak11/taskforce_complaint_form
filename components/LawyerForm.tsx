"use client";

import { useCallback, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lawyerFormSchema, LawyerFormValues } from "@/lib/lawyerSchema";
import { AnimatePresence, motion } from "framer-motion";
import { getSupabaseClient } from "@/lib/supabaseClient";

const stepVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

function StepWrapper({ children, step }: { children: React.ReactNode; step: number }) {
  return (
    <motion.div
      key={step}
      variants={stepVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="text-neutral-900"
    >
      {children}
    </motion.div>
  );
}

export default function LawyerForm() {
  const { language } = useLanguage();
  const form = useForm<LawyerFormValues>({
    resolver: zodResolver(lawyerFormSchema),
    mode: "onChange",
    criteriaMode: "all",
  });

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate only the current step
  const w = form.watch();
  const canProceed = useMemo(() => {
    const phoneOk = /^[6-9]\d{9}$/.test(w.whatsapp || "");
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(w.email || "");
    
    switch (step) {
      case 1:
        return (w.name || "").trim().length > 0;
      case 2:
        return phoneOk;
      case 3:
        return (w.practicing_court || "").trim().length > 0;
      case 4:
        return (w.assembly || "").trim().length > 0;
      case 5:
        return emailOk;
      default:
        return false;
    }
  }, [step, w.name, w.whatsapp, w.practicing_court, w.assembly, w.email]);

  const TOTAL_STEPS = 5;
  const next = useCallback(() => setStep((s) => Math.min(s + 1, TOTAL_STEPS)), []);
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const labels = {
    hi: {
      name: "आपका नाम क्या है? *",
      whatsapp: "नंबर (व्हाट्सएप) *",
      practicing_court: "प्रैक्टिसिंग कोर्ट (यदि एक से अधिक जिला हो तो शामिल करें) *",
      assembly: "विधानसभा (कोड के साथ नाम) *",
      email: "ईमेल *",
      placeholder: "आपका उत्तर",
      back: "वापस",
      ok: "ठीक",
      submit: "जमा करें",
      submitting: "जमा हो रहा है...",
      tip: "सुझाव: जारी रखने के लिए Enter ↵ दबाएं",
      step: "चरण",
      of: "का"
    },
    en: {
      name: "What is your Name? *",
      whatsapp: "Number (WhatsApp) *",
      practicing_court: "Practicing Court (Include if more than one District) *",
      assembly: "Vidhansabha/Assembly (Name with Code) *",
      email: "Email *",
      placeholder: "Your answer",
      back: "Back",
      ok: "OK",
      submit: "Submit",
      submitting: "Submitting...",
      tip: "Tip: press Enter ↵ to continue",
      step: "Step",
      of: "of"
    }
  };

  const currentLabels = labels[language];

  const steps = useMemo(() => {
    return [
      { id: 1, label: currentLabels.name, render: (
        <input
          autoFocus
          type="text"
          className="w-full border-b-2 border-[#AD1818] focus:outline-none text-lg p-2"
          placeholder={currentLabels.placeholder}
          {...form.register("name")}
          onKeyDown={(e) => { if (e.key === 'Enter' && canProceed) next(); }}
        />
      )},
      { id: 2, label: currentLabels.whatsapp, render: (
        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          className="w-full border-b-2 border-[#AD1818] focus:outline-none text-lg p-2"
          placeholder={currentLabels.placeholder}
          {...form.register("whatsapp")}
          onKeyDown={(e) => { if (e.key === 'Enter' && canProceed) next(); }}
        />
      )},
      { id: 3, label: currentLabels.practicing_court, render: (
        <textarea
          rows={1}
          onInput={(e) => {
            const t = e.currentTarget; 
            t.style.height = 'auto'; 
            t.style.height = `${Math.min(t.scrollHeight, 240)}px`;
          }}
          className="w-full border-b-2 border-[#AD1818] focus:outline-none text-lg p-2 min-h-[44px] max-h-60 overflow-y-auto resize-none"
          placeholder={currentLabels.placeholder}
          {...form.register("practicing_court")}
          onKeyDown={(e) => { if (e.key === 'Enter' && canProceed) next(); }}
        />
      )},
      { id: 4, label: currentLabels.assembly, render: (
        <input
          type="text"
          className="w-full border-b-2 border-[#AD1818] focus:outline-none text-lg p-2"
          placeholder={currentLabels.placeholder}
          {...form.register("assembly")}
          onKeyDown={(e) => { if (e.key === 'Enter' && canProceed) next(); }}
        />
      )},
      { id: 5, label: currentLabels.email, render: (
        <input
          type="email"
          className="w-full border-b-2 border-[#AD1818] focus:outline-none text-lg p-2"
          placeholder={currentLabels.placeholder}
          {...form.register("email")}
          onKeyDown={(e) => { if (e.key === 'Enter' && canProceed) next(); }}
        />
      )},
    ];
  }, [form, canProceed, next, currentLabels]);

  const totalSteps = steps.length;
  const active = steps[step - 1];

  async function onSubmit(values: LawyerFormValues) {
    setError(null);
    setSubmitting(true);
    try {
      const supabase = getSupabaseClient();
      
      const { error: insertError } = await supabase
        .from("lawyers")
        .insert({
          name: values.name,
          whatsapp: values.whatsapp,
          practicing_court: values.practicing_court,
          assembly: values.assembly,
          email: values.email,
        });
      
      if (insertError) throw insertError;

      window.location.href = "/success";
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : typeof e === "string" ? e : null;
      const friendly = message && message.includes("Invalid Compact JWS")
        ? "Upload failed due to authentication. Please check Supabase keys configuration."
        : message;
      setError(friendly ?? "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
          <div className="mb-4 text-sm text-neutral-600">{currentLabels.step} {step} {currentLabels.of} {totalSteps}</div>
          <AnimatePresence mode="wait">
            <StepWrapper step={step}>
              <div className="space-y-4">
                <div className="text-xl md:text-2xl font-semibold text-neutral-900">{active.label}</div>
                <div>{active.render}</div>
                {error && (
                  <div className="text-red-600 text-sm">{error}</div>
                )}
                {/* Show only the current step's error, if any */}
                {(() => {
                  const fieldByStep: Record<number, keyof LawyerFormValues | null> = {
                    1: "name",
                    2: "whatsapp",
                    3: "practicing_court",
                    4: "assembly",
                    5: "email",
                  };
                  const field = fieldByStep[step];
                  const msg = field ? form.formState.errors[field]?.message : undefined;
                  return msg ? (
                    <div className="text-red-600 text-sm">{String(msg)}</div>
                  ) : null;
                })()}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                  <button
                    onClick={prev}
                    disabled={step === 1 || submitting}
                    className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 disabled:opacity-50 w-full sm:w-auto"
                  >
                    {currentLabels.back}
                  </button>
                  {step < totalSteps ? (
                    <button
                      onClick={() => { if (canProceed) next(); }}
                      disabled={!canProceed || submitting}
                      className="px-4 py-2 rounded-lg font-bold text-[#AD1818] border border-[#AD1818] bg-white hover:bg-[#ad18180d] focus:outline-none focus:ring-2 focus:ring-[#AD1818]/30 disabled:opacity-50 w-full sm:w-auto sm:ml-auto"
                    >
                      {currentLabels.ok}
                    </button>
                  ) : (
                    <button
                      onClick={form.handleSubmit(onSubmit)}
                      disabled={submitting}
                      className="px-4 py-2 rounded-lg font-bold text-[#AD1818] border border-[#AD1818] bg-white hover:bg-[#ad18180d] focus:outline-none focus:ring-2 focus:ring-[#AD1818]/30 disabled:opacity-50 w-full sm:w-auto sm:ml-auto"
                    >
                      {submitting ? currentLabels.submitting : currentLabels.submit}
                    </button>
                  )}
                </div>
                <div className="text-xs text-neutral-500">{currentLabels.tip}</div>
              </div>
            </StepWrapper>
          </AnimatePresence>
    </div>
  );
}
