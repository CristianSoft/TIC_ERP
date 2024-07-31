import { useState } from 'react';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';

import { BudgetRequest } from '../../../../../types/event-models';
import { isCulture } from '../../../../../utils/check-role-helper';
import { useAuth } from '../../../../../contexts/auth-context';

import { AddBudgetRequestModal } from './AddBudgetRequestModal';
import { ButtonExcel } from './ButtonExcel';

interface TableOptionsProps {
  requests: BudgetRequest[];
  searchBudgetRequest: string;
  onSearchBudgetRequestChange: (name: string) => void;
  onAddBudgetRequest: (request: BudgetRequest) => void;
}

export const TableOptions = ({
  requests,
  searchBudgetRequest,
  onSearchBudgetRequestChange,
  onAddBudgetRequest,
}: TableOptionsProps) => {
  const [isAddBudgetRequestModalOpen, setIsAddBudgetRequestModalOpen] =
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
          placeholder="Buscar una solicitud de presupuesto"
          value={searchBudgetRequest}
          onChange={(e) => onSearchBudgetRequestChange(e.target.value)}
        />
      </InputGroup>
      <Flex sx={{ gap: 'sm' }}>
        {/*{isCulture(user) ? (
          <Button
            leftIcon={<AddIcon />}
            onClick={() => setIsAddBudgetRequestModalOpen(true)}
          >
            Solicitud
          </Button>
        ) : null}*/}
        <ButtonExcel data={requests} />
      </Flex>

      <AddBudgetRequestModal
        isOpen={isAddBudgetRequestModalOpen}
        onClose={() => setIsAddBudgetRequestModalOpen(false)}
        onAddBudgetRequest={onAddBudgetRequest}
      />
    </Flex>
  );
};
