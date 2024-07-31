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
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

import { RegisterUser } from '../../../types/organizational-models';
import { registerUserSchema } from '../../../utils/admin-validations-helper';
import { FormField } from '../../../components/FormField';
import {
  firebaseApp,
  functions,
  httpsCallable,
} from '../../../firebase/firebase-config';
import useFetchRoles from '../../../hooks/general/fetchRolesHook';
import { useGenericToast } from '../../../hooks/general/useGenericToast';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

export const RegisterModal = ({ isOpen, onClose }: RegisterModalProps) => {
  const { roles } = useFetchRoles();
  const showToast = useGenericToast();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RegisterUser>({
    resolver: yupResolver(registerUserSchema),
  });

  const addRoleClaim = async (email: string, role: string) => {
    try {
      const addUserRole = httpsCallable(functions, 'addUserRole');
      const result = await addUserRole({ email, role });
      console.log('llamadaaa a añadir claiiiiiimmmm');
      console.log(result);
    } catch (error) {
      if (error instanceof Error)
        showToast({
          title: 'Error al añadir usuario',
          description: error.message,
          status: 'error',
        });
    }
  };

  const registerUser = async (
    username: string,
    password: string,
    role: string
  ) => {
    try {
      const userData = await createUserWithEmailAndPassword(
        auth,
        username,
        password
      );
      console.log(userData);
      const documentReference = doc(firestore, `usuarios/${userData.user.uid}`);
      await setDoc(documentReference, {
        email: username,
        role: role,
      });

      await addRoleClaim(username, role);
      await signOut(auth);
      console.log('User signed out');
      return userData;
    } catch (error) {
      if (error instanceof Error) {
        showToast({
          title: 'Error al registrar el usuario',
          description: error.message,
          status: 'error',
        });
      }
    }
  };

  const onSubmit = async (data: RegisterUser) => {
    try {
      const userData = await registerUser(
        data.email,
        data.password,
        data.position
      );
      showToast({
        title: 'Registro exitoso',
        description: 'Su información se registró con éxito.',
        status: 'success',
      });
    } catch (error) {
      console.log(error);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent sx={{ p: 'lg' }}>
        <ModalHeader sx={{ color: 'brand.blue', textAlign: 'center' }}>
          Registrar un nuevo usuario
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody sx={{ textColor: 'text.default' }}>
          <FormField
            id="email"
            label="Correo Institucional"
            placeholder="Ingrese el correo institucional"
            type="email"
            register={register}
            errors={errors.email}
          />
          <FormField
            id="position"
            label="Rol"
            placeholder="Seleccione el rol"
            register={register}
            errors={errors.position}
            options={roles}
          />
          <FormField
            id="password"
            label="Contraseña"
            placeholder="Ingrese una contraseña"
            register={register}
            errors={errors.password}
            type="password"
            showPasswordToggle={true}
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
