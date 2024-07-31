import * as yup from 'yup';

export const suppliersSchema = yup.object().shape({
  id: yup.number().integer().positive().optional(),
  name: yup.string().required('El nombre es obligatorio'),
  phone: yup
    .string()
    .required('El teléfono es obligatorio')
    .matches(/^\d+$/, 'El teléfono solo puede contener números'),
  email: yup
    .string()
    .email('El correo no es válido')
    .required('El correo es obligatorio'),
});

export interface Supplier {
  id?: number;
  stateid?: number;
  name: string;
  phone: string;
  email: string;
}
