import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  message: z.string().trim().min(1, 'Please enter a message.'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;
