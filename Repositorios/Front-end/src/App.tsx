import React from 'react';
import { ChakraProvider, ColorModeScript, Box } from '@chakra-ui/react';
import { theme } from '@chakra-ui/react';

import { customTheme } from './theme/theme';
import { Fonts } from './theme/fonts';
import { MainRouter } from './components/MainRouter';

export const App = () => {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={customTheme}>
        <Fonts />
        <Box
          sx={{
            minHeight: '100vh',
            maxWidth: '8xl',
            px: { sm: 'md', md: 'none' },
            mx: 'auto',
          }}
        >
          <MainRouter />
        </Box>
      </ChakraProvider>
    </>
  );
};
