import React, { useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  Flex,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { FaTrash, FaEdit } from 'react-icons/fa';

import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { OrganizationalInfo } from '../../../types/organizational-models';
import { INFO_TABLE_HEADERS } from '../../../utils/constants';
import { useGenericToast } from '../../../hooks/general/useGenericToast';

interface InformationTableProps {
  info: OrganizationalInfo[];
  error: Error | null;
  isLoading: boolean;
  onEdit: (info: OrganizationalInfo) => void;
  onDelete: (id: number) => void;
}
export const InformationTable = ({
  info,
  error,
  isLoading,
  onEdit,
  onDelete,
}: InformationTableProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInfoId, setSelectedInfoId] = useState<number | undefined>();
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
    setSelectedInfoId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedInfoId !== undefined) {
      onDelete(selectedInfoId);
    }
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <Center sx={{ width: '100vw' }}>
        <Spinner size="xl" sx={{ color: 'brand.blue' }} />
      </Center>
    );
  }

  return (
    <>
      <TableContainer sx={{ width: '100%' }}>
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
              <Th
                sx={{
                  borderRight: '1px',
                  width: '20',
                }}
              ></Th>
              {INFO_TABLE_HEADERS.map((header) => (
                <Th
                  key={header.key}
                  sx={{
                    borderRight: header.key ? '1px' : '',
                    borderColor: 'primary.100',
                  }}
                >
                  {header.label}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {info.length === 0 ? (
              <Tr>
                <Td colSpan={INFO_TABLE_HEADERS.length + 1}>
                  No olvides ingresar la información organizacional
                </Td>
              </Tr>
            ) : (
              info.map((inf) => (
                <Tr key={inf.id}>
                  <Td>
                    <Flex
                      sx={{
                        gap: 'sm',
                        flexDirection: { sm: 'column', lg: 'row' },
                      }}
                    >
                      <IconButton
                        aria-label="Edit Information"
                        icon={<FaEdit size={16} />}
                        onClick={() => onEdit(inf)}
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
                        aria-label="Delete Information"
                        icon={<FaTrash size={16} />}
                        onClick={() => handleDeleteClick(inf.id)}
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
                  <Td>{inf.mission}</Td>
                  <Td>{inf.vision}</Td>
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
        title="Eliminar información"
        body="¿Está seguro de eliminar esta información?"
      />
    </>
  );
};

export default InformationTable;
