import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthContext } from '../contexts/auth-context';
import useFetchContributionPlans from '../hooks/organizational/fetchContributionPlan';
import { SubscriptionPlansPage } from '../pages/landing/subscriptions/subscription-plans/SusbcriptionPlansPage';

// Mock hooks and context
jest.mock('../hooks/organizational/fetchContributionPlan', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    contributionPlans: [
      {
        id: 1,
        planName: 'Basic Plan',
        price: 100,
        benefits: 'Basic Benefits',
        academicPeriod: '2021-2022',
        state_id: 1,
      },
    ],
    isLoadingContributionPlans: false,
    contributionPlanErrors: null,
    updateContributionPlanState: jest.fn(),
    addContributionPlanState: jest.fn(),
  }),
}));

jest.mock('../hooks/organizational/updateContributorPlan', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      updateContributionPlan: jest.fn().mockResolvedValue({
        id: 1,
        planName: 'Basic Plan',
        price: 100,
        benefits: 'Basic Benefits',
        academicPeriod: '2021-2022',
        state_id: 1,
      }),
      updateError: null,
    };
  }),
}));

jest.mock('../hooks/organizational/patchContributionPlanHook', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      patchContributionPlanState: jest.fn().mockResolvedValue({
        id: 1,
        state: 'patched',
      }),
      patchError: null,
    };
  }),
}));

jest.mock('../hooks/organizational/createContributionPlan', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      postContributionPlan: jest.fn().mockResolvedValue({
        id: 3,
        planName: 'New Plan',
        price: 300,
        benefits: 'New Benefits',
        academicPeriod: '2022-2023',
        state_id: 1,
      }),
      postError: null,
    };
  }),
}));

jest.mock('../hooks/general/fetchAcademicPeriodHook', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        academicPeriodsData: ['2022-2023', '2023-2024', '2024-2025'],
        academicPeriodsLoading: false,
        academicPeriodsError: null,
      };
    }),
  }));
  

jest.mock('../firebase/firebase-config', () => ({
  __esModule: true,
  initializeApp: jest.fn().mockImplementation(() => {
    console.log('Firebase app initialized with config:');
  }),
  getFunctions: jest.fn().mockImplementation(() => {
    return {
      httpsCallable: jest.fn().mockImplementation(() => {
        return jest.fn().mockResolvedValue({ data: 'mocked response' });
      }),
    };
  }),
  httpsCallable: jest.fn().mockImplementation(() => {
    return jest.fn().mockResolvedValue({ data: 'mocked response' });
  }),
}));

jest.mock('firebase/app', () => ({
  __esModule: true,
  initializeApp: jest.fn().mockImplementation(() => {
    console.log('Firebase app initialized with config:');
  }),
}));

jest.mock('firebase/functions', () => ({
  __esModule: true,
  getFunctions: jest.fn().mockImplementation(() => {
    return {
      httpsCallable: jest.fn().mockImplementation(() => {
        return jest.fn().mockResolvedValue({ data: 'mocked response' });
      }),
    };
  }),
}));

jest.mock('firebase/auth', () => ({
  __esModule: true,
  getAuth: jest.fn().mockImplementation(() => {
    return {
      onAuthStateChanged: jest.fn().mockImplementation((auth, callback) => {
        callback({ uid: 'mock-uid', email: 'mock-email@example.com' });
      }),
    };
  }),
  onAuthStateChanged: jest.fn().mockImplementation((auth, callback) => {
    callback({ uid: 'mock-uid', email: 'mock-email@example.com' });
  }),
}));

jest.mock('firebase/firestore', () => ({
  __esModule: true,
  getFirestore: jest.fn().mockImplementation(() => {
    return {
      doc: jest.fn().mockImplementation(() => {
        return {
          getDoc: jest.fn().mockResolvedValue({
            data: () => ({ role: 'mock-role' }),
          }),
        };
      }),
    };
  }),
  doc: jest.fn().mockImplementation(() => {
    return {
      getDoc: jest.fn().mockResolvedValue({
        data: () => ({ role: 'mock-role' }),
      }),
    };
  }),
  getDoc: jest.fn().mockResolvedValue({
    data: () => ({ role: 'mock-role' }),
  }),
}));

describe('SubscriptionPlansPage', () => {
  beforeEach(() => {
    (useFetchContributionPlans as jest.Mock).mockImplementation(() => {
      return {
        contributionPlans: [
          {
            id: 1,
            planName: 'Basic Plan',
            price: 100,
            benefits: 'Basic Benefits',
            academicPeriod: '2021-2022',
            state_id: 1,
          },
        ],
        isLoadingContributionPlans: false,
        contributionPlanErrors: null,
        updateContributionPlanState: jest.fn(),
        addContributionPlanState: jest.fn(),
      };
    });
  });

  test('renders SubscriptionPlansPage show edit modal', async () => {
    const user = { role: 'Presidente', email: 'test@example.com', uid: 'mock-uid' };
    const token = 'mock-token';
    const loadingContext = false;

    render(
      <AuthContext.Provider value={{ user, token, loadingContext }}>
        <SubscriptionPlansPage />
      </AuthContext.Provider>
    );

    // Verify initial render
    expect(screen.getByText(/Planes de Aportación/)).toBeInTheDocument();
    expect(screen.getByText(/Una vez que añadiste los planes de aportación necesarios, ya puedes/)).toBeInTheDocument();

    // Verify table render
    expect(screen.getByText(/Basic Plan/)).toBeInTheDocument();
  });

  test('renders SubscriptionPlansPage and click to show edit modal', async () => {
    const user = { role: 'Presidente', email: 'test@example.com', uid: 'mock-uid' };
    const token = 'mock-token';
    const loadingContext = false;
    render(
      <AuthContext.Provider value={{ user, token, loadingContext }}>
        <SubscriptionPlansPage />
      </AuthContext.Provider>
    );

    // Verify initial render
    expect(screen.getByText(/Planes de Aportación/)).toBeInTheDocument();
    expect(screen.getByText(/Una vez que añadiste los planes de aportación necesarios, ya puedes/)).toBeInTheDocument();

    // Verify table render
    expect(screen.getByText(/Basic Plan/)).toBeInTheDocument();

    const editButton = screen.getByLabelText(/Edit plan/);
    // Interact with edit button
    fireEvent.click(editButton);

    // Verify modal interaction
    await waitFor(() => {
      expect(screen.getByText(/Editar Plan de Aportación/)).toBeInTheDocument();
    });
  });

  test('renders SubscriptionPlansPage and click to show add modal', async () => {
    const user = { role: 'Presidente', email: 'test@example.com', uid: 'mock-uid' };
    const token = 'mock-token';
    const loadingContext = false;
    render(
      <AuthContext.Provider value={{ user, token, loadingContext }}>
        <SubscriptionPlansPage />
      </AuthContext.Provider>
    );

    // Verify initial render
    expect(screen.getByText(/Planes de Aportación/)).toBeInTheDocument();
    expect(screen.getByText(/Una vez que añadiste los planes de aportación necesarios, ya puedes/)).toBeInTheDocument();

    // Verify table render
    expect(screen.getByText(/Basic Plan/)).toBeInTheDocument();

    const addButton = screen.getByLabelText(/Add Plan/);
    // Interact with add button
    fireEvent.click(addButton);

    // Verify modal interaction
    await waitFor(() => {
      expect(screen.getByText(/Agregar Plan de Aportación/)).toBeInTheDocument();
    });
  });
});
