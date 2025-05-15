import { Resend } from 'resend';
import PoketdexMagicLinkEmail from '@/emails/PoketdexMagicLinkEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendVerificationParams {
  email: string;
  url: string;
}

export async function sendVerificationRequest({
  email,
  url,
}: SendVerificationParams) {
  try {
    const result = await resend.emails.send({
      from: 'signin@poketdex.app',
      to: email,
      subject: 'Connexion à Poketdex',
      react: PoketdexMagicLinkEmail({ url }),
    });

    if (result.error) {
      throw new Error(`Erreur Resend : ${result.error.message}`);
    }
  } catch (error) {
    console.error('❌ Erreur d’envoi de l’email :', error);
    throw new Error('Erreur interne lors de l’envoi du mail.');
  }
}
