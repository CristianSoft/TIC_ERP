import { useState } from 'react';
import { Heading, Flex, Link, Text } from '@chakra-ui/react';

import { Supplier } from '../../../types/supplier-models';

import useUpdateProvider, {
  CreateUpdateProviderDTO,
} from '../../../hooks/inventory/updateProviderHook';
import usePatchProviderState from '../../../hooks/inventory/patchProvider';
import usePostProvider from '../../../hooks/inventory/createProviderHook';
import { useGenericToast } from '../../../hooks/general/useGenericToast';

import { EditSupplierModal } from './components/EditSupplierModal';
import { SuppliersTable } from './components/SuppliersTable';
import useFetchProviders from '../../../hooks/inventory/fetchProviderHook';

export const SuppliersPage = () => {
  const [isEditSupplierModalOpen, setEditSupplierModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [searchSupplier, setSearchSupplier] = useState('');

  const {
    providers,
    isLoadingProviders,
    providerErrors,
    updateProviderState,
    addProviderState,
  } = useFetchProviders();
  const { updateProvider } = useUpdateProvider();
  const { patchProviderState } = usePatchProviderState();
  const { postProvider } = usePostProvider();

  const showToast = useGenericToast();

  const handleEditMovement = async (data: { supplier: Supplier }) => {
    try {
      const updatedInfo: CreateUpdateProviderDTO = {
        name: data.supplier.name,
        phone: data.supplier.phone,
        email: data.supplier.email,
      };

      await updateProvider(data.supplier.id!, updatedInfo);

      updateProviderState(data.supplier.id!, {
        ...data.supplier,
        ...updatedInfo,
      });

      showToast({
        title: 'Actualización exitosa',
        description: 'Proveedor actualizado correctamente.',
        status: 'success',
      });

      console.log('Updated organizational information:', data.supplier);
    } catch (error) {
      console.error('Failed to update association:', error);

      showToast({
        title: 'Error',
        description: 'Hubo un problema al actualizar el proveedor.',
        status: 'error',
      });
    }
  };

  const handleDeleteMovement = async (id: number | undefined) => {
    try {
      await patchProviderState(id!);
      updateProviderState(id!, { stateid: 2 });

      showToast({
        title: 'Eliminación exitosa',
        description: `Proveedor eliminado correctamente.`,
        status: 'success',
      });

      console.log('Informacion organizacional eliminada:', id);
    } catch (error) {
      console.error('Failed to update association state:', error);

      showToast({
        title: 'Error',
        description: 'Hubo un problema al eliminar el proveedor.',
        status: 'error',
      });
    }
  };

  const openEditMovementModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setEditSupplierModalOpen(true);
  };

  const handleSearchSupplierChange = (name: string) => {
    setSearchSupplier(name);
  };

  const handleAddSupplier = async (newSupplier: Supplier) => {
    try {
      const newProvider: CreateUpdateProviderDTO = {
        name: newSupplier.name,
        phone: newSupplier.phone,
        email: newSupplier.email,
      };

      const createdProvider = await postProvider(newProvider);

      addProviderState(createdProvider);

      showToast({
        title: 'Creación exitosa',
        description: 'Proveedor creado correctamente.',
        status: 'success',
      });
    } catch (error) {
      console.error('Failed to create Subscriber:', error);

      showToast({
        title: 'Error',
        description: 'Hubo un problema al crear el proveedor.',
        status: 'error',
      });
    }
  };

  return (
    <Flex
      flex="1"
      sx={{ flexDirection: 'column', gap: 'lg', px: { base: 'md', lg: '3xl' } }}
    >
      <Heading>Proveedores</Heading>
      <Text sx={{ color: 'text.default', textAlign: 'justify' }}>
        Ahora que añadiste los proveedores necesarios, ya puedes
        <Link href="/inventario/productos" sx={{ color: 'brand.blue', mx: '3xs' }}>
          registrar tus productos
        </Link>
        o
        <Link
          href="/inventario/movimientos"
          sx={{ color: 'brand.blue', ml: '3xs' }}
        >
          añadir movimientos de inventario.
        </Link>
      </Text>
      <SuppliersTable
        suppliers={providers}
        onEdit={openEditMovementModal}
        onDelete={handleDeleteMovement}
        error={providerErrors}
        isLoading={isLoadingProviders}
        searchSupplier={searchSupplier}
        onSearchSupplierChange={handleSearchSupplierChange}
        onAddSupplier={handleAddSupplier}
      />

      <EditSupplierModal
        isOpen={isEditSupplierModalOpen}
        onClose={() => setEditSupplierModalOpen(false)}
        supplier={selectedSupplier}
        onSubmit={handleEditMovement}
      />
    </Flex>
  );
};
