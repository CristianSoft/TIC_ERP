import React, { useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Flex,
  Td,
  IconButton,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { FaEdit, FaTrash } from 'react-icons/fa';

import { ConfirmationModal } from '../../../../components/ConfirmationModal';
import { Inventory } from '../../../../types/inventory-models';
import { INVENTORY_TABLE_HEADERS } from '../../../../utils/constants';
import { inventoriesFilterByProduct } from '../../../../utils/filter-helper';
import { isInventory } from '../../../../utils/check-role-helper';
import { useAuth } from '../../../../contexts/auth-context';
import { useGenericToast } from '../../../../hooks/general/useGenericToast';

import { TableOptions } from './TableOptions';

interface InventoryTableProps {
  movements: Inventory[];
  error: Error | null;
  isLoading: boolean;
  onEdit: (movement: Inventory) => void;
  onDelete: (id: number | undefined) => void;
  searchInventory: string;
  onSearchInventoryChange: (name: string) => void;
  onAddInventory: (inventory: Inventory) => void;
}

export const InventoryTable = ({
  movements,
  error,
  isLoading,
  onEdit,
  onDelete,
  searchInventory,
  onSearchInventoryChange,
  onAddInventory,
}: InventoryTableProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovementId, setSelectedMovementId] = useState<
    number | undefined
  >();
  const [filteredInventories, setFilteredInventories] = useState<Inventory[]>(
    []
  );

  const { user } = useAuth();
  useEffect(() => {
    setFilteredInventories(
      inventoriesFilterByProduct(movements, searchInventory)
    );
  }, [movements, searchInventory]);
  const showToast = useGenericToast();

  useEffect(() => {
    if (error) {
      showToast({
        title: 'Error',
        description: error.message,
        status: 'error',
      });
    }
  }, [error, showToast]);

  const handleDeleteClick = (id: number | undefined) => {
    setSelectedMovementId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedMovementId !== undefined) {
      onDelete(selectedMovementId);
    }
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <Center sx={{ width: 'auto' }}>
        <Spinner size="xl" sx={{ color: 'brand.blue' }} />
      </Center>
    );
  }

  return (
    <Flex sx={{ flexDirection: 'column', gap: 'md' }}>
      <TableOptions
        inventories={movements}
        searchMovement={searchInventory}
        onSearchMovementChange={onSearchInventoryChange}
        onAddInventory={onAddInventory}
      />
      <TableContainer>
        <Table
          variant="simple"
          sx={{
            'border': '1px solid',
            'borderColor': 'brand.blue',
            'borderCollapse': 'collapse',
            'width': '100%',
            'textColor': 'surface.default',
            'fontSize': 'text.md',
            '& th, & td': {
              textColor: 'text.default',
              fontSize: 'text.md',
              textAlign: 'center',
            },
            '& th': {
              bg: 'brand.blue',
              textColor: 'white',
              height: '58px',
            },
            '& td': {
              border: '1px solid',
              borderColor: 'brand.blue',
            },
          }}
        >
          <Thead>
            <Tr sx={{ textColor: 'surface.default' }}>
              {isInventory(user) ? (
                <Th
                  sx={{
                    borderRight: '1px',
                    width: '20',
                  }}
                ></Th>
              ) : null}
              {INVENTORY_TABLE_HEADERS.map((header, index) => (
                <Th
                  key={index}
                  sx={{
                    borderRight: '1px',
                  }}
                >
                  {header}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {filteredInventories.length === 0 ? (
              <Tr>
                <Td colSpan={INVENTORY_TABLE_HEADERS.length + 1}>
                  No olvides ingresar movimientos de inventario.
                </Td>
              </Tr>
            ) : (
              filteredInventories.map((movment) => (
                <Tr key={movment.id}>
                  {isInventory(user) ? (
                    <Td>
                      <Flex
                        sx={{
                          gap: 'sm',
                          flexDirection: { sm: 'column', lg: 'row' },
                        }}
                      >
                        <IconButton
                          aria-label="Edit Movement"
                          icon={<FaEdit size={16} />}
                          onClick={() => onEdit(movment)}
                          size="sm"
                          sx={{
                            bg: 'none',
                            color: 'brand.blue',
                            _hover: {
                              bg: 'secondary.100',
                              color: 'primary.default',
                            },
                          }}
                        />
                        {/*<IconButton
                          aria-label="Delete Movement"
                          icon={<FaTrash size={16} />}
                          onClick={() => handleDeleteClick(movment.id)}
                          size="sm"
                          sx={{
                            bg: 'none',
                            color: 'brand.blue',
                            _hover: {
                              bg: 'secondary.100',
                              color: 'primary.default',
                            },
                          }}
                        />*/}
                      </Flex>
                    </Td>
                  ) : null}
                  <Td>{movment.product}</Td>
                  <Td>{movment.movementType}</Td>
                  <Td>{movment.quantity}</Td>
                  <Td>{movment.date}</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Eliminar movimiento"
        body="¿Estás seguro de que deseas eliminar este movimiento de inventario?"
      />
    </Flex>
  );
};
