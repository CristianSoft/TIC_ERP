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

import { ConfirmationModal } from '../../../components/ConfirmationModal'; // Importa el componente del modal
import { Member } from '../../../types/organizational-models';
import { ADMIN_MEMBERS_TABLE_HEADERS } from '../../../utils/constants';
import { useGenericToast } from '../../../hooks/general/useGenericToast';

interface AdminMembersTableProps {
  members: Member[];
  error: Error | null;
  isLoading: boolean;
  onEdit: (member: Member) => void;
  onDelete: (id: number) => void;
}
export const AdminMembersTable = ({
  members,
  error,
  isLoading,
  onEdit,
  onDelete,
}: AdminMembersTableProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<
    number | undefined
  >();
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
    setSelectedMemberId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedMemberId !== undefined) {
      onDelete(selectedMemberId);
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
              <Th
                sx={{
                  borderRight: '1px',
                  width: '20',
                }}
              ></Th>
              {ADMIN_MEMBERS_TABLE_HEADERS.map((header) => (
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
            {members.length === 0 ? (
              <Tr>
                <Td colSpan={ADMIN_MEMBERS_TABLE_HEADERS.length + 1}>
                  No olvides ingresar miembros administrativos
                </Td>
              </Tr>
            ) : (
              members.map((member) => (
                <Tr key={member.id}>
                  <Td>
                    <Flex
                      sx={{
                        gap: 'sm',
                        flexDirection: { sm: 'column', lg: 'row' },
                      }}
                    >
                      <IconButton
                        aria-label="Edit Member"
                        icon={<FaEdit size={16} />}
                        onClick={() => onEdit(member)}
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
                        aria-label="Delete Member"
                        icon={<FaTrash size={16} />}
                        onClick={() => handleDeleteClick(member.id)}
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
                  <Td>{member.position}</Td>
                  <Td>{member.firstName}</Td>
                  <Td>{member.lastName}</Td>
                  <Td>{member.birthDate}</Td>
                  <Td>{member.cellphone}</Td>
                  <Td>{member.faculty}</Td>
                  <Td>{member.career}</Td>
                  <Td>{member.semester}</Td>
                  <Td>{member.email}</Td>
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
        title="Eliminar miembro administrativo"
        body="¿Estás seguro de que deseas eliminar este miembro administrativo?"
      />
    </>
  );
};
