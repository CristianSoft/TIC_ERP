import React, { useEffect } from 'react';
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
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { Member, UpdateMember } from '../../../types/organizational-models';
import { FormField } from '../../../components/FormField';
import { memberSchema, updateMemberSchema } from '../../../utils/admin-validations-helper';
import useFetchRoles from '../../../hooks/general/fetchRolesHook';
import useFetchSemesters from '../../../hooks/general/fetchSemestersHook';
import useFetchCareers from '../../../hooks/general/FetchCareerHook';
import useFetchFaculties from '../../../hooks/general/fetchFacultyHook';

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: UpdateMember | null;
  onSubmit: (data: { member: UpdateMember }) => void;
}

export const EditMemberModal: React.FC<EditMemberModalProps> = ({
  isOpen,
  onClose,
  member,
  onSubmit,
}) => {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<UpdateMember>({
    resolver: yupResolver(updateMemberSchema),
  });

  useEffect(() => {
    if (member) {
      Object.keys(member).forEach((key) => {
        setValue(key as keyof UpdateMember, member[key as keyof UpdateMember]);
      });
    }
  }, [member, setValue]);

  const onSubmitForm = (data: UpdateMember) => {
    onSubmit({ member: data });
    onClose();
  };

  const { roles } = useFetchRoles();
  const { semesters } = useFetchSemesters();

  const { careersData } = useFetchCareers();
  const { facultiesData } = useFetchFaculties();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p="4">
        <ModalHeader color="brand.blue" textAlign="center">
          Editar Miembro Administrativo
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody textColor="text.default">
          <FormField
            id="firstName"
            label="Nombres"
            placeholder="Ingrese los nombres"
            register={register}
            errors={errors.firstName}
          />
          <FormField
            id="lastName"
            label="Apellidos"
            placeholder="Ingrese los apellidos"
            register={register}
            errors={errors.lastName}
          />
          <FormField
            id="birthDate"
            label="Fecha de Nacimiento"
            placeholder="Seleccione la fecha de nacimiento"
            type="date"
            register={register}
            errors={errors.birthDate}
          />
          <FormField
            id="cellphone"
            label="Número de Celular"
            placeholder="Ingrese el número de celular"
            register={register}
            errors={errors.cellphone}
          />
          <FormField
            id="faculty"
            label="Facultad"
            placeholder="Seleccione la facultad"
            register={register}
            errors={errors.faculty}
            options={facultiesData}
          />
          <FormField
            id="career"
            label="Carrera"
            placeholder="Seleccione la carrera"
            register={register}
            errors={errors.career}
            options={careersData}
          />
          <FormField
            id="semester"
            label="Semestre"
            placeholder="Seleccione el semestre"
            register={register}
            errors={errors.semester}
            options={semesters}
          />
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
          <ModalFooter>
            <Button type="submit" onClick={handleSubmit(onSubmitForm)}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
