import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

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
    html: `
      <p>Bonjour 👋</p>
      <p>Clique ici pour te connecter à Pokexchange :</p>
      <p><a href="${url}">${url}</a></p>
    `,
  });

  if (result.error) {
    throw new Error(`Erreur d'envoi : ${result.error.message}`);
  }
}
