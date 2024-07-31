import { useEffect, useState } from 'react';
import { Heading, Flex, Text, Image, Button } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { format, formatISO, parseISO } from 'date-fns';

import { Member, OrganizationalInfo, UpdateMember } from '../../types/organizational-models';
import useUpdateAssociation from '../../hooks/admin/updateInformationTableHook';
import usePatchAssociationState from '../../hooks/admin/patchInformationTableHook';
import useUpdateAdministrativeMember, {
  CreateUpdateAdministrativeMemberDTO,
  UpdateAdministrativeMemberDTO,
} from '../../hooks/admin/updateAdminTableHook';
import usePatchAdministrativeMemberState from '../../hooks/admin/patchAdminTableHook';
import useFetchAdministrativeMembers from '../../hooks/admin/fetchAdminTableHook';
import useFetchAssociations from '../../hooks/admin/fetchInformationTableHook';
import usePostAssociation from '../../hooks/admin/createInformationTableHook';
import usePostAdministrativeMember from '../../hooks/admin/createMemberTableHook';
import { useGenericToast } from '../../hooks/general/useGenericToast';

import { EditInformationModal } from './components/EditInformationModal';
import { InformationTable } from './components/InformationTable';
import { EditMemberModal } from './components/EditMemberModal';
import { AdminMembersTable } from './components/AdminMembersTable';
import { AddMemberModal } from './components/AddMemberModal';
import { AddInformationModal } from './components/AddInformationModal';
import { createUserWithEmailAndPassword, getAuth, signOut } from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { firebaseApp, functions, httpsCallable } from '../../firebase/firebase-config';

