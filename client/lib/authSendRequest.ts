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
  console.log('📨 Envoi du lien à', email);
  console.log('🔐 RESEND_API_KEY chargée ?', !!process.env.RESEND_API_KEY);
  try {
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Connexion à Poketdex',
      react: PoketdexMagicLinkEmail({ url }),
    });

    console.log('✅ Email envoyé :', result);
    if (result.error) {
      throw new Error(`Erreur Resend : ${result.error.message}`);
    }
  } catch (error) {
    console.error('❌ Erreur d’envoi de l’email :', error);
    throw new Error('Erreur interne lors de l’envoi du mail.');
  }
}
