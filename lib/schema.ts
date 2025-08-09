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

  incident_date: z.string().min(1, 'Date is required'), // yyyy-mm-dd from input[type=date]
  incident_time: z.string().min(1, 'Time is required'), // HH:mm from input[type=time]
  location: z.string().trim().min(1, 'Location is required'),

  complaint_type: z.enum([...COMPLAINT_TYPES] as [string, ...string[]]),
  description: z.string().trim().optional().or(z.literal('')),

  photo_file: z.instanceof(File, { message: 'Photo is required' }),
  video_file: z.instanceof(File, { message: 'Video is required' }),
});

export type FormValues = z.infer<typeof formSchema>;
