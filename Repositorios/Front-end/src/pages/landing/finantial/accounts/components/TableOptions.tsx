import { useState } from 'react';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';

import { Account } from '../../../../../types/finantial-models';
import { useAuth } from '../../../../../contexts/auth-context';
import {
  VICEPRESIDENTE_DE_CULTURA,
  VICEPRESIDENTE_FINANCIERO,
} from '../../../../../utils/roles-constants';
import { isFinantial } from '../../../../../utils/check-role-helper';

import { ButtonExcel } from './ButtonExcel';
import { AddAccountModal } from './AddAccountModal';

interface TableOptionsProps {
  accounts: Account[];
  searchAccount: string;
  onSearchAccountChange: (name: string) => void;
  onAddAccount: (account: Account) => void;
}

export const TableOptions = ({
  accounts,
  searchAccount,
  onSearchAccountChange,
  onAddAccount,
}: TableOptionsProps) => {
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const { user } = useAuth();
  return (
    <Flex
      sx={{
        flexDirection: { sm: 'column', lg: 'row' },
        gap: 'md',
        justifyContent: 'space-between',
      }}
    >
      <InputGroup sx={{ width: { sm: '100%', lg: 'md' } }}>
        <InputLeftElement>
          <SearchIcon sx={{ color: 'text.default' }} />
        </InputLeftElement>
        <Input
          value={searchAccount}
          placeholder="Buscar una cuenta contable"
          onChange={(e) => onSearchAccountChange(e.target.value)}
        />
      </InputGroup>
      <Flex sx={{ gap: 'sm' }}>
        {isFinantial(user) ? (
          <Button
            aria-label="Add Account"
            leftIcon={<AddIcon />}
            onClick={() => setIsAddAccountModalOpen(true)}
          >
            Cuenta
          </Button>
        ) : null}
        <ButtonExcel data={accounts} />
      </Flex>

      <AddAccountModal
        isOpen={isAddAccountModalOpen}
        onClose={() => setIsAddAccountModalOpen(false)}
        onAddAccount={onAddAccount}
      />
    </Flex>
  );
};
