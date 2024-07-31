import { Flex, Heading, Text } from '@chakra-ui/react';
import useFetchAssociations from '../../../hooks/admin/fetchInformationTableHook';

export const MisionVisionCard = () => {
  const { associations } = useFetchAssociations();
  associations.reverse();


  return (
    <Flex sx={{ gap: '3xl', maxWidth: '100vw' }}>
      <Flex
        sx={{
          mr: { sm: 'none', lg: '3xl' },
          flexDirection: 'column',
          gap: 'sm',
          width: '50%',
        }}
      >
        <Heading
          sx={{
            fontSize: 'heading.desktop.subtitle',
          }}
        >
          Misión
        </Heading>
        <Text
          sx={{
            textColor: 'text.default',
            textAlign: 'justify',
          }}
        >
          {associations[0]?.mission}
        </Text>
      </Flex>
      <Flex
        sx={{
          width: '50%',
          flexDirection: 'column',
          gap: 'sm',
        }}
      >
        <Heading
          sx={{
            fontSize: 'heading.desktop.subtitle',
          }}
        >
          Visión
        </Heading>
        <Text
          sx={{
            textColor: 'text.default',
            textAlign: 'justify',
          }}
        >
          {associations[0]?.vision}
        </Text>
      </Flex>
    </Flex>
  );
};
