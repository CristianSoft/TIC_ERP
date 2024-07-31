import { Flex, IconButton, Text, Box } from '@chakra-ui/react';

import { getCurrentYear } from '../utils/date-helper';

import { MyIcon } from './MyIcon';

export const Footer = () => {
  return (
    <Flex
      sx={{
        flexDirection: 'column',
        gap: 'xs',
        px: { base: 'md', lg: '3xl' },
        py: 'xs',
        textAlign: 'center',
        borderTop: '1px solid',
        borderColor: 'surface.default',
      }}
    >
      <Flex sx={{ flexDirection: 'column', textColor: 'text.300', gap: 'sm' }}>
        <Box>
          <Text>
            Federación de Estudiantes de la Escuela Politécnica Nacional
          </Text>
          <Flex
            sx={{ alignItems: 'center', justifyContent: 'center', gap: 'xs' }}
          >
            <MyIcon icon="FiMail" size={16} />
            <Text>fepon@epn.edu.ec</Text>
          </Flex>
        </Box>
        <Text>Copyright © {getCurrentYear()}</Text>
      </Flex>
      <Flex
        sx={{
          justifyContent: 'center',
          gap: 'lg',
        }}
      >
        <IconButton
          as="a"
          href="https://www.facebook.com/fepon.epn"
          target="_blank"
          aria-label="Facebook"
          size="md"
          icon={
            <Box
              sx={{
                bg: 'brand.blue',
                p: '3xs',
                rounded: 'full',
                color: 'white',
              }}
            >
              {' '}
              <MyIcon icon="FiFacebook" size={14} />
            </Box>
          }
          variant="ghost"
          sx={{
            '&:hover': {
              bg: 'secondary.100',
            },
          }}
        />
        <IconButton
          as="a"
          href="https://www.instagram.com/fepon.epn/"
          target="_blank"
          aria-label="Instagram"
          size="md"
          icon={
            <Box
              sx={{
                bg: 'brand.blue',
                p: '3xs',
                rounded: 'md',
                color: 'white',
              }}
            >
              {' '}
              <MyIcon icon="FiInstagram" size={14} />
            </Box>
          }
          variant="ghost"
          sx={{
            '&:hover': {
              bg: 'secondary.100',
            },
          }}
        />
        <IconButton
          as="a"
          href="https://www.linkedin.com/company/fepon/"
          target="_blank"
          aria-label="LinkedIn"
          size="md"
          icon={
            <Box
              sx={{
                bg: 'brand.blue',
                p: '3xs',
                rounded: 'md',
                color: 'white',
              }}
            >
              <MyIcon icon="FiLinkedin" size={14} />
            </Box>
          }
          variant="ghost"
          sx={{
            '&:hover': {
              bg: 'secondary.100',
            },
          }}
        />
      </Flex>
    </Flex>
  );
};
