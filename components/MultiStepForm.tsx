"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from "@/lib/schema";
import { COMPLAINT_TYPES } from "@/lib/content";
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
      className="bg-white rounded-2xl border border-neutral-200 p-6 md:p-8 shadow-sm text-neutral-900"
    >
      {children}
    </motion.div>
  );
}

export default function MultiStepForm() {
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
        return !!w.complaint_type;
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
      { id: 1, label: "What is your Name?", render: (
        <input
          autoFocus
          type="text"
          className="w-full border-b-2 border-blue-600 focus:outline-none text-lg p-2"
          placeholder="Type your answer here..."
          {...form.register("name")}
          onKeyDown={(e) => { if (e.key === 'Enter' && canProceed) next(); }}
        />
      )},
      { id: 2, label: "Phone Number", render: (
        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          className="w-full border-b-2 border-blue-600 focus:outline-none text-lg p-2"
          placeholder="10-digit mobile number"
          {...form.register("phone")}
          onKeyDown={(e) => { if (e.key === 'Enter' && canProceed) next(); }}
        />
      )},
      { id: 3, label: "Assembly (optional)", render: (
        <input
          type="text"
          className="w-full border-b-2 border-blue-600 focus:outline-none text-lg p-2"
          placeholder="Your assembly"
          {...form.register("assembly")}
          onKeyDown={(e) => { if (e.key === 'Enter') next(); }}
        />
      )},
      { id: 4, label: "District", render: (
        <input
          type="text"
          className="w-full border-b-2 border-blue-600 focus:outline-none text-lg p-2"
          placeholder="District"
          {...form.register("district")}
          onKeyDown={(e) => { if (e.key === 'Enter' && canProceed) next(); }}
        />
      )},
      { id: 5, label: "Date of Incident", render: (
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
            placeholderText="Select date"
            dateFormat="dd/MM/yyyy"
            className="w-full border-b-2 border-blue-600 focus:outline-none text-lg p-2"
            onKeyDown={(e) => { if (e.key === 'Enter' && canProceed) next(); }}
            isClearable
            showPopperArrow={false}
          />
        </div>
      )},
      { id: 6, label: "Time of Incident", render: (
        <input
          type="time"
          className="w-full border-b-2 border-blue-600 focus:outline-none text-lg p-2"
          {...form.register("incident_time")}
          onKeyDown={(e) => { if (e.key === 'Enter' && canProceed) next(); }}
        />
      )},
      { id: 7, label: "Location of Incident (Village/Booth/Area)", render: (
        <textarea
          rows={1}
          onInput={(e) => {
            const t = e.currentTarget; t.style.height = 'auto'; t.style.height = `${Math.min(t.scrollHeight, 240)}px`;
          }}
          className="w-full border-b-2 border-blue-600 focus:outline-none text-lg p-2 min-h-[44px] max-h-60 overflow-y-auto"
          placeholder="Village / Booth / Area name"
          {...form.register("location")}
          onKeyDown={(e) => { if (e.key === 'Enter' && canProceed) next(); }}
        />
      )},
      { id: 8, label: "Type of Complaint / शिकायत", render: (
        <div className="space-y-3">
          {COMPLAINT_TYPES.map((opt) => (
            <label key={opt} className="flex items-center gap-3">
              <input
                type="radio"
                value={opt}
                {...form.register("complaint_type")}
                className="h-4 w-4"
              />
              <span className="text-base sm:text-lg text-neutral-900">{opt}</span>
            </label>
          ))}
        </div>
      )},
      { id: 9, label: "Brief Description of the Incident (optional)", render: (
        <textarea
          rows={1}
          onInput={(e) => {
            const t = e.currentTarget; t.style.height = 'auto'; t.style.height = `${Math.min(t.scrollHeight, 320)}px`;
          }}
          className="w-full border-b-2 border-blue-600 focus:outline-none text-lg p-2 min-h-[44px] max-h-80 overflow-y-auto"
          placeholder="Describe briefly..."
          {...form.register("description")}
          onKeyDown={(e) => { if (e.key === 'Enter') next(); }}
        />
      )},
      { id: 10, label: "Upload Photo (images only, max 10 MB)", render: (
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
              if (f.size > 10 * 1024 * 1024) {
                form.setError("photo_file", { message: "Max size 10 MB" });
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
              <img src={photoPreview} alt="Preview" className="h-24 w-24 object-cover rounded-md border" />
              <div className="flex gap-2">
                <button type="button" onClick={() => photoInputRef.current?.click()} className="px-3 py-2 rounded-lg border border-neutral-300 text-neutral-700">Change</button>
                <button
                  type="button"
                  onClick={() => {
                    setPhotoPreview((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
                    form.setValue("photo_file", undefined as unknown as FormValues["photo_file"], { shouldValidate: true });
                    form.clearErrors("photo_file");
                    if (photoInputRef.current) photoInputRef.current.value = "";
                  }}
                  className="px-3 py-2 rounded-lg border border-neutral-300 text-neutral-700"
                >Remove</button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => photoInputRef.current?.click()} className="px-4 py-3 rounded-lg border-2 border-dashed border-neutral-300 w-full text-left hover:bg-neutral-50">
              <div className="font-medium">Choose a photo</div>
              <div className="text-sm text-neutral-500">Images only, up to 10 MB</div>
            </button>
          )}
        </div>
      )},
      { id: 11, label: "Upload Video (video only, max 100 MB)", render: (
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
              if (f.size > 100 * 1024 * 1024) {
                form.setError("video_file", { message: "Max size 100 MB" });
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
              <video src={videoPreview} className="w-full max-w-sm rounded-md border" controls muted playsInline />
              <div className="flex gap-2">
                <button type="button" onClick={() => videoInputRef.current?.click()} className="px-3 py-2 rounded-lg border border-neutral-300 text-neutral-700">Change</button>
                <button
                  type="button"
                  onClick={() => {
                    setVideoPreview((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
                    form.setValue("video_file", undefined as unknown as FormValues["video_file"], { shouldValidate: true });
                    form.clearErrors("video_file");
                    if (videoInputRef.current) videoInputRef.current.value = "";
                  }}
                  className="px-3 py-2 rounded-lg border border-neutral-300 text-neutral-700"
                >Remove</button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => videoInputRef.current?.click()} className="px-4 py-3 rounded-lg border-2 border-dashed border-neutral-300 w-full text-left hover:bg-neutral-50">
              <div className="font-medium">Choose a video</div>
              <div className="text-sm text-neutral-500">Videos only, up to 100 MB</div>
            </button>
          )}
        </div>
      )},
    ];
  }, [form, canProceed, incidentDateObj, photoPreview, videoPreview, next]);

  const totalSteps = steps.length;
  const active = steps[step - 1];

  async function onSubmit(values: FormValues) {
    setError(null);
    setSubmitting(true);
    try {
      const supabase = getSupabaseClient();
      // Uploads
      const photoUrl = await uploadImage(values.photo_file);
      const videoUrl = await uploadVideo(values.video_file);

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
          description: values.description || null,
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
      <div className="mb-4 text-sm text-neutral-600">Step {step} of {totalSteps}</div>
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
                Back
              </button>
              {step < totalSteps ? (
                <button
                  onClick={() => { if (canProceed) next(); }}
                  disabled={!canProceed || submitting}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50 w-full sm:w-auto sm:ml-auto"
                >
                  OK
                </button>
              ) : (
                <button
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white disabled:opacity-50 w-full sm:w-auto sm:ml-auto"
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              )}
            </div>
            <div className="text-xs text-neutral-500">Tip: press Enter ↵ to continue</div>
          </div>
        </StepWrapper>
      </AnimatePresence>
    </div>
  );
}
