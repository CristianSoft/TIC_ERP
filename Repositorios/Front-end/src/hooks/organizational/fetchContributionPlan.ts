import { useEffect, useState } from 'react';

import { SubscriptionPlan } from '../../types/subscription-models';
import { DEFAULT_STATE } from '../../utils/constants';
import { useAuth } from '../../contexts/auth-context';

const useFetchContributionPlans = () => {
  const [contributionPlans, setContributionPlans] = useState<
    SubscriptionPlan[]
  >([]);
  const [isLoadingContributionPlans, setIsLoadingContributionPlans] =
    useState(true);
  const [contributionPlanErrors, setContributionPlanErrors] =
    useState<Error | null>(null);
  const endpoint = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_CONTRIBUTION_PLANS_ENDPOINT}`;
  const {token} = useAuth();

  useEffect(() => {
    const fetchContributionPlans = async () => {
      try {
        const response = await fetch(endpoint,{
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

        const data: SubscriptionPlan[] = await response.json();
        setContributionPlans(data);
        console.log('Fetched contribution plans:', data);
      } catch (error: any) {
        if (error instanceof Error) {
          setContributionPlanErrors(error);
        } else {
          setContributionPlanErrors(Error('Unknown error'));
        }
      } finally {
        setIsLoadingContributionPlans(false);
      }
    };

    fetchContributionPlans();
  }, [endpoint]);

  const updateContributionPlanState = (
    id: number,
    updatedData: Partial<SubscriptionPlan>
  ) => {
    setContributionPlans((prevData) => {
      const newData = prevData.map((item) =>
        item.id === id ? { ...item, ...updatedData } : item
      );
      console.log('Updated contribution plans:', newData);
      return newData;
    });
  };

  const addContributionPlanState = (newContributionPlan: SubscriptionPlan) => {
    setContributionPlans((prevData) => {
      const newData = [...prevData, newContributionPlan];
      console.log('Added new associationd:', newData, 'dsdsdsd');
      return newData;
    });
  };

  const filteredContributionPlans = contributionPlans.filter(
    (item) => item.state_id === DEFAULT_STATE // Adjust the filter condition as needed
  );

  return {
    contributionPlans: filteredContributionPlans,
    isLoadingContributionPlans,
    contributionPlanErrors,
    updateContributionPlanState,
    addContributionPlanState,
  };
};

export default useFetchContributionPlans;
