import { useState } from 'react';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';

import { Transaction } from '../../../../../types/finantial-models';
import { isFinantial } from '../../../../../utils/check-role-helper';
import { useAuth } from '../../../../../contexts/auth-context';

import { AddTransactionModal } from './AddTransactionModal';
import { ButtonExcel } from './ButtonExcel';

interface TableOptionsProps {
  transactions: Transaction[];
  searchTransaction: string;
  onSearchTransactionChange: (name: string) => void;
  onAddTransaction: (transaction: Transaction) => void;
}

export const TableOptions = ({
  transactions,
  searchTransaction,
  onSearchTransactionChange,
  onAddTransaction,
}: TableOptionsProps) => {
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] =
    useState(false);
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
          value={searchTransaction}
          placeholder="Buscar una transacción"
          onChange={(e) => onSearchTransactionChange(e.target.value)}
        />
      </InputGroup>
      <Flex sx={{ gap: 'sm' }}>
        {isFinantial(user) ? (
          <Button
            aria-label='Add Transaction'
            leftIcon={<AddIcon />}
            onClick={() => setIsAddTransactionModalOpen(true)}
          >
            Transacción
          </Button>
        ) : null}
        <ButtonExcel data={transactions} />
      </Flex>

      <AddTransactionModal
        isOpen={isAddTransactionModalOpen}
        onClose={() => setIsAddTransactionModalOpen(false)}
        onAddTransaction={onAddTransaction}
      />
    </Flex>
  );
};
