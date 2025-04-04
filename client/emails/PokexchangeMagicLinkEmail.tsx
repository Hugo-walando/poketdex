import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Tailwind,
} from '@react-email/components';

interface PokexchangeMagicLinkEmailProps {
  url: string;
}

const PokexchangeMagicLinkEmail: React.FC<PokexchangeMagicLinkEmailProps> = ({
  url,
}) => (
  <Html lang='fr'>
    <Head />
    <Tailwind
      config={{ theme: { extend: { colors: { primarygreen: '#22c55e' } } } }}
    >
      <Body className='bg-white font-sans'>
        <Container className='p-6 mx-auto'>
          {/* Titre de bienvenue */}
          <Heading className='text-center my-0'>
            Bienvenue sur Pokexchange
          </Heading>
          {/* Message explicatif */}
          <Section className='mt-4'>
            <Text>
              Vous avez demand\u00e9 \u00e0 vous connecter \u00e0 Pokexchange.
              <br />
              Cliquez sur le bouton ci-dessous pour confirmer votre connexion :
            </Text>
          </Section>
          {/* Bouton d’action */}
          <Section className='text-center mt-6'>
            <Button
              href={url}
              className='bg-primarygreen text-white rounded-lg py-3 px-6'
            >
              Se connecter &#224; Pokexchange
            </Button>
          </Section>
          {/* Note de bas de page */}
          <Section className='mt-4'>
            <Text className='text-sm text-gray-600'>
              Si vous n&apos;êtes pas &#224; l&apos;origine de cette demande,
              vous pouvez ignorer cet e-mail.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default PokexchangeMagicLinkEmail;
