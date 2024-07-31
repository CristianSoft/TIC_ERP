const mockUseFetchContributors = jest.fn().mockImplementation(
  () => {
    
    return {
      contributors: [
        {
          id: 1,
          date: '2023-07-18',
          name: 'John Doe',
          faculty: 'Engineering',
          career: 'Computer Science',
          email: 'john.doe@example.com',
          plan: 'Basic',
          price: 100,
          academicPeriod: '2023-2024',
        },
      ],
      isLoadingContributors: false,
      contributorErrors: null,
      updateContributorState: jest.fn(),
      addContributionPlanState: jest.fn(),
    }
  }
);
  
export default mockUseFetchContributors;
  