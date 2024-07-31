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

import { FormField } from '../../../../components/FormField';
import { inventorySchema } from '../../../../utils/inventory-validations-helper';
import { Inventory } from '../../../../types/inventory-models';

import useFetchInventoryMovementTypes from '../../../../hooks/inventory/fetchMovementType';
import useFetchProducts from '../../../../hooks/inventory/fetchProductHook';

interface AddInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddInventory: (inventory: Inventory) => void;
}

export const AddInventoryModal = ({
  isOpen,
  onClose,
  onAddInventory,
}: AddInventoryModalProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Inventory>({
    resolver: yupResolver(inventorySchema),
  });

  const onSubmit = (data: Inventory) => {
    console.log('Nuevo evento agregado:', data);
    onAddInventory(data);
    onClose();
  };

  const { products } = useFetchProducts();
  const { inventoryMovementTypes } = useFetchInventoryMovementTypes();

  const contributionPlanNames = products.map((product) => product.name);
  const inventoryMovementTypesName = inventoryMovementTypes.map(
    (inventoryMovementType) => inventoryMovementType.movement_Type_Name
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent sx={{ p: 'sm' }}>
        <ModalHeader color="brand.blue" textAlign="center">
          Agregar Inventario
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody textColor="text.default">
          <FormField
            id="product"
            label="Producto"
            placeholder="Seleccione el producto"
            register={register}
            errors={errors.product}
            options={contributionPlanNames}
          />
          <FormField
            id="movementType"
            label="Tipo de movimiento"
            placeholder="Seleccione el tipo de movimiento"
            register={register}
            errors={errors.product}
            options={inventoryMovementTypesName}
          />
          <FormField
            id="quantity"
            label="Cantidad"
            placeholder="Ingrese la cantidad"
            register={register}
            errors={errors.quantity}
          />
          <FormField
            id="date"
            label="Fecha"
            placeholder="Seleccione la fecha del movimiento"
            type="date"
            disableFutureDates={true}
            register={register}
            errors={errors.date}
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
