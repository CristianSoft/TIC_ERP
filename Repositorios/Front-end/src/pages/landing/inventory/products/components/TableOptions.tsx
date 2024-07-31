import { useState } from 'react';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';

import { Product } from '../../../../../types/inventory-models';
import { useAuth } from '../../../../../contexts/auth-context';
import { isInventory } from '../../../../../utils/check-role-helper';

import { AddProductModal } from './AddProductModal';
import { ButtonExcel } from './ButtonExcel';

interface TableOptionsProps {
  products: Product[];
  searchProduct: string;
  onSearchProductChange: (name: string) => void;
  onAddProduct: (product: Product) => void;
}

export const TableOptions = ({
  products,
  searchProduct,
  onSearchProductChange,
  onAddProduct,
}: TableOptionsProps) => {
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
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
          value={searchProduct}
          placeholder="Buscar un producto"
          onChange={(e) => onSearchProductChange(e.target.value)}
        />
      </InputGroup>
      <Flex sx={{ gap: 'sm' }}>
        {isInventory(user) ? (
          <Button
           aria-label="AddProduct"
            leftIcon={<AddIcon />}
            onClick={() => setIsAddProductModalOpen(true)}
          >
            Producto
          </Button>
        ) : null}
        <ButtonExcel data={products} />
      </Flex>

      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onAddProduct={onAddProduct}
      />
    </Flex>
  );
};
