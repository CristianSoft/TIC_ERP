import { Box, Flex, Heading, Text } from '@chakra-ui/react';

import { MyIcon, TypeFi } from '../../../components/MyIcon';

interface GlosaryCardProps {
  icon: TypeFi;
  word: string;
  meaning: string;
}

export const GlosaryCard = ({ icon, word, meaning }: GlosaryCardProps) => {
  return (
    <Flex align="start" sx={{ boxShadow: 'lg', py: 'md', px: 'xl', gap: 'md' }}>
      <Box sx={{ bg: 'brand.blue', p: '2xs', rounded: 'md', color: 'white' }}>
        <MyIcon icon={icon} size={24} strokeWidth={2} />
      </Box>
      <Flex sx={{ flexDirection: 'column', gap: 'xs' }}>
        <Heading sx={{ fontSize: 'text.lg' }}>{word}</Heading>
        <Text sx={{ textColor: 'text.default', textAlign: 'justify' }}>
          {meaning}
        </Text>
      </Flex>
    </Flex>
  );
};
