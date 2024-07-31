import { useState } from 'react';

import { Product } from '../../types/inventory-models';

import { CreateUpdateProductDTO } from './updateProductHook';
import { useAuth } from '../../contexts/auth-context';

const usePostProduct = () => {
  const [postError, setPostError] = useState<string | null>(null);
  const { token } = useAuth();

  const postProduct = async (
    productDTO: CreateUpdateProductDTO
  ): Promise<Product> => {
    setPostError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_PRODUCTS_ENDPOINT}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          mode: 'cors',
          body: JSON.stringify(productDTO),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const createdProduct: Product = await response.json();
      console.log('Posted product:', createdProduct);
      return createdProduct;
    } catch (error: any) {
      console.error('Failed to create product:', error);
      setPostError(error.message);
      throw error;
    }
  };

  return { postProduct, postError };
};

export default usePostProduct;
