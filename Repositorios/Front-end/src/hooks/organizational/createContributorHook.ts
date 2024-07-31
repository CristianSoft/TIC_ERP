import { useState } from 'react';

import { Subscriber } from '../../types/subscription-models';

import { CreateUpdateContributorDTO } from './updateContributor';
import { useAuth } from '../../contexts/auth-context';

const usePostContributor = () => {
  const [postError, setPostError] = useState<string | null>(null);
  const {token} = useAuth();

  const postContributor = async (
    newContributor: CreateUpdateContributorDTO
  ) => {
    setPostError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_CONTRIBUTORS_ENDPOINT}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          mode: 'cors',
          body: JSON.stringify(newContributor),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const createdContributor: Subscriber = await response.json();
      console.log('Created contributor:', createdContributor);
      return createdContributor;
    } catch (error: any) {
      console.error('Failed to create contributor:', error);
      setPostError(error.message);
      throw error;
    }
  };

  return { postContributor, postError };
};

export default usePostContributor;
