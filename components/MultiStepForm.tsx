"use client";

import { useCallback, useMemo, useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from '@/lib/schema';
import { motion, AnimatePresence } from "framer-motion";
import { uploadImage, uploadVideo } from "@/lib/upload";
import { getSupabaseClient } from "@/lib/supabaseClient";
import DatePicker from "react-datepicker";

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
      className="bg-white/95 dark:bg-black/60 backdrop-blur-sm rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 md:p-8 shadow-sm text-neutral-900 dark:text-neutral-100"
    >
      {children}
    </motion.div>
  );
}

export default function MultiStepForm() {
  const { language } = useLanguage();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    criteriaMode: "all",
  });

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local UI states
  const [incidentDateObj, setIncidentDateObj] = useState<Date | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const labelsHi = {
    name: "आपका नाम क्या है?",
    phone: "फोन नंबर",
    assembly: "विधानसभा",
    district: "जिला",
    incidentDate: "घटना की तारीख",
    incidentTime: "घटना का समय",
    location: "घटना का स्थान (गांव/बूथ/क्षेत्र)",
    complaintType: "शिकायत का प्रकार",
    description: "घटना का संक्षिप्त विवरण",
    photo: "फोटो अपलोड करें",
    video: "वीडियो अपलोड करें",
    uploadPhoto: "फोटो अपलोड करें (केवल छवियां, अधिकतम 10 MB)",
    uploadVideo: "वीडियो अपलोड करें (केवल वीडियो, अधिकतम 50 MB)",
    optional: "(वैकल्पिक)",
    placeholder: "अपना उत्तर यहाँ टाइप करें...",
    selectDate: "तारीख चुनें",
    next: "अगला",
    back: "वापस",
    submit: "शिकायत जमा करें",
    submitting: "जमा हो रहा है...",
    tip: "जारी रखने के लिए Enter दबाएं",
    change: "बदलें",
    remove: "हटाएं",
    choosePhoto: "फोटो चुनें",
    chooseVideo: "वीडियो चुनें",
    imagesOnly: "केवल छवियां, 10 MB तक",
    videosOnly: "केवल वीडियो, 50 MB तक",
    complaintTypes: {
      "Voter Bribery": "मतदाता रिश्वतखोरी",
      "Booth Capturing": "बूथ कैप्चरिंग",
      "Fake Voting": "फर्जी मतदान",
      "EVM Damage": "ईवीएम क्षति",
      "Voter Intimidation": "मतदाता को डराना-धमकाना",
      "Violation of Model Code of Conduct": "आदर्श आचार संहिता का उल्लंघन",
      "CCTV tampering": "सीसीटीवी छेड़छाड़",
      "Voter Deletion": "मतदाता विलोपन",
      "Other": "अन्य"
    },
    otherSpecify: "कृपया बताएं",
  };

  // If submit is attempted with invalid fields, jump to the first invalid step
  function onInvalid(errors: FieldErrors<FormValues>) {
    const order: Array<keyof FormValues> = [
      "name",
      "phone",
      "assembly", // optional but included for completeness
      "district",
      "incident_date",
      "incident_time",
      "location",
      "complaint_type",
      "other_text",
      "description", // optional
      "photo_file",
      "video_file",
    ];
    for (let i = 0; i < order.length; i++) {
      const key = order[i];
      if (errors[key]) {
        // Map field to step index (1-based)
        const fieldToStep: Record<keyof FormValues, number> = {
          name: 1,
          phone: 2,
          assembly: 3,
          district: 4,
          incident_date: 5,
          incident_time: 6,
          location: 7,
          complaint_type: 8,
          other_text: 8,
          description: 9,
          photo_file: 10,
          video_file: 11,
        };
        setStep(fieldToStep[key]);
        break;
      }
    }
  }

  const labelsEn = {
    name: "What is your Name?",
    phone: "Phone Number",
    assembly: "Assembly",
    district: "District",
    incidentDate: "Date of Incident",
    incidentTime: "Time of Incident",
    location: "Location of Incident (Village/Booth/Area)",
    complaintType: "Type of Complaint",
    description: "Brief Description of the Incident",
    photo: "Upload Photo",
    video: "Upload Video",
    uploadPhoto: "Upload Photo (images only, max 10 MB)",
    uploadVideo: "Upload Video (video only, max 50 MB)",
    optional: "(optional)",
    placeholder: "Type your answer here...",
    selectDate: "Select date",
    next: "Next",
    back: "Back",
    submit: "Submit Complaint",
    submitting: "Submitting...",
    tip: "Press Enter to continue",
    change: "Change",
    remove: "Remove",
    choosePhoto: "Choose a photo",
    chooseVideo: "Choose a video",
    imagesOnly: "Images only, up to 10 MB",
    videosOnly: "Videos only, up to 50 MB",
    complaintTypes: {
      "Voter Bribery": "Voter Bribery",
      "Booth Capturing": "Booth Capturing",
      "Fake Voting": "Fake Voting",
      "EVM Damage": "EVM Damage",
      "Voter Intimidation": "Voter Intimidation",
      "Violation of Model Code of Conduct": "Violation of Model Code of Conduct",
      "CCTV tampering": "CCTV tampering",
      "Voter Deletion": "Voter Deletion",
      "Other": "Other"
    },
    otherSpecify: "Please specify",
  };

  const currentLabels = language === 'hi' ? labelsHi : labelsEn;
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const toYMD = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  // Validate only the current step so the OK button enables as soon as the
  // active field(s) are valid, rather than waiting for the entire form.
  const w = form.watch();
  const canProceed = useMemo(() => {
    const phoneOk = /^[6-9]\d{9}$/.test(w.phone || "");
    switch (step) {
      case 1:
        return (w.name || "").trim().length > 0;
      case 2:
        return phoneOk;
      case 3:
        return true; // optional
      case 4:
        return (w.district || "").trim().length > 0;
      case 5:
        return !!w.incident_date;
      case 6:
        return !!w.incident_time;
      case 7:
        return (w.location || "").trim().length > 0;
      case 8:
        if (!w.complaint_type) return false;
        if (w.complaint_type === 'Other') {
          return (w.other_text || '').toString().trim().length > 0;
        }
        return true;
      case 9:
        return true; // optional
      case 10:
        return !!w.photo_file;
      case 11:
        return !!w.video_file;
      default:
        return false;
    }
  }, [step, w]);

  const TOTAL_STEPS = 11;
  const next = useCallback(() => setStep((s) => Math.min(s + 1, TOTAL_STEPS)), []);
  const prev = () => setStep((s) => Math.max(1, s - 1));

  // Steps map: 1..N
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
      { id: 2, label: currentLabels.phone, render: (
        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          className="w-full border-b-2 border-[#AD1818] focus:outline-none text-lg p-2"
          placeholder={currentLabels.placeholder}
          {...form.register("phone")}
          onKeyDown={(e) => { if (e.key === 'Enter' && canProceed) next(); }}
        />
      )},
      { id: 3, label: `${currentLabels.assembly} ${currentLabels.optional}`, render: (
        <input
          type="text"
          className="w-full border-b-2 border-[#AD1818] focus:outline-none text-lg p-2"
          placeholder={currentLabels.placeholder}
          {...form.register("assembly")}
          onKeyDown={(e) => { if (e.key === 'Enter') next(); }}
        />
      )},
      { id: 4, label: currentLabels.district, render: (
        <input
          type="text"
          className="w-full border-b-2 border-[#AD1818] focus:outline-none text-lg p-2"
          placeholder={currentLabels.placeholder}
          {...form.register("district")}
          onKeyDown={(e) => { if (e.key === 'Enter' && canProceed) next(); }}
        />
      )},
      { id: 5, label: currentLabels.incidentDate, render: (
        <div className="w-full">
          <DatePicker
            selected={incidentDateObj}
            onChange={(d) => {
              setIncidentDateObj(d as Date | null);
              if (d) {
                const v = toYMD(d as Date);
                form.setValue("incident_date", v, { shouldValidate: true, shouldDirty: true });
                form.clearErrors("incident_date");
              } else {
                form.setValue("incident_date", "", { shouldValidate: true });
              }
            }}
            placeholderText={currentLabels.selectDate}
            dateFormat="dd/MM/yyyy"
            maxDate={new Date()}
            className="w-full border-b-2 border-[#AD1818] focus:outline-none text-lg p-2"
            onKeyDown={(e) => { if (e.key === 'Enter' && canProceed) next(); }}
            isClearable
            showPopperArrow={false}
          />
        </div>
      )},
      { id: 6, label: currentLabels.incidentTime, render: (
        <input
          type="time"
          className="w-full border-b-2 border-[#AD1818] focus:outline-none text-lg p-2"
          {...form.register("incident_time")}
          onKeyDown={(e) => { if (e.key === 'Enter' && canProceed) next(); }}
        />
      )},
      { id: 7, label: currentLabels.location, render: (
        <textarea
          rows={1}
          onInput={(e) => {
            const t = e.currentTarget; t.style.height = 'auto'; t.style.height = `${Math.min(t.scrollHeight, 240)}px`;
          }}
          className="w-full border-b-2 border-[#AD1818] focus:outline-none text-lg p-2 min-h-[44px] max-h-60 overflow-y-auto"
          placeholder={currentLabels.placeholder}
          {...form.register("location")}
          onKeyDown={(e) => { if (e.key === 'Enter' && canProceed) next(); }}
        />
      )},
      { id: 8, label: currentLabels.complaintType, render: (
        <div className="space-y-3">
          {Object.entries(currentLabels.complaintTypes).map(([key, label]) => (
            <label key={key} className="flex items-center gap-3">
              <input
                type="radio"
                value={key}
                {...form.register("complaint_type")}
                className="h-4 w-4"
              />
              <span className="text-base sm:text-lg text-black/90 dark:text-white/90">{label}</span>
            </label>
          ))}
          {w.complaint_type === 'Other' && (
            <div className="pt-2">
              <input
                type="text"
                className="w-full border-b-2 border-[#AD1818] focus:outline-none text-lg p-2"
                placeholder={currentLabels.otherSpecify}
                {...form.register('other_text')}
                onKeyDown={(e) => { if (e.key === 'Enter' && canProceed) next(); }}
              />
            </div>
          )}
        </div>
      )},
      { id: 9, label: `${currentLabels.description} ${currentLabels.optional}`, render: (
        <textarea
          rows={1}
          onInput={(e) => {
            const t = e.currentTarget; t.style.height = 'auto'; t.style.height = `${Math.min(t.scrollHeight, 320)}px`;
          }}
          className="w-full border-b-2 border-blue-600 focus:outline-none text-lg p-2 min-h-[44px] max-h-80 overflow-y-auto"
          placeholder={currentLabels.placeholder}
          {...form.register("description")}
          onKeyDown={(e) => { if (e.key === 'Enter') next(); }}
        />
      )},
      { id: 10, label: currentLabels.uploadPhoto, render: (
        <div className="space-y-3">
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              if (!f.type.startsWith("image/")) {
                form.setError("photo_file", { message: "Only image files are allowed" });
                return;
              }
              const maxBytes = (Number(process.env.NEXT_PUBLIC_MAX_IMAGE_MB) || 10) * 1024 * 1024;
              if (f.size > maxBytes) {
                form.setError("photo_file", { message: `Max size ${(Number(process.env.NEXT_PUBLIC_MAX_IMAGE_MB) || 10)} MB` });
                return;
              }
              form.setValue("photo_file", f as unknown as FormValues["photo_file"], { shouldValidate: true });
              form.clearErrors("photo_file");
              const url = URL.createObjectURL(f);
              setPhotoPreview((prev) => { if (prev) URL.revokeObjectURL(prev); return url; });
            }}
          />
          {photoPreview ? (
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoPreview} alt="Preview" className="h-24 w-24 object-cover rounded-md border border-neutral-200 dark:border-neutral-700" />
              <div className="flex gap-2">
                <button type="button" onClick={() => photoInputRef.current?.click()} className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300">{currentLabels.change}</button>
                <button
                  type="button"
                  onClick={() => {
                    setPhotoPreview((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
                    form.setValue("photo_file", undefined as unknown as FormValues["photo_file"], { shouldValidate: true });
                    form.clearErrors("photo_file");
                    if (photoInputRef.current) photoInputRef.current.value = "";
                  }}
                  className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                >{currentLabels.remove}</button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => photoInputRef.current?.click()} className="px-4 py-3 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700 w-full text-left hover:bg-neutral-50 dark:hover:bg-white/5">
              <div className="font-medium">{currentLabels.choosePhoto}</div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">{currentLabels.imagesOnly}</div>
            </button>
          )}
        </div>
      )},
      { id: 11, label: currentLabels.uploadVideo, render: (
        <div className="space-y-3">
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              if (!f.type.startsWith("video/")) {
                form.setError("video_file", { message: "Only video files are allowed" });
                return;
              }
              const maxBytes = (Number(process.env.NEXT_PUBLIC_MAX_VIDEO_MB) || 50) * 1024 * 1024;
              if (f.size > maxBytes) {
                form.setError("video_file", { message: `Max size ${(Number(process.env.NEXT_PUBLIC_MAX_VIDEO_MB) || 50)} MB` });
                return;
              }
              form.setValue("video_file", f as unknown as FormValues["video_file"], { shouldValidate: true });
              form.clearErrors("video_file");
              const url = URL.createObjectURL(f);
              setVideoPreview((prev) => { if (prev) URL.revokeObjectURL(prev); return url; });
            }}
          />
          {videoPreview ? (
            <div className="space-y-2">
              <video src={videoPreview} className="w-full max-w-sm rounded-md border border-neutral-200 dark:border-neutral-700" controls muted playsInline />
              <div className="flex gap-2">
                <button type="button" onClick={() => videoInputRef.current?.click()} className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300">{currentLabels.change}</button>
                <button
                  type="button"
                  onClick={() => {
                    setVideoPreview((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
                    form.setValue("video_file", undefined as unknown as FormValues["video_file"], { shouldValidate: true });
                    form.clearErrors("video_file");
                    if (videoInputRef.current) videoInputRef.current.value = "";
                  }}
                  className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                >{currentLabels.remove}</button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => videoInputRef.current?.click()} className="px-4 py-3 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700 w-full text-left hover:bg-neutral-50 dark:hover:bg-white/5">
              <div className="font-medium">{currentLabels.chooseVideo}</div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">{currentLabels.videosOnly}</div>
            </button>
          )}
        </div>
      )},
    ];
  }, [form, canProceed, incidentDateObj, photoPreview, videoPreview, next, currentLabels, w.complaint_type]);

  const totalSteps = steps.length;
  const active = steps[step - 1];

  async function onSubmit(values: FormValues) {
    setError(null);
    setSubmitting(true);
    try {
      const supabase = getSupabaseClient();
      // Uploads
      const photoUrl = await uploadImage(values.photo_file);
      let videoUrl: string | null = null;
      try {
        videoUrl = await uploadVideo(values.video_file);
      } catch (ve: unknown) {
        const m = ve instanceof Error ? ve.message : String(ve);
        if (m && m.includes('Failed to fetch')) {
          throw new Error('Video upload failed (network/CORS). Please check network connectivity and Supabase URL configuration.');
        }
        throw new Error(`Video upload failed: ${m}`);
      }

      // Insert row
      const { error: insertError } = await supabase
        .from("complaints")
        .insert({
          name: values.name,
          phone: values.phone,
          assembly: values.assembly || null,
          district: values.district,
          incident_date: values.incident_date,
          incident_time: values.incident_time,
          location: values.location,
          complaint_type: values.complaint_type,
          description: (values.description && values.description.trim().length > 0)
            ? values.description
            : (values.other_text && values.other_text.trim().length > 0 ? values.other_text : null),
          photo_url: photoUrl,
          video_url: videoUrl,
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
      <div className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">{language === 'hi' ? `चरण ${step} / ${totalSteps}` : `Step ${step} of ${totalSteps}`}</div>
      <AnimatePresence mode="wait">
        <StepWrapper step={step}>
          <div className="space-y-4">
            <div className="text-xl md:text-2xl font-semibold text-[var(--foreground)]">{active.label}</div>
            <div>{active.render}</div>
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            {/* Show only the current step's error, if any */}
            {(() => {
              const fieldByStep: Record<number, keyof FormValues | null> = {
                1: "name",
                2: "phone",
                3: null,
                4: "district",
                5: "incident_date",
                6: "incident_time",
                7: "location",
                8: "complaint_type",
                9: null,
                10: "photo_file",
                11: "video_file",
              };
              const field = fieldByStep[step];
              let msg = field ? form.formState.errors[field]?.message : undefined;
              if (!msg && step === 8) {
                msg = form.formState.errors.other_text?.message as string | undefined;
              }
              return msg ? (
                <div className="text-red-600 text-sm">{String(msg)}</div>
              ) : null;
            })()}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
              <button
                onClick={prev}
                disabled={step === 1 || submitting}
                className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 disabled:opacity-50 w-full sm:w-auto"
              >
                {currentLabels.back}
              </button>
              {step < totalSteps ? (
                <button
                  onClick={() => { if (canProceed) next(); }}
                  disabled={!canProceed || submitting}
                  className="px-4 py-2 rounded-lg font-bold text-[#AD1818] border border-[#AD1818] bg-white hover:bg-[#ad18180d] focus:outline-none focus:ring-2 focus:ring-[#AD1818]/30 disabled:opacity-50 w-full sm:w-auto sm:ml-auto"
                >
                  {currentLabels.next}
                </button>
              ) : (
                <button
                  onClick={form.handleSubmit(onSubmit, onInvalid)}
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg font-bold text-[#AD1818] border border-[#AD1818] bg-white hover:bg-[#ad18180d] focus:outline-none focus:ring-2 focus:ring-[#AD1818]/30 disabled:opacity-50 w-full sm:w-auto sm:ml-auto"
                >
                  {submitting ? currentLabels.submitting : currentLabels.submit}
                </button>
              )}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">{currentLabels.tip}</div>
          </div>
        </StepWrapper>
      </AnimatePresence>
    </div>
  );
}
