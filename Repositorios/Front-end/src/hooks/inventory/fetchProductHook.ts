import { useEffect, useState } from 'react';

import { Product } from '../../types/inventory-models';
import { DEFAULT_STATE } from '../../utils/constants';
import { useAuth } from '../../contexts/auth-context';

const useFetchProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productErrors, setProductErrors] = useState<Error | null>(null);
  const endpoint = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_PRODUCTS_ENDPOINT}`;
  const { token } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(endpoint,  {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          mode: 'cors',
        });

        if (!response.ok) {
          const errorData = await response.json(); // Read the response body
          throw new Error(
            `Error: ${response.status} ${response.statusText} - ${errorData.message}`
          );
        }

        const data: Product[] = await response.json();
        setProducts(data);
        console.log('Fetched products:', data);
      } catch (error: any) {
        if (error instanceof Error) {
          setProductErrors(error);
        } else {
          setProductErrors(Error('Unknown error'));
        }
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [endpoint]);

  const updateProductState = (id: number, updatedData: Partial<Product>) => {
    setProducts((prevData) => {
      const newData = prevData.map((item) =>
        item.id === id ? { ...item, ...updatedData } : item
      );
      console.log('Updated products:', newData);
      return newData;
    });
  };

  const addProductState = (newContributionPlan: Product) => {
    setProducts((prevData) => {
      const newData = [...prevData, newContributionPlan];
      console.log('Added new associationd:', newData, 'dsdsdsd');
      return newData;
    });
  };

  const filteredProducts = products.filter(
    (item) => item.stateid === DEFAULT_STATE // Adjust the filter condition as needed
  );

  return {
    products: filteredProducts,
    isLoadingProducts,
    productErrors,
    updateProductState,
    addProductState,
  };
};

export default useFetchProducts;