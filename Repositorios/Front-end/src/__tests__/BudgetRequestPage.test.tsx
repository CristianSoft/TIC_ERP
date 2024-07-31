import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthContext } from '../contexts/auth-context';
import { BudgetRequestPage } from '../pages/landing/events/budget-request/BudgetRequestPage';


// Mock hooks and context
jest.mock('../hooks/Events/fetchFinantialRequestHook', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    finantialRequests: [
      {
        id: 1,
        eventName: 'Event A',
        reason: 'Reason A',
        requestStatusName: 'Pending',
        value: 1000,
      },
    ],
    isLoadingFinantialRequests: false,
    finantialRequestErrors: null,
    updateFinantialRequestState: jest.fn(),
  }),
}));

jest.mock('../hooks/Events/updateFinancialRequestHook', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      updateFinantialRequest: jest.fn().mockResolvedValue({
        id: 1,
        eventName: 'Event A',
        reason: 'Reason A',
        requestStatusName: 'Pending',
        value: 1000,
      }),
      updateError: null,
    };
  }),
}));

jest.mock('../hooks/Events/patchEventoHook', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      patchEventState: jest.fn().mockResolvedValue({
        id: 1,
        state: 'patched',
      }),
      patchError: null,
    };
  }),
}));

jest.mock('../hooks/Events/createEventHook', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      postEvent: jest.fn().mockResolvedValue({
        id: 2,
        eventName: 'Event B',
        reason: 'Reason B',
        requestStatusName: 'Approved',
        value: 2000,
      }),
      postError: null,
    };
  }),
}));

jest.mock('../hooks/Events/fetchFinancialRequestStateHook', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      financialStatesData: ['Pending', 'Approved', 'Rejected'],
      isLoading: false,
      error: null,
    };
  }),
}));

jest.mock('../hooks/Events/fetchEventNamesHook', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      eventNames: ['Event A', 'Event B'],
      isLoading: false,
      error: null,
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

describe('BudgetRequestPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  test('renders BudgetRequestPage and shows edit modal', async () => {
    const user = { role: 'Presidente', email: 'user@example.com', uid: 'mock-uid' };
    const token = 'mock-token';
    const loadingContext = false;

    render(
      <AuthContext.Provider value={{ user, token, loadingContext }}>
        <BudgetRequestPage />
      </AuthContext.Provider>
    );

    // Verify initial render
    expect(screen.getByText(/Solicitud de Presupuesto/)).toBeInTheDocument();
    expect(screen.getByText(/Antes de añadir una solicitud de presupesto/)).toBeInTheDocument();
    expect(screen.getByText(/Event A/)).toBeInTheDocument();

    const editButton = screen.getByLabelText('Edit Budget Request');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByText(/Editar Solicitud de Presupuesto/)).toBeInTheDocument();
    });
  });

  test('renders BudgetRequestPage and shows delete confirmation modal', async () => {
    const user = { role: 'Presidente', email: 'user@example.com', uid: 'mock-uid' };
    const token = 'mock-token';
    const loadingContext = false;

    render(
      <AuthContext.Provider value={{ user, token, loadingContext }}>
        <BudgetRequestPage />
      </AuthContext.Provider>
    );

    // Verify initial render
    expect(screen.getByText(/Solicitud de Presupuesto/)).toBeInTheDocument();
    expect(screen.getByText(/Antes de añadir una solicitud de presupesto/)).toBeInTheDocument();
    expect(screen.getByText(/Event A/)).toBeInTheDocument();

    // Click delete button and verify confirmation modal
    const deleteButton = screen.getByLabelText(/Delete Budget Request/);
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText(/¿Estás seguro de que deseas eliminar esta solicitud de presupuesto?/)).toBeInTheDocument();
    });
  });
});
