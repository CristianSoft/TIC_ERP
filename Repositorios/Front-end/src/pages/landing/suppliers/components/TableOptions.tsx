import { useState } from 'react';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';

import { Supplier } from '../../../../types/supplier-models';
import { isInventory } from '../../../../utils/check-role-helper';
import { useAuth } from '../../../../contexts/auth-context';

import { AddSupplierModal } from './AddSupplierModal';
import { ButtonExcel } from './ButtonExcel';

interface TableOptionsProps {
  suppliers: Supplier[];
  searchSupplier: string;
  onSearchSupplierChange: (name: string) => void;
  onAddSupplier: (supplier: Supplier) => void;
}

export const TableOptions = ({
  suppliers,
  searchSupplier,
  onSearchSupplierChange,
  onAddSupplier,
}: TableOptionsProps) => {
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
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
          value={searchSupplier}
          placeholder="Buscar un proveedor"
          onChange={(e) => onSearchSupplierChange(e.target.value)}
        />
      </InputGroup>
      <Flex sx={{ gap: 'sm' }}>
        {isInventory(user) ? (
          <Button
            leftIcon={<AddIcon />}
            onClick={() => setIsAddSupplierModalOpen(true)}
          >
            Proveedor
          </Button>
        ) : null}
        <ButtonExcel data={suppliers} />
      </Flex>

      <AddSupplierModal
        isOpen={isAddSupplierModalOpen}
        onClose={() => setIsAddSupplierModalOpen(false)}
        onAddSupplier={onAddSupplier}
      />
    </Flex>
  );
};
