import { useState } from 'react';

import { Member } from '../../types/organizational-models';
import { useAuth } from '../../contexts/auth-context';

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
}

const usePostAdministrativeMember = () => {
  const [postAdminError, setPostError] = useState<string | null>(null);
  const {token} = useAuth();

  const postAdministrativeMember = async (
    newMember: CreateUpdateAdministrativeMemberDTO
  ) => {
    setPostError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_ADMINISTRATIVE_MEMBERS_ENDPOINT}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          mode: 'cors',
          body: JSON.stringify(newMember),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const createdMember: Member = await response.json();
      console.log('Created administrative member:', createdMember);
      return createdMember;
    } catch (error: any) {
      console.error('Failed to create administrative member:', error);
      setPostError(error.message);
      throw error;
    }
  };

  return { postAdministrativeMember, postAdminError };
};

export default usePostAdministrativeMember;
