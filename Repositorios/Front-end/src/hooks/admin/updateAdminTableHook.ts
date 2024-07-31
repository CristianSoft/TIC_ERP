import { useState } from 'react';
import { useAuth } from '../../contexts/auth-context';
import { functions, httpsCallable } from '../../firebase/firebase-config';
import { useGenericToast } from '../general/useGenericToast';


export interface CreateUpdateAdministrativeMemberDTO {
  firstName: string;
  lastName: string;
  birthDate: string;
  cellphone: string;
  faculty: string;
  career: string;
  semester: string;
  email: string;
  position: string;
  password: string;
}

export interface UpdateAdministrativeMemberDTO {
  firstName: string;
  lastName: string;
  birthDate: string;
  cellphone: string;
  faculty: string;
  career: string;
  semester: string;
  email: string;
  position: string;
}

const updateFirebaseMember = async (email: string, position: string) => {
  try {
    const 	
    updateFirebaseMember = httpsCallable(functions, 'updateAdministrativeMemberRole');
    const result = await 	
    updateFirebaseMember({ email, position });
    console.log('llamada a añadir claim actualizar');
    console.log(result);
  } catch (error) {
    if (error instanceof Error)
      throw error;
  }
 
}


const useUpdateAdministrativeMember = () => {
  const [updateAdministrativeMemberError, setUpdateError] = useState<
    string | null
  >(null);

  const { token } = useAuth();
  const updateAdministrativeMember = async (
    id: number,
    updatedAdministrativeMember: UpdateAdministrativeMemberDTO
  ) => {
    setUpdateError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_ADMINISTRATIVE_MEMBERS_ENDPOINT}/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          mode: 'cors',
          body: JSON.stringify(updatedAdministrativeMember),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      if (response.status === 204) {
        console.log('Miembro administrativo actualizado correctamente');
        await updateFirebaseMember(updatedAdministrativeMember.email, updatedAdministrativeMember.position);
        return;
      }

      return await response.json();
    } catch (error: any) {
      console.error('Failed to update administrative member:', error);
      setUpdateError(error.message);
      throw error;
    }
  };

  return { updateAdministrativeMember, updateAdministrativeMemberError };
};

export default useUpdateAdministrativeMember;
