import { z } from 'zod';
import { COMPLAINT_TYPES } from './content';

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/,{ message: 'Enter a valid 10-digit Indian mobile number' });

export const formSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  phone: phoneSchema,
  assembly: z.string().trim().optional().or(z.literal('')),
  district: z.string().trim().min(1, 'District is required'),

  incident_date: z
    .string()
    .min(1, 'Date is required')
    .refine((s) => {
      // Expect yyyy-mm-dd
      const d = new Date(s);
      if (Number.isNaN(d.getTime())) return false;
      // Compare as date-only
      const today = new Date(); today.setHours(0,0,0,0);
      d.setHours(0,0,0,0);
      return d.getTime() <= today.getTime();
    }, { message: 'Date cannot be in the future' }), // yyyy-mm-dd
  incident_time: z.string().min(1, 'Time is required'), // HH:mm from input[type=time]
  location: z.string().trim().min(1, 'Location is required'),

  complaint_type: z.enum([...COMPLAINT_TYPES] as [string, ...string[]]),
  // When complaint_type is "Other", this must be provided by the user
  other_text: z.string().trim().optional().or(z.literal('')),
  description: z.string().trim().optional().or(z.literal('')),

  photo_file: z.instanceof(File, { message: 'Photo is required' }),
  video_file: z.instanceof(File, { message: 'Video is required' }),
}).refine((vals) => {
  if (vals.complaint_type === 'Other') {
    return (vals.other_text || '').trim().length > 0;
  }
  return true;
}, { message: 'Please specify your complaint type', path: ['other_text'] });

export type FormValues = z.infer<typeof formSchema>;
