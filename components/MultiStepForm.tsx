"use client";

import { useCallback, useMemo, useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from '@/lib/schema';
import { motion, AnimatePresence } from "framer-motion";
import { uploadImage, uploadVideo } from "@/lib/upload";
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
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [progressStage, setProgressStage] = useState<'idle'|'preparing'|'uploading_photo'|'uploading_video'|'saving'|'done'>('idle');

  // Local UI states
  // Separate Day/Month/Year selectors for incident date
  const [selDay, setSelDay] = useState<number | "">("");
  const [selMonth, setSelMonth] = useState<number | "">("");
  const [selYear, setSelYear] = useState<number | "">("");
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
    dayLabel: "दिन",
    monthLabel: "महीना",
    yearLabel: "वर्ष",
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
    dayLabel: "Day",
    monthLabel: "Month",
    yearLabel: "Year",
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

  const toYMD = useCallback((d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`
  , []);

  // Helpers for date select logic
  const daysInMonth = useCallback((year: number, month: number) => new Date(year, month, 0).getDate(), []); // month: 1-12
  const isFuture = useCallback((y: number, m: number, d: number) => {
    const t = new Date(); t.setHours(0,0,0,0);
    const c = new Date(y, m - 1, d);
    c.setHours(0,0,0,0);
    return c.getTime() > t.getTime();
  }, []);

  const updateIncidentDateFromSelects = useCallback((y?: number, m?: number, d?: number) => {
    if (y && m && d) {
      const maxDay = daysInMonth(y, m);
      if (d > maxDay) {
        setSelDay("");
        form.setValue("incident_date", "", { shouldValidate: true, shouldDirty: true });
        return;
      }
      if (isFuture(y, m, d)) {
        form.setValue("incident_date", "", { shouldValidate: true, shouldDirty: true });
        return;
      }
      const date = new Date(y, m - 1, d);
      form.setValue("incident_date", toYMD(date), { shouldValidate: true, shouldDirty: true });
      form.clearErrors("incident_date");
    } else {
      form.setValue("incident_date", "", { shouldValidate: true, shouldDirty: true });
    }
  }, [form, isFuture, daysInMonth, toYMD]);

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
        if (!w.incident_date) return false;
        {
          const d = new Date(w.incident_date);
          if (isNaN(d.getTime())) return false;
          d.setHours(0,0,0,0);
          const t = new Date(); t.setHours(0,0,0,0);
          return d.getTime() <= t.getTime();
        }
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
          <div className="grid grid-cols-3 gap-3">
            {/* Day */}
            <select
              className="border-b-2 border-[#AD1818] focus:outline-none text-lg p-2 bg-transparent"
              value={selDay}
              onChange={(e) => {
                const val = e.target.value === "" ? "" : Number(e.target.value);
                setSelDay(val as number | "");
                updateIncidentDateFromSelects(selYear as number, selMonth as number, val as number);
              }}
            >
              <option value="">{currentLabels.dayLabel}</option>
              {(() => {
                const y = selYear as number; const m = selMonth as number;
                const max = y && m ? daysInMonth(y, m) : 31;
                const t = new Date(); const isCurYM = y === t.getFullYear() && m === (t.getMonth()+1);
                const limit = isCurYM ? t.getDate() : max;
                return Array.from({ length: max }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d} disabled={isCurYM && d > limit}>{String(d).padStart(2, '0')}</option>
                ));
              })()}
            </select>

            {/* Month */}
            <select
              className="border-b-2 border-[#AD1818] focus:outline-none text-lg p-2 bg-transparent"
              value={selMonth}
              onChange={(e) => {
                const val = e.target.value === "" ? "" : Number(e.target.value);
                setSelMonth(val as number | "");
                // Adjust day if now invalid
                if (selYear && val !== "") {
                  const max = daysInMonth(selYear as number, val as number);
                  if (selDay && (selDay as number) > max) setSelDay("");
                }
                updateIncidentDateFromSelects(selYear as number, val as number, selDay as number);
              }}
            >
              <option value="">{currentLabels.monthLabel}</option>
              {(() => {
                const t = new Date();
                const curY = t.getFullYear(); const curM = t.getMonth()+1;
                return Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m} disabled={selYear === curY && m > curM}>{String(m).padStart(2, '0')}</option>
                ));
              })()}
            </select>

            {/* Year */}
            <select
              className="border-b-2 border-[#AD1818] focus:outline-none text-lg p-2 bg-transparent"
              value={selYear}
              onChange={(e) => {
                const val = e.target.value === "" ? "" : Number(e.target.value);
                setSelYear(val as number | "");
                updateIncidentDateFromSelects(val as number, selMonth as number, selDay as number);
              }}
            >
              <option value="">{currentLabels.yearLabel}</option>
              {(() => {
                const t = new Date();
                const curY = t.getFullYear();
                const start = 1950;
                const ys: number[] = [];
                for (let y = curY; y >= start; y--) ys.push(y);
                return ys.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ));
              })()}
            </select>
          </div>
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
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              
              // Reset previous errors
              form.clearErrors("photo_file");
              setError(null);
              
              if (!f.type.startsWith("image/")) {
                form.setError("photo_file", { message: "Only image files are allowed" });
                if (photoInputRef.current) photoInputRef.current.value = "";
                return;
              }
              
              const maxBytes = (Number(process.env.NEXT_PUBLIC_MAX_IMAGE_MB) || 10) * 1024 * 1024;
              if (f.size > maxBytes) {
                form.setError("photo_file", { message: `Max size ${(Number(process.env.NEXT_PUBLIC_MAX_IMAGE_MB) || 10)} MB. Please choose a smaller image.` });
                if (photoInputRef.current) photoInputRef.current.value = "";
                return;
              }
              
              setUploadingPhoto(true);
              try {
                // Test upload capability before proceeding
                const url = URL.createObjectURL(f);
                setPhotoPreview((prev) => { if (prev) URL.revokeObjectURL(prev); return url; });
                form.setValue("photo_file", f as unknown as FormValues["photo_file"], { shouldValidate: true });
                form.clearErrors("photo_file");
              } catch (error) {
                console.error('Photo preview error:', error);
                form.setError("photo_file", { message: "Failed to process image. Please try a different file." });
                if (photoInputRef.current) photoInputRef.current.value = "";
              } finally {
                setUploadingPhoto(false);
              }
            }}
          />
          {uploadingPhoto ? (
            <div className="flex items-center justify-center p-8">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#AD1818] border-t-transparent"></div>
                <span>Processing image...</span>
              </div>
            </div>
          ) : photoPreview ? (
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
                    setError(null);
                    if (photoInputRef.current) photoInputRef.current.value = "";
                  }}
                  className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                >{currentLabels.remove}</button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => photoInputRef.current?.click()} className="px-4 py-3 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700 w-full text-left hover:bg-neutral-50 dark:hover:bg-white/5" disabled={uploadingPhoto}>
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
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              
              // Reset previous errors
              form.clearErrors("video_file");
              setError(null);
              
              if (!f.type.startsWith("video/")) {
                form.setError("video_file", { message: "Only video files are allowed" });
                if (videoInputRef.current) videoInputRef.current.value = "";
                return;
              }
              
              const maxBytes = (Number(process.env.NEXT_PUBLIC_MAX_VIDEO_MB) || 50) * 1024 * 1024;
              if (f.size > maxBytes) {
                form.setError("video_file", { message: `Max size ${(Number(process.env.NEXT_PUBLIC_MAX_VIDEO_MB) || 50)} MB. Please choose a shorter or lower resolution video.` });
                if (videoInputRef.current) videoInputRef.current.value = "";
                return;
              }
              
              setUploadingVideo(true);
              try {
                // Test video preview capability before proceeding
                const url = URL.createObjectURL(f);
                setVideoPreview((prev) => { if (prev) URL.revokeObjectURL(prev); return url; });
                form.setValue("video_file", f as unknown as FormValues["video_file"], { shouldValidate: true });
                form.clearErrors("video_file");
              } catch (error) {
                console.error('Video preview error:', error);
                form.setError("video_file", { message: "Failed to process video. Please try a different file." });
                if (videoInputRef.current) videoInputRef.current.value = "";
              } finally {
                setUploadingVideo(false);
              }
            }}
          />
          {uploadingVideo ? (
            <div className="flex items-center justify-center p-8">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#AD1818] border-t-transparent"></div>
                <span>Processing video...</span>
              </div>
            </div>
          ) : videoPreview ? (
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
                    setError(null);
                    if (videoInputRef.current) videoInputRef.current.value = "";
                  }}
                  className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                >{currentLabels.remove}</button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => videoInputRef.current?.click()} className="px-4 py-3 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700 w-full text-left hover:bg-neutral-50 dark:hover:bg-white/5" disabled={uploadingVideo}>
              <div className="font-medium">{currentLabels.chooseVideo}</div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">{currentLabels.videosOnly}</div>
            </button>
          )}
        </div>
      )},
    ];
  }, [form, canProceed, photoPreview, videoPreview, next, currentLabels, w.complaint_type, selDay, selMonth, selYear, updateIncidentDateFromSelects, daysInMonth, uploadingPhoto, uploadingVideo]);

  const totalSteps = steps.length;
  const active = steps[step - 1];

  async function onSubmit(values: FormValues) {
    setError(null);
    setSubmitting(true);
    setProgress(5);
    setProgressStage('preparing');
    
    let photoUrl: string | null = null;
    let videoUrl: string | null = null;
    
    try {
      const supabase = getSupabaseClient();
      
      // Upload photo if provided
      if (values.photo_file) {
        try {
          setProgressStage('uploading_photo');
          setProgress(30);
          photoUrl = await uploadImage(values.photo_file);
          setProgress(45);
        } catch (pe: unknown) {
          const m = pe instanceof Error ? pe.message : String(pe);
          if (m && (m.includes('Failed to fetch') || m.includes('NetworkError') || m.includes('fetch'))) {
            throw new Error('Image upload failed due to network issues. Please check your internet connection and try again.');
          }
          if (m && m.includes('413')) {
            throw new Error('Image file is too large. Please choose a smaller image or compress it.');
          }
          throw new Error(`Image upload failed: ${m}. Please try selecting the image again.`);
        }
      }
      
      // Upload video if provided
      if (values.video_file) {
        try {
          setProgressStage('uploading_video');
          setProgress(60);
          videoUrl = await uploadVideo(values.video_file);
          setProgress(85);
        } catch (ve: unknown) {
          const m = ve instanceof Error ? ve.message : String(ve);
          if (m && (m.includes('Failed to fetch') || m.includes('NetworkError') || m.includes('fetch'))) {
            throw new Error('Video upload failed due to network issues. Please check your internet connection and try again.');
          }
          if (m && m.includes('413')) {
            throw new Error('Video file is too large. Please choose a shorter or lower resolution video.');
          }
          if (m && m.includes('timeout')) {
            throw new Error('Video upload timed out. Please try with a smaller video file.');
          }
          throw new Error(`Video upload failed: ${m}. Please try selecting the video again.`);
        }
      }

      // Insert complaint record
      setProgressStage('saving');
      setProgress(90);
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

      setProgressStage('done');
      setProgress(100);
      window.location.href = "/success";
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : typeof e === "string" ? e : null;
      
      let friendly: string;
      if (message && message.includes("Invalid Compact JWS")) {
        friendly = "Upload failed due to authentication issues. Please refresh the page and try again.";
      } else if (message && message.includes("network")) {
        friendly = message; // Use the specific network error message we crafted above
      } else if (message && message.includes("timeout")) {
        friendly = message; // Use the specific timeout error message
      } else if (message && message.includes("too large")) {
        friendly = message; // Use the specific file size error message
      } else {
        friendly = message || "Failed to submit complaint. Please check your files and try again.";
      }
      
      setError(friendly);
      
      // Clear file inputs on upload errors to prevent getting stuck
      if (message && (message.includes('upload') || message.includes('network') || message.includes('fetch'))) {
        if (photoInputRef.current) photoInputRef.current.value = "";
        if (videoInputRef.current) videoInputRef.current.value = "";
        setPhotoPreview(null);
        setVideoPreview(null);
        form.setValue("photo_file", undefined as unknown as FormValues["photo_file"]);
        form.setValue("video_file", undefined as unknown as FormValues["video_file"]);
      }
      setProgress(0);
      setProgressStage('idle');
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
            {progressStage !== 'idle' && (
              <div className="space-y-2">
                <div className="text-sm text-neutral-600 dark:text-neutral-300">
                  {language === 'hi' ? (
                    progressStage === 'preparing' ? 'तैयारी हो रही है...' :
                    progressStage === 'uploading_photo' ? 'फोटो अपलोड हो रहा है...' :
                    progressStage === 'uploading_video' ? 'वीडियो अपलोड हो रहा है...' :
                    progressStage === 'saving' ? 'शिकायत सहेजी जा रही है...' :
                    'पूर्ण'
                  ) : (
                    progressStage === 'preparing' ? 'Preparing...' :
                    progressStage === 'uploading_photo' ? 'Uploading photo...' :
                    progressStage === 'uploading_video' ? 'Uploading video...' :
                    progressStage === 'saving' ? 'Saving complaint...' :
                    'Done'
                  )}
                </div>
                <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded">
                  <div className="h-2 bg-[#AD1818] rounded transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
              <button
                onClick={prev}
                disabled={step === 1 || submitting || progressStage !== 'idle'}
                className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 disabled:opacity-50 w-full sm:w-auto"
              >
                {currentLabels.back}
              </button>
              {step < totalSteps ? (
                <button
                  onClick={() => { if (canProceed) next(); }}
                  disabled={!canProceed || submitting || uploadingPhoto || uploadingVideo || progressStage !== 'idle'}
                  className="px-4 py-2 rounded-lg font-bold text-[#AD1818] border border-[#AD1818] bg-white hover:bg-[#ad18180d] focus:outline-none focus:ring-2 focus:ring-[#AD1818]/30 disabled:opacity-50 w-full sm:w-auto sm:ml-auto"
                >
                  {currentLabels.next}
                </button>
              ) : (
                <button
                  onClick={form.handleSubmit(onSubmit, onInvalid)}
                  disabled={submitting || uploadingPhoto || uploadingVideo || progressStage !== 'idle'}
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
