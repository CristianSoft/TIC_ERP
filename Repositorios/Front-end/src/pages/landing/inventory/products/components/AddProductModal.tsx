import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';

import { FormField } from '../../../../../components/FormField';
import { productsSchema } from '../../../../../utils/inventory-validations-helper';
import { Product } from '../../../../../types/inventory-models';
import useFetchProviders from '../../../../../hooks/inventory/fetchProviderHook';
import useFetchCategories from '../../../../../hooks/inventory/fetchCategoryHook';


interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
}

export const AddProductModal = ({
  isOpen,
  onClose,
  onAddProduct: onAddEvent,
}: AddProductModalProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Product>({
    resolver: yupResolver(productsSchema),
  });

  const onSubmit = (data: Product) => {
    console.log('Nuevo producto agregado:', data);
    onAddEvent(data);
    onClose();
  };

  const { providers } = useFetchProviders();

  const { categoriesData } = useFetchCategories();
  const providerNames = providers.map((plan) => plan.name);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent sx={{ p: 'sm' }}>
        <ModalHeader color="brand.blue" textAlign="center">
          Agregar Producto
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody textColor="text.default">
          <FormField
            id="name"
            label="Nombre del producto"
            placeholder="Ingrese el nombre del producto"
            register={register}
            errors={errors.name}
          />
          <FormField
            id="category"
            label="Categoría del producto"
            placeholder="Seleccione la categoría"
            register={register}
            errors={errors.category}
            options={categoriesData}
          />
          <FormField
            id="description"
            label="Descripción"
            placeholder="Ingrese la descripción del evento"
            register={register}
            errors={errors.description}
          />
          <FormField
            id="price"
            label="Precio"
            placeholder="Ingrese el precio del producto"
            register={register}
            errors={errors.price}
          />
          <FormField
            id="quantity"
            label="Cantidad"
            placeholder="Ingrese la cantidad del producto"
            register={register}
            errors={errors.quantity}
          />
          <FormField
            id="label"
            label="Etiqueta"
            placeholder="Ingrese la etiqueta del producto"
            register={register}
            errors={errors.label}
          />
          <FormField
            id="provider"
            label="Proveedor"
            placeholder="Seleccione el proveedor"
            register={register}
            errors={errors.provider}
            options={providerNames}
          />
          <ModalFooter>
            <Button type="submit" onClick={handleSubmit(onSubmit)}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
