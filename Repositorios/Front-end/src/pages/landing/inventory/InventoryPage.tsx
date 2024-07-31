import { Heading, Flex, Text, Link } from '@chakra-ui/react';
import { useState } from 'react';
import { format, formatISO, parseISO } from 'date-fns';

import { Inventory } from '../../../types/inventory-models';

import useUpdateInventoryMovement, {
  CreateUpdateInventoryMovementDTO,
} from '../../../hooks/inventory/updateInventoryHook';
import usePatchInventoryMovementState from '../../../hooks/inventory/patchInventoryHook';
import usePostInventoryMovement from '../../../hooks/inventory/createInventoryHook';

import { EditInventoryModal } from './components/EditInventoryModal';
import { InventoryTable } from './components/InventoryTable';
import { useGenericToast } from '../../../hooks/general/useGenericToast';
import useFetchInventoryMovements from '../../../hooks/inventory/fetchInventoryHook';

export const InventoryPage = () => {
  const [isEditInventoryModalOpen, setEditInventoryModalOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(
    null
  );
  const [searchInventory, setSearchInventory] = useState('');
  const { updateInventoryMovement } = useUpdateInventoryMovement();
  const {
    inventoryMovements,
    isLoadingInventoryMovements,
    inventoryMovementErrors,
    updateInventoryMovementState,
    addInventoryMovementState,
  } = useFetchInventoryMovements();

  const { patchInventoryMovementState } = usePatchInventoryMovementState();
  const { postInventoryMovement } = usePostInventoryMovement();
  const showToast = useGenericToast();

  const handleEditMovement = async (data: { movements: Inventory }) => {
    try {
      const formattedDate = formatISO(new Date(data.movements.date));
      const updatedInfo: CreateUpdateInventoryMovementDTO = {
        date: formattedDate,
        product_Name: data.movements.product,
        inventory_Movement_Type_Name: data.movements.movementType,
        quantity: data.movements.quantity,
      };

      const originalFormattedDate = format(
        parseISO(data.movements.date),
        'dd/MM/yyyy'
      );

      await updateInventoryMovement(data.movements.id!, updatedInfo);

      updateInventoryMovementState(data.movements.id!, {
        ...data.movements,
        ...updatedInfo,
        date: originalFormattedDate,
      });

      showToast({
        title: 'Actualización exitosa',
        description: 'Movimiento de inventario actualizado con éxito.',
        status: 'success',
      });
    } catch (error) {
      console.error('Failed to update association:', error);
      if (error instanceof Error) {
        showToast({
          title: 'Error al actualizar el movimiento de inventario',
          description: error.message,
          status: 'error',
        });
      }
    }
  };

  const handleDeleteMovement = async (id: number | undefined) => {
    try {
      await patchInventoryMovementState(id!);
      updateInventoryMovementState(id!, { stateid: 2 });

      showToast({
        title: 'Eliminación exitosa',
        description: `Movimiento de inventario eliminado correctamente.`,
        status: 'success',
      });
    } catch (error) {
      console.error('Failed to update association state:', error);
      if (error instanceof Error) {
        showToast({
          title: 'Error al eliminar el movimiento de inventario',
          description: error.message,
          status: 'error',
        });
      }
    }
  };

  const openEditMovementModal = (movement: Inventory) => {
    setSelectedInventory(movement);
    setEditInventoryModalOpen(true);
  };

  const handleSearchInventoryChange = (name: string) => {
    setSearchInventory(name);
  };

  const handleAddInventory = async (newInventory: Inventory) => {
    try {
      const newContributionPlan: CreateUpdateInventoryMovementDTO = {
        date: formatISO(new Date(newInventory.date)),
        product_Name: newInventory.product,
        inventory_Movement_Type_Name: newInventory.movementType,
        quantity: newInventory.quantity,
      };

      const newInventoryMovement =
        await postInventoryMovement(newContributionPlan);

      addInventoryMovementState(newInventoryMovement);

      showToast({
        title: 'Registro exitoso',
        description: 'El movimiento de inventario se registró correctamente.',
        status: 'success',
      });
    } catch (error) {
      console.error('Failed to update association:', error);
      if (error instanceof Error) {
        showToast({
          title: 'Error al añadir el movimiento de inventario',
          description: error.message,
          status: 'error',
        });
      }
    }
  };

  return (
    <Flex
      flex="1"
      sx={{ flexDirection: 'column', gap: 'lg', px: { base: 'md', lg: '3xl' } }}
    >
      <Heading>Movimientos de Inventario</Heading>
      <Text sx={{ color: 'text.default', textAlign: 'justify' }}>
        Antes de añadir un movimiento de inventario, asegúrate de que tu
        producto y proveedor ya se encuentren registrados. En caso de no estar
        seguro revisa los
        <Link
          href="/inventario/productos"
          sx={{ color: 'brand.blue', ml: '3xs' }}
        >
          productos existentes
        </Link>{' '}
        y los{' '}
        <Link href="/proveedores" sx={{ color: 'brand.blue', ml: '3xs' }}>
          proveedores disponibles.
        </Link>
      </Text>
      <InventoryTable
        movements={inventoryMovements}
        onEdit={openEditMovementModal}
        onDelete={handleDeleteMovement}
        error={inventoryMovementErrors}
        isLoading={isLoadingInventoryMovements}
        searchInventory={searchInventory}
        onSearchInventoryChange={handleSearchInventoryChange}
        onAddInventory={handleAddInventory}
      />

      <EditInventoryModal
        isOpen={isEditInventoryModalOpen}
        onClose={() => setEditInventoryModalOpen(false)}
        inventory={selectedInventory}
        onSubmit={handleEditMovement}
      />
    </Flex>
  );
};
