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
  Spinner,
  Center,
} from '@chakra-ui/react';
import { FaEdit, FaTrash } from 'react-icons/fa';

import { ConfirmationModal } from '../../../../components/ConfirmationModal';
import { SUPPLIERS_TABLE_HEADERS } from '../../../../utils/constants';
import { Supplier } from '../../../../types/supplier-models';
import { suppliersFilterByName } from '../../../../utils/filter-helper';
import { isInventory } from '../../../../utils/check-role-helper';
import { useAuth } from '../../../../contexts/auth-context';
import { useGenericToast } from '../../../../hooks/general/useGenericToast';

import { TableOptions } from './TableOptions';

interface SuppliersTableProps {
  suppliers: Supplier[];
  error: Error | null;
  isLoading: boolean;
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: number | undefined) => void;
  searchSupplier: string;
  onSearchSupplierChange: (name: string) => void;
  onAddSupplier: (supplier: Supplier) => void;
}

export const SuppliersTable = ({
  suppliers,
  error,
  isLoading,
  onEdit,
  onDelete,
  searchSupplier,
  onSearchSupplierChange,
  onAddSupplier,
}: SuppliersTableProps) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<
    number | undefined
  >();
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    setFilteredSuppliers(suppliersFilterByName(suppliers, searchSupplier));
  }, [suppliers, searchSupplier]);
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
    setSelectedSupplierId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedSupplierId !== undefined) {
      onDelete(selectedSupplierId);
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
        suppliers={suppliers}
        searchSupplier={searchSupplier}
        onSearchSupplierChange={onSearchSupplierChange}
        onAddSupplier={onAddSupplier}
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
              {SUPPLIERS_TABLE_HEADERS.map((header, index) => (
                <Th
                  key={index}
                  sx={{
                    borderRight: '1px',
                    borderColor: 'primary.100',
                  }}
                >
                  {header}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {filteredSuppliers.length === 0 ? (
              <Tr>
                <Td colSpan={SUPPLIERS_TABLE_HEADERS.length + 1}>
                  No olvides ingresar proveedores.
                </Td>
              </Tr>
            ) : (
              filteredSuppliers.map((supplier) => (
                <Tr key={supplier.id}>
                  {isInventory(user) ? (
                    <Td>
                      <Flex
                        sx={{
                          gap: 'sm',
                          flexDirection: { sm: 'column', lg: 'row' },
                        }}
                      >
                        <IconButton
                          aria-label="Edit Event"
                          icon={<FaEdit size={16} />}
                          onClick={() => onEdit(supplier)}
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
                        <IconButton
                          aria-label="Delete Event"
                          icon={<FaTrash size={16} />}
                          onClick={() => handleDeleteClick(supplier.id)}
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
                      </Flex>
                    </Td>
                  ) : null}
                  <Td>{supplier.name}</Td>
                  <Td>{supplier.phone}</Td>
                  <Td>{supplier.email}</Td>
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
        title="Eliminar proveedor"
        body="¿Estás seguro de que deseas eliminar este proveedor?"
      />
    </Flex>
  );
};
