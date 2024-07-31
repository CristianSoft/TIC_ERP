import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/auth-context';

interface CareerDTO {
  career_Name: string;
}

const useFetchCareers = () => {
  const [careersData, setCareersData] = useState<string[]>([]);
  const [careersLoading, setCareersLoading] = useState(true);
  const [careersError, setCareersError] = useState<Error | null>(null);
  const endpoint = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_CAREERS_ENDPOINT}`;
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data: CareerDTO[] = await response.json();
        setCareersData(data.map((career) => career.career_Name));
        console.log(data); //impresion de los datos
      } catch (error) {
        if (error instanceof Error) {
          setCareersError(error);
        } else {
          setCareersError(new Error('An unknown error occurred'));
        }
      } finally {
        setCareersLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { careersData, careersLoading, careersError };
};

export default useFetchCareers;
