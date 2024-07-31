import { useState } from 'react';

import { Supplier } from '../../types/supplier-models';

import { CreateUpdateProviderDTO } from './updateProviderHook';
import { useAuth } from '../../contexts/auth-context';

const usePostProvider = () => {
  const [postError, setPostError] = useState<string | null>(null);
  const { token } = useAuth();

  const postProvider = async (
    providerDTO: CreateUpdateProviderDTO
  ): Promise<Supplier> => {
    setPostError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_PROVIDERS_ENDPOINT}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          mode: 'cors',
          body: JSON.stringify(providerDTO),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const createdProvider: Supplier = await response.json();
      console.log('Posted provider:', createdProvider);
      return createdProvider;
    } catch (error: any) {
      console.error('Failed to create provider:', error);
      setPostError(error.message);
      throw error;
    }
  };

  return { postProvider, postError };
};

export default usePostProvider;
