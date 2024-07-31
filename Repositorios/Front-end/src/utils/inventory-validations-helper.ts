import { endOfDay, isBefore, isEqual, parseISO, startOfDay } from 'date-fns';
import * as yup from 'yup';

export const inventorySchema = yup.object().shape({
  id: yup.number().integer().positive().optional(),
  product: yup.string().required('El producto es obligatorio'),
  movementType: yup.string().required('El tipo de movimiento es obligatorio'),
  quantity: yup
    .number()
    .integer('La cantidad debe ser un número entero')
    .positive('La cantidad debe ser un número positivo')
    .required('La cantidad es obligatoria'),
  date: yup
    .string()
    .required('La fecha es obligatoria')
    .test(
      'is-not-future-date',
      'La fecha no puede ser mayor a hoy',
      (value) => {
        if (!value) return false;
        const parsedDate = parseISO(value);
        const today = new Date();
        return (
          isBefore(parsedDate, endOfDay(today)) ||
          isEqual(parsedDate, startOfDay(today))
        );
      }
    ),
});

export const productsSchema = yup.object().shape({
  id: yup.number().integer().positive().optional(),
  name: yup.string().required('El nombre es obligatorio'),
  category: yup.string().required('La categoría es obligatoria'),
  description: yup.string().required('La descripción es obligatoria'),
  price: yup
    .number()
    .positive('El precio debe ser un número positivo')
    .required('El precio es obligatorio'),
  quantity: yup
    .number()
    .integer('La cantidad debe ser un número entero')
    .positive('La cantidad debe ser un número positivo')
    .required('La cantidad es obligatoria'),
  label: yup.string().required('La etiqueta es obligatoria'),
  provider: yup.string().required('El proveedor es obligatorio'),
});
