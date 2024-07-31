import { Flex, Heading, Image, Text } from '@chakra-ui/react';

export const NotFoundPage = () => {
  return (
    <Flex
      flex="1"
      sx={{
        px: { base: 'md', lg: '3xl' },
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Flex
        sx={{
          flexDirection: 'column',
          gap: 'md',
          alignItems: 'center',
        }}
      >
        <Image src="img/not-found.png" alt="Not Found" sx={{ width: '35%' }} />
        <Heading
          sx={{ fontSize: 'heading.desktop.subtitle', color: 'brand.blue' }}
        >
          PÁGINA NO ENCONTRADA
        </Heading>
        <Text
          sx={{
            fontSize: 'text.lg',
            color: 'text.default',
            textAlign: 'center',
          }}
        >
          Lo sentimos, la página que estás buscando no se encuentra disponible o
          fue eliminada.
        </Text>
      </Flex>
    </Flex>
  );
};
