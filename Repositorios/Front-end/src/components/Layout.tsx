import { ReactElement } from 'react';
import { Flex } from '@chakra-ui/react';

import { useAuth } from '../contexts/auth-context';
import { ADMIN } from '../utils/roles-constants';

import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ModulesNavbar } from './ModulesNavbar';

interface LayoutProps {
  children: ReactElement;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();

  return (
    <Flex sx={{ flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      {user && user?.role != ADMIN ? <ModulesNavbar /> : null}
      <Flex
        flex="1"
        sx={{
          flexDirection: 'column',
          my: 'xl',
        }}
      >
        {children}
      </Flex>
      <Footer />
    </Flex>
  );
};
