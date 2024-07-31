import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/auth-context';
export interface FinantialRequestDTO {
  id?: number;
  eventName: string;
  requestStatusName: string; //EN REVISION, APROBADO, RECHAZADO
  reason: string;
  value: number;
}

export const useFetchFinantialRequests = () => {
  const [finantialRequests, setFinantialRequests] = useState<
    FinantialRequestDTO[]
  >([]);
  const [isLoadingFinantialRequests, setIsLoadingFinantialRequests] =
    useState(true);
  const [finantialRequestErrors, setFinantialRequestErrors] =
    useState<Error | null>(null);
  const endpoint = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_FINANTIAL_REQUESTS_ENDPOINT}`;
  const { token } = useAuth();

  useEffect(() => {
    const fetchFinantialRequests = async () => {
      try {
        const response = await fetch(endpoint,  {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          mode: 'cors',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Error: ${response.status} ${response.statusText} - ${errorData.message}`
          );
        }

        const data: FinantialRequestDTO[] = await response.json();
        setFinantialRequests(data);
        console.log('Fetched finantial requests:', data);
      } catch (error: any) {
        if (error instanceof Error) {
          setFinantialRequestErrors(error);
        } else {
          setFinantialRequestErrors(Error('Unknown error'));
        }
      } finally {
        setIsLoadingFinantialRequests(false);
      }
    };

    fetchFinantialRequests();
  }, [endpoint]);

  const updateFinantialRequestState = (
    id: number,
    updatedData: Partial<FinantialRequestDTO>
  ) => {
    setFinantialRequests((prevData) => {
      const newData = prevData.map((item) =>
        item.id === id ? { ...item, ...updatedData } : item
      );
      console.log('Updated finantial requests:', newData);
      return newData;
    });
  };

  return {
    finantialRequests,
    isLoadingFinantialRequests,
    finantialRequestErrors,
    updateFinantialRequestState,
  };
};

export default useFetchFinantialRequests;
