import { useState } from 'react';

import { OrganizationalInfo } from '../../types/organizational-models';
import { useAuth } from '../../contexts/auth-context';

export interface CreateUpdateAssociationDTO {
  mission: string;
  vision: string;
}

const usePostAssociation = () => {
  const [postError, setPostError] = useState<string | null>(null);
  const { token } = useAuth();

  const postAssociation = async (
    newAssociation: CreateUpdateAssociationDTO
  ) => {
    setPostError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_ASSOCIATIONS_ENDPOINT}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            
          },
          mode: 'cors',
          body: JSON.stringify(newAssociation),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const createdAssociation: OrganizationalInfo = await response.json();
      console.log('dentro del estado', createdAssociation);
      return createdAssociation;
    } catch (error: any) {
      console.error('Failed to create association:', error);
      setPostError(error.message);
      throw error;
    }
  };

  return { postAssociation, postError };
};

export default usePostAssociation;
