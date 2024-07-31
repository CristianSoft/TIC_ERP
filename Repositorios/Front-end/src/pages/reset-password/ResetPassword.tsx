import { Flex } from '@chakra-ui/react';

import { ResetPasswordForm } from './components/ResetPasswordForm';

export const ResetPasswordPage = () => {
  return (
    <Flex
      flex="1"
      sx={{
        px: { base: 'md', lg: '3xl' },
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Flex sx={{ flexDirection: 'column', gap: 'md', alignItems: 'center' }}>
        <ResetPasswordForm
          onClick={() => console.log('Formulario de reseteo de contraseña')}
        />
      </Flex>
    </Flex>
  );
};
