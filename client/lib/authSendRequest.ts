import { Resend } from 'resend';
import PokexchangeMagicLinkEmail from '@/emails/PokexchangeMagicLinkEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendVerificationParams {
  email: string;
  url: string;
}

export async function sendVerificationRequest({
  email,
  url,
}: SendVerificationParams) {
  const result = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Connexion à Pokexchange',
    react: PokexchangeMagicLinkEmail({ url }),
  });

  if (result.error) {
    throw new Error(`Erreur d'envoi : ${result.error.message}`);
  }
}
