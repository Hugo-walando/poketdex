import { z } from 'zod';

export const updateUserSchema = z.object({
  username: z
    .string()
    .min(3, 'Le pseudo doit contenir au moins 3 caractères')
    .max(14, 'Le pseudo ne peut pas dépasser 14 caractères')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Le pseudo ne peut contenir que lettres, chiffres et underscores',
    ),

  friend_code: z
    .string()
    .transform((val) => val.replace(/-/g, '')) // enlève les tirets
    .refine((val) => /^\d{16}$/.test(val), {
      message: 'Le code ami doit contenir 16 chiffres',
    }),
});

export const partialUserSchema = updateUserSchema.partial();
