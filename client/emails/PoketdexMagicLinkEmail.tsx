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

interface PoketdexMagicLinkEmailProps {
  url: string;
}

function PoketdexMagicLinkEmail({ url }: PoketdexMagicLinkEmailProps) {
  return (
    <Html lang='fr'>
      <Head />
      <Tailwind
        config={{
          theme: { extend: { colors: { primarygreen: '#22c55e' } } },
        }}
      >
        <Body className='bg-white font-sans'>
          <Container className='p-6 mx-auto'>
            {/* Titre de bienvenue */}
            <Heading className='text-center my-0'>
              Bienvenue sur PoketDex
            </Heading>

            {/* Message explicatif */}
            <Section className='mt-4'>
              <Text>
                Vous avez demandé à vous connecter à Poketdex.
                <br />
                Cliquez sur le bouton ci-dessous pour confirmer votre
                connexion :
              </Text>
            </Section>

            {/* Bouton d’action */}
            <Section className='text-center mt-6'>
              <Button
                href={url}
                className='bg-primarygreen text-white rounded-lg py-3 px-6'
              >
                Se connecter à PoketDex
              </Button>
            </Section>

            {/* Note de bas de page */}
            <Section className='mt-4'>
              <Text className='text-sm text-gray-600'>
                Si vous n&apos;êtes pas à l&apos;origine de cette demande, vous
                pouvez ignorer cet e-mail.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default PoketdexMagicLinkEmail;
