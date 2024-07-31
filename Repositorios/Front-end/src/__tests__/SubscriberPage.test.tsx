import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthContext } from '../contexts/auth-context';
import { SubscribersPage } from '../pages/landing/subscriptions/subscribers/SusbcribersPage';
import useFetchContributors from '../hooks/organizational/fetchContributorHook';


// Mock hooks and context

// Mock hooks and context
jest.mock('../hooks/organizational/fetchContributorHook', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
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
  }),
}));
//jest.mock('../hooks/organizational/fetchContributorHook');
jest.mock('../hooks/organizational/updateContributor', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      updateContributor: jest.fn().mockResolvedValue({
        id: 1,
        date: '2023-07-18',
        name: 'John Doe',
        faculty: 'Engineering',
        career: 'Computer Science',
        email: 'john.doe@example.com',
        plan: 'Basic',
        price: 200,
        academicPeriod: '2023-2024',
      }),
      updateError: null,
    };
  }),
}));

jest.mock('../hooks/organizational/patchContributorHook', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      patchContributorState: jest.fn().mockResolvedValue({
        id: 1,
        state: 'patched',
      }),
      patchError: null,
    };
  }),
}));
jest.mock('../hooks/organizational/createContributorHook', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      postContributor: jest.fn().mockResolvedValue({
        id: 1,
        date: '2023-07-18',
        name: 'John Doe',
        faculty: 'Engineering',
        career: 'Computer Science',
        email: 'john.doe@example.com',
        plan: 'Basic',
        price: 200,
        academicPeriod: '2023-2024',
      }),
      postError: null,
    };
  }),
}));

jest.mock('../hooks/general/fetchFacultyHook', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      facultiesData: ['Engineering', 'Science', 'Arts'],
      facultiesLoading: false,
      facultiesError: null,
    };
  }),
}));

jest.mock('../hooks/general/FetchCareerHook', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      careersData: ['Computer Science', 'Mechanical Engineering', 'Electrical Engineering'],
      careersLoading: false,
      careersError: null,
    };
  }),
}));

jest.mock('../hooks/organizational/fetchContributionPlan', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      contributionPlans: [
        {
          id: 1,
          planName: 'Basic Plan',
          description: 'This is a basic plan.',
          state_id: 1,
        },
        {
          id: 2,
          planName: 'Premium Plan',
          description: 'This is a premium plan.',
          state_id: 1,
        },
      ],
      isLoadingContributionPlans: false,
      contributionPlanErrors: null,
      updateContributionPlanState: jest.fn(),
      addContributionPlanState: jest.fn(),
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


// jest.mock('../hooks/organizational/patchContributorHook');
// jest.mock('../hooks/organizational/createContributorHook');
// jest.mock('../hooks/general/useGenericToast');

describe('SubscribersPage', () => {
  beforeEach(() => {
    (useFetchContributors as jest.Mock).mockImplementation(() => {
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
      };
    });
  });

  test('renders SubscribersPage show edit modal', async () => {
    const user = { role: 'Presidente', email: 'john.doe@example.com', uid: 'mock-uid'};
    const token = 'mock-token';
    const loadingContext = false
    render(

      <AuthContext.Provider value={{ user, token, loadingContext }}>
      <SubscribersPage />
    </AuthContext.Provider>

        
    );

    // Verify initial render
    expect(screen.getByText(/Aportantes/)).toBeInTheDocument();
    expect(screen.getByText(/Antes de añadir un aportante, asegúrate de que los planes de suscripción ya se encuentren registrados./)).toBeInTheDocument();

    // Verify table render
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();

  });


  test('renders SubscribersPage and click to show edit modal', async () => {
    const user = { role: 'Presidente', email: 'john.doe@example.com', uid: 'mock-uid'};
    const token = 'mock-token';
    const loadingContext = false
    render(

      <AuthContext.Provider value={{ user, token, loadingContext }}>
      <SubscribersPage />
    </AuthContext.Provider>

        
    );

    // Verify initial render
    expect(screen.getByText(/Aportantes/)).toBeInTheDocument();
    expect(screen.getByText(/Antes de añadir un aportante, asegúrate de que los planes de suscripción ya se encuentren registrados./)).toBeInTheDocument();

    // Verify table render
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();


    const editButton = screen.getByLabelText(/Edit Event/);
    // Interact with edit button
  fireEvent.click(editButton);

  // Verify modal interaction
  await waitFor(() => {
    expect(screen.getByText(/Editar Aportante/)).toBeInTheDocument();
  });
 // Find and click the delete button
 const addButton = screen.getByLabelText(/addSubscriber/);
 fireEvent.click(addButton);

 // Verify modal interaction
 await waitFor(() => {
  expect(screen.getByText(/Agregar Aportante/)).toBeInTheDocument();
});

  });


  test('renders SubscribersPage and click to show add modal', async () => {
    const user = { role: 'Presidente', email: 'john.doe@example.com', uid: 'mock-uid'};
    const token = 'mock-token';
    const loadingContext = false
    render(

      <AuthContext.Provider value={{ user, token, loadingContext }}>
      <SubscribersPage />
    </AuthContext.Provider>

        
    );

    // Verify initial render
    expect(screen.getByText(/Aportantes/)).toBeInTheDocument();
    expect(screen.getByText(/Antes de añadir un aportante, asegúrate de que los planes de suscripción ya se encuentren registrados./)).toBeInTheDocument();

    // Verify table render
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();


 // Find and click the delete button
 const addButton = screen.getByLabelText(/addSubscriber/);
 fireEvent.click(addButton);

 // Verify modal interaction
 await waitFor(() => {
  expect(screen.getByText(/Agregar Aportante/)).toBeInTheDocument();
});

  });
});
