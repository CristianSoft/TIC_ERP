import { useState } from 'react';

import { SubscriptionPlan } from '../../types/subscription-models';

import { CreateUpdateContributionPlanDTO } from './updateContributorPlan';
import { useAuth } from '../../contexts/auth-context';

const usePostContributionPlan = () => {
  const [postError, setPostError] = useState<string | null>(null);
  const {token} = useAuth();

  const postContributionPlan = async (
    newContributionPlan: CreateUpdateContributionPlanDTO
  ) => {
    setPostError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_CONTRIBUTION_PLANS_ENDPOINT}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          mode: 'cors',
          body: JSON.stringify(newContributionPlan),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const createdContributionPlan: SubscriptionPlan = await response.json();
      console.log('Created contribution plan:', createdContributionPlan);
      return createdContributionPlan;
    } catch (error: any) {
      console.error('Failed to create contribution plan:', error);
      setPostError(error.message);
      throw error;
    }
  };

  return { postContributionPlan, postError };
};

export default usePostContributionPlan;
