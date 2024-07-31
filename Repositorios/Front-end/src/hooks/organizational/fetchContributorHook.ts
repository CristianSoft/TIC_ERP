import { useEffect, useState } from 'react';

import { DEFAULT_STATE } from '../../utils/constants';
import { Subscriber } from '../../types/subscription-models';
import { formatDate } from '../../utils/format-date-helper';
import { useAuth } from '../../contexts/auth-context';

const useFetchContributors = () => {
  const [contributors, setContributors] = useState<Subscriber[]>([]);
  const [isLoadingContributors, setIsLoadingContributors] = useState(true);
  const [contributorErrors, setContributorErrors] = useState<Error | null>(
    null
  );
  const endpoint = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_CONTRIBUTORS_ENDPOINT}`;
  
  const {token} = useAuth();

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          mode: 'cors',
        });

        if (!response.ok) {
          const errorData = await response.json(); // Read the response body
          throw new Error(
            `Error: ${response.status} ${response.statusText} - ${errorData.message}`
          );
        }

        const data: Subscriber[] = await response.json();

        setContributors(data);
        console.log('Fetched contributors:', data);
      } catch (error: any) {
        if (error instanceof Error) {
          setContributorErrors(error);
        } else {
          setContributorErrors(Error('Unknown error'));
        }
      } finally {
        setIsLoadingContributors(false);
      }
    };

    fetchContributors();
  }, [endpoint]);

  const updateContributorState = (
    id: number,
    updatedData: Partial<Subscriber>
  ) => {
    setContributors((prevData) => {
      const newData = prevData.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updatedData,
              date: formatDate(updatedData.date || item.date),
            }
          : item
      );
      console.log('Updated contributors:', newData);
      return newData;
    });
  };

  const addContributionPlanState = (newContributionPlan: Subscriber) => {
    setContributors((prevData) => {
      const newData = [...prevData, newContributionPlan];
      console.log('Added new associationd:', newData, 'dsdsdsd');
      return newData;
    });
  };

  const filteredContributors = contributors.filter(
    (item) => item.state_id === DEFAULT_STATE // Adjust the filter condition as needed
  );

  return {
    contributors: filteredContributors,
    isLoadingContributors,
    contributorErrors,
    updateContributorState,
    addContributionPlanState,
  };
};

export default useFetchContributors;
