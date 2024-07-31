import { Link } from 'react-router-dom';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';

import { MyIcon, TypeFi } from '../../../components/MyIcon';

interface LinkCardProps {
  icon: TypeFi;
  title: string;
  description: string;
  to: string;
}

export const LinkCard = ({ icon, title, description, to }: LinkCardProps) => {
  return (
    <Flex
      as={Link}
      to={to}
      sx={{
        shadow: 'md',
        p: 'md',
        w: { sm: '100%', lg: '23%' },
        _hover: { bg: 'primary.100' },
        justifyContent: 'space-between',
      }}
    >
      <Flex sx={{ alignItems: 'start', gap: 'md' }}>
        <Box sx={{ bg: 'brand.blue', p: 'xs', rounded: 'md', color: 'white' }}>
          <MyIcon icon={icon} size={24} strokeWidth={2} />{' '}
        </Box>
        <Flex sx={{ flexDirection: 'column', gap: 'sm' }}>
          <Heading sx={{ fontSize: 'text.lg' }}>{title}</Heading>
          <Text sx={{ color: 'text.default', textAlign: 'justify' }}>
            {description}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
