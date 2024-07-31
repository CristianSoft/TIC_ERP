import { Heading, Flex, Text, Link } from '@chakra-ui/react';
import { useState } from 'react';

import { Product } from '../../../../types/inventory-models';

import useUpdateProduct, {
  CreateUpdateProductDTO,
} from '../../../../hooks/inventory/updateProductHook';
import usePatchProductState from '../../../../hooks/inventory/patchProductHook';
import usePostProduct from '../../../../hooks/inventory/createProductHook';
import { useGenericToast } from '../../../../hooks/general/useGenericToast';

import { EditProductModal } from './components/EditProducModal';
import { ProductsTable } from './components/ProductsTable';
import useFetchProducts from '../../../../hooks/inventory/fetchProductHook';

export const ProductsPage = () => {
  const [isEditProductModalOpen, setEditProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchEvent, setSearchEvent] = useState('');

  const {
    products,
    isLoadingProducts,
    productErrors,
    updateProductState,
    addProductState,
  } = useFetchProducts();
  const { patchProductState } = usePatchProductState();
  const { updateProduct } = useUpdateProduct();
  const { postProduct } = usePostProduct();
  const showToast = useGenericToast();

  const handleEditProduct = async (data: { product: Product }) => {
    try {
      const updatedInfo: CreateUpdateProductDTO = {
        name: data.product.name,
        description: data.product.description,
        price: data.product.price,
        quantity: data.product.quantity,
        label: data.product.label,
        category: data.product.category,
        provider: data.product.provider,
      };

      await updateProduct(data.product.id!, updatedInfo);

      updateProductState(data.product.id!, { ...data.product, ...updatedInfo });

      showToast({
        title: 'Actualización exitosa',
        description: 'Información del producto actualizada correctamente.',
        status: 'success',
      });

      console.log('Updated organizational information:', data.product);
    } catch (error) {
      console.error('Failed to update association:', error);
      showToast({
        title: 'Error',
        description: 'Hubo un problema al actualizar el producto.',
        status: 'error',
      });
    }
  };

  const handleDeleteProduct = async (id: number | undefined) => {
    try {
      await patchProductState(id!);
      updateProductState(id!, { stateid: 2 });

      showToast({
        title: 'Eliminación exitosa',
        description: `Producto eliminado correctamente.`,
        status: 'success',
      });

      console.log('Producto eliminado:', id);
    } catch (error) {
      console.error('Failed to update association state:', error);
      showToast({
        title: 'Error',
        description: 'Hubo un problema al eliminar el producto.',
        status: 'error',
      });
    }
  };

  const openEditProductModal = (product: Product) => {
    setSelectedProduct(product);
    setEditProductModalOpen(true);
  };

  const handleSearchEventChange = (name: string) => {
    setSearchEvent(name);
  };

  const handleAddProduct = async (newProduct: Product) => {
    try {
      const newProductCreated: CreateUpdateProductDTO = {
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        quantity: newProduct.quantity,
        label: newProduct.label,
        category: newProduct.category,
        provider: newProduct.provider,
      };

      const createdProduct = await postProduct(newProductCreated);

      addProductState(createdProduct);

      showToast({
        title: 'Creación exitosa',
        description: 'Producto creado correctamente.',
        status: 'success',
      });
    } catch (error) {
      console.error('Failed to create product:', error);

      showToast({
        title: 'Error',
        description: 'Hubo un problema al crear el producto.',
        status: 'error',
      });
    }
  };

  return (
    <Flex
      flex="1"
      sx={{ flexDirection: 'column', gap: 'lg', px: { base: 'md', lg: '3xl' } }}
    >
      <Heading>Productos</Heading>
      <Text sx={{ color: 'text.default', textAlign: 'justify' }}>
        Ahora que añadiste los productos necesarios, no olvides
        <Link href="/proveedores" sx={{ color: 'brand.blue', mx: '3xs' }}>
          registrar tus proveedores
        </Link>
        previo a
        <Link
          href="/inventario/movimientos"
          sx={{ color: 'brand.blue', ml: '3xs' }}
        >
          añadir tus movimientos de inventario.
        </Link>
      </Text>
      <ProductsTable
        products={products}
        onEdit={openEditProductModal}
        onDelete={handleDeleteProduct}
        error={productErrors}
        isLoading={isLoadingProducts}
        searchProduct={searchEvent}
        onSearchProductChange={handleSearchEventChange}
        onAddProduct={handleAddProduct}
      />

      <EditProductModal
        isOpen={isEditProductModalOpen}
        onClose={() => setEditProductModalOpen(false)}
        product={selectedProduct}
        onSubmit={handleEditProduct}
      />
    </Flex>
  );
};
