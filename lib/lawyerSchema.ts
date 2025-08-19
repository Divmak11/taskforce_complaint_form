import { z } from 'zod';

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, { message: 'Enter a valid 10-digit Indian mobile number' });

export const lawyerFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  whatsapp: phoneSchema,
  practicing_court: z.string().trim().min(1, 'Practicing Court is required'),
  assembly: z.string().trim().min(1, 'Vidhansabha/Assembly is required'),
  email: z.string().email('Enter a valid email address'),
});

export type LawyerFormValues = z.infer<typeof lawyerFormSchema>;