export const AdminHome = () => {
  const [isAddInfoModalOpen, setAddInfoModalOpen] = useState(false);
  const [isEditInfoModalOpen, setIsEditInfoModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedInfo, setSelectedInfo] = useState<OrganizationalInfo | null>(
    null
  );

  const {
    administrativeMembers,
    isLoadingAdministrativeMembers,
    administrativeMemberErrors,
    updateAdministrativeMemberState,
    addAdminMemberState,
  } = useFetchAdministrativeMembers();

  const {
    associations,
    isLoadingAssociations,
    associationErrors,
    updateAssociationState,
    addAssociationState,
  } = useFetchAssociations();

  const { postAssociation } = usePostAssociation();
  const { postAdministrativeMember } = usePostAdministrativeMember();
  const { updateAssociation } = useUpdateAssociation();
  const { patchAssociationState } = usePatchAssociationState();
  const { patchAdministrativeMemberState } =
    usePatchAdministrativeMemberState();
  const { updateAdministrativeMember } = useUpdateAdministrativeMember();

  const showToast = useGenericToast();
 
  const registerUser = async (username:string, password:string, role:string) => {
    const registerUserFunction = httpsCallable(functions, 'registerUser');
    try {
      const result = await registerUserFunction({ email: username, password: password, role: role });
      console.log('User registered:', result.data);
      return result.data;
    } catch (error) {
      if(error instanceof Error) {
      console.error('Error registrando el usuario:', error);
      showToast({
        title: 'Error al registrar el usuario',
        description: error.message,
        status: 'error',
      });
    }}
  };
  

  const handleAddMember = async (createdMember: Member) => {
    try {
      const formattedDate = formatISO(new Date(createdMember.birthDate));
      const newAdmin: CreateUpdateAdministrativeMemberDTO = {
        firstName: createdMember.firstName,
        lastName: createdMember.lastName,
        birthDate: formattedDate,
        cellphone: createdMember.cellphone,
        faculty: createdMember.faculty,
        career: createdMember.career,
        semester: createdMember.semester,
        email: createdMember.email,
        position: createdMember.position,
        password: createdMember.password,
      };

      const { password, ...restOfInfo } = newAdmin;
      

      const registeredUser = await registerUser(
        newAdmin.email,
        newAdmin.password,
        newAdmin.position
      );
      if (!registeredUser) {
        throw new Error('Error en el registro del usuario');
      }
      const newAdminMember = await postAdministrativeMember(restOfInfo);
      addAdminMemberState(newAdminMember);
      showToast({
        title: 'Éxito',
        description: 'Miembro añadido correctamente',
        status: 'success',
      });
      setIsAddMemberModalOpen(false); // Cierra el modal después de agregar
    } catch (error) {
      console.error('Fallo al añadir un miembro:', error);
      showToast({
        title: 'Error',
        description: 'No se pudo añadir el miembro',
        status: 'error',
      });
    }
  };

  const handleAddInfo = async (newInformation: OrganizationalInfo) => {
    try {
      const newInfo = {
        mission: newInformation.mission,
        vision: newInformation.vision,
      };
      const newInformatiom = await postAssociation(newInfo);

      addAssociationState(newInformatiom);
      showToast({
        title: 'Éxito',
        description: 'Información añadida correctamente',
        status: 'success',
      });
      setAddInfoModalOpen(false);
    } catch (error) {
      showToast({
        title: 'Error',
        description: 'No se pudo añadir la información',
        status: 'error',
      });
    }
  };

  useEffect(() => {
    console.log('AssociationsComponent re-rendered', associations);
  });
  const handleEditMember = async (data: { member: UpdateMember }) => {
    const formattedDate = formatISO(new Date(data.member.birthDate));
    try {
      const updatedInfo: UpdateAdministrativeMemberDTO = {
        firstName: data.member.firstName,
        lastName: data.member.lastName,
        birthDate: formattedDate,
        cellphone: data.member.cellphone,
        faculty: data.member.faculty,
        career: data.member.career,
        semester: data.member.semester,
        email: data.member.email,
        position: data.member.position,
      };


      await updateAdministrativeMember(data.member.id!,updatedInfo);

      const originalFormattedDate = format(
        parseISO(data.member.birthDate),
        'dd/MM/yyyy'
      );

      updateAdministrativeMemberState(data.member.id!, {
        ...data.member,
        ...updatedInfo,
        birthDate: originalFormattedDate,
      });

      showToast({
        title: 'Éxito',
        description: 'Miembro administrativo actualizado correctamente',
        status: 'success',
      });
    } catch (error) {
      showToast({
        title: 'Error',
        description: 'No se pudo actualizar al miembro administrativo',
        status: 'error',
      });
    }
  };

  const handleDeleteMember = async (id: number | undefined) => {
    try {
      await patchAdministrativeMemberState(id!);
      updateAdministrativeMemberState(id!, { state_id: 2 });
      showToast({
        title: 'Éxito',
        description: 'Miembro administrativo eliminado correctamente',
        status: 'success',
      });
    } catch (error) {
      showToast({
        title: 'Error',
        description: 'No se pudo eliminar al miembro administrativo',
        status: 'error',
      });
    }
  };

  const openMemberEditModal = (member: Member) => {
    setSelectedMember(member);
    setIsEditMemberModalOpen(true);
  };

  const openInfoEditModal = (info: OrganizationalInfo) => {
    setSelectedInfo(info);
    setIsEditInfoModalOpen(true);
  };

  const handleEditInformation = async (data: { info: OrganizationalInfo }) => {
    try {
      const updatedInfo = {
        mission: data.info.mission,
        vision: data.info.vision,
      };
      await updateAssociation(data.info.id!, updatedInfo);

      updateAssociationState(data.info.id!, { ...data.info, ...updatedInfo });
      showToast({
        title: 'Éxito',
        description: 'Información organizacional actualizada correctamente',
        status: 'success',
      });
    } catch (error) {
      showToast({
        title: 'Error',
        description: 'No se pudo actualizar la información organizacional.',
        status: 'error',
      });
    }
  };

  const handleDeleteInfo = async (id: number | undefined) => {
    try {
      await patchAssociationState(id!);
      updateAssociationState(id!, { state_id: 2 });
      showToast({
        title: 'Éxito',
        description: 'Información organizacional eliminada correctamente',
        status: 'success',
      });
    } catch (error) {
      showToast({
        title: 'Error',
        description: 'No se pudo eliminar la información organizacional.',
        status: 'error',
      });
    }
  };

  return (
    <Flex
      flex="1"
      sx={{ px: { base: 'md', lg: '3xl' }, flexDirection: 'column' }}
    >
      <Flex sx={{ flexDirection: 'column', gap: '3xl' }}>
        <Heading>Sistema Cloud ERP de FEPON</Heading>
        <Flex
          sx={{
            flexDirection: { base: 'column', lg: 'row' },
            gap: '3xl',
            width: '100%',
          }}
        >
          <Flex
            sx={{
              justifyContent: 'center',
              width: { sm: '100%', lg: '47%' },
            }}
          >
            <Image
              src="/img/logo.png"
              alt="ERP Fepon"
              sx={{
                width: { sm: 'lg', lg: 'auto' },
              }}
            />
          </Flex>
          <Flex
            sx={{
              width: { base: '100%', lg: '51.5%' },
            }}
          >
            <Flex
              sx={{
                flexDirection: 'column',
                pl: { base: 'none', lg: '3xl' },
                gap: 'lg',
                borderLeft: { sm: 'none', lg: '1px solid' },
                borderColor: { sm: 'none', lg: 'surface.default' },
              }}
            >
              <Heading
                sx={{
                  fontSize: 'heading.desktop.subtitle',
                }}
              >
                Federación de Estudiantes de la Escuela Politécnica Nacional
              </Heading>
              <Text sx={{ textColor: 'text.default', textAlign: 'justify' }}>
                ¡Bienvenidos al Sistema Cloud ERP de la FEPON! Para comenzar, no
                olvides añadir a tu equipo de trabajo y la información
                organizacional de la nueva federación.
              </Text>
              <Text sx={{ textColor: 'text.default' }}>
                Para ingresar un nuevo miembro administrativo, la misión, visión
                y objetivo de FEPON, da clic en los siguientes botones.
              </Text>
              <Flex sx={{ gap: 'sm' }}>
                <Button
                aria-label='Add Information'
                  leftIcon={<AddIcon />}
                  onClick={() => setAddInfoModalOpen(true)}
                >
                  Información
                </Button>
                <Button
                  aria-label='Add Member'
                  leftIcon={<AddIcon />}
                  onClick={() => setIsAddMemberModalOpen(true)}
                >
                  Miembro
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        <Flex sx={{ flexDirection: 'column', gap: 'xl', pb: 'xl' }}>
          <Heading sx={{ fontSize: 'heading.desktop.subtitle' }}>
            Información Organizacional
          </Heading>
          <Flex
            sx={{
              flexWrap: 'wrap',
              flexDirection: { base: 'column', md: 'row' },
              gap: 'md',
            }}
          >
            <InformationTable
              info={associations}
              isLoading={isLoadingAssociations}
              error={associationErrors}
              onEdit={openInfoEditModal}
              onDelete={handleDeleteInfo}
            />
          </Flex>
        </Flex>
      </Flex>

      <Flex sx={{ flexDirection: 'column', gap: 'xl', pb: 'xl' }}>
        <Heading sx={{ fontSize: 'heading.desktop.subtitle' }}>
          Miembros Administrativos
        </Heading>
        <Flex
          sx={{
            flexWrap: 'wrap',
            flexDirection: { sm: 'column', md: 'row' },
            gap: 'md',
          }}
        >
          <AdminMembersTable
            members={administrativeMembers}
            isLoading={isLoadingAdministrativeMembers}
            error={administrativeMemberErrors}
            onEdit={openMemberEditModal}
            onDelete={handleDeleteMember}
          />
        </Flex>
      </Flex>
      <AddInformationModal
        isOpen={isAddInfoModalOpen}
        onClose={() => setAddInfoModalOpen(false)}
        onAddMember={handleAddInfo}
      />
      <EditInformationModal
        isOpen={isEditInfoModalOpen}
        onClose={() => setIsEditInfoModalOpen(false)}
        info={selectedInfo}
        onSubmit={handleEditInformation}
      />
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        onAddMember={handleAddMember}
      />
      <EditMemberModal
        isOpen={isEditMemberModalOpen}
        onClose={() => setIsEditMemberModalOpen(false)}
        member={selectedMember}
        onSubmit={handleEditMember}
      />
    </Flex>
  );
};
