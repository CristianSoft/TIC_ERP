import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthContext } from '../contexts/auth-context';
import useFetchTransactions from '../hooks/financial/fetchTransactionHook';
import { TransactionPage } from '../pages/landing/finantial/transaction/TransactionPage';

// Mock hooks and context
jest.mock('../hooks/financial/fetchTransactionHook', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    transactions: [
      {
        id: 1,
        date: '2023-07-18',
        originAccount: 'Account A',
        destinationAccount: 'Account B',
        value: 100,
        transactionType: 'INGRESO',
        description: 'Test Transaction',
      },
    ],
    isLoadingTransactions: false,
    transactionErrors: null,
    addTransactionState: jest.fn(),
  }),
}));

jest.mock('../hooks/financial/createTransactionHook', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      postTransaction: jest.fn().mockResolvedValue({
        id: 2,
        date: '2023-07-19',
        originAccount: 'Account C',
        destinationAccount: 'Account D',
        value: 200,
        transactionType: 'EGRESO',
        description: 'New Test Transaction',
      }),
      postError: null,
    };
  }),
}));

jest.mock('../hooks/financial/fetchTransactionTypeHook', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        transactionStates: ['Pending', 'Completed', 'Failed'],
        isLoading: false,
        error: null,
      };
    }),
  }));
  

jest.mock('../hooks/financial/fetchAccountNamesHook', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        accountNames: ['Account A', 'Account B', 'Account C'],
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

describe('TransactionPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders TransactionPage and shows add modal', async () => {
    const user = { role: 'Presidente', email: 'user@example.com', uid: 'mock-uid' };
    const token = 'mock-token';
    const loadingContext = false;

    render(
      <AuthContext.Provider value={{ user, token, loadingContext }}>
        <TransactionPage />
      </AuthContext.Provider>
    );

    // Verify initial render
    expect(screen.getByText(/Transacciones/)).toBeInTheDocument();
    expect(screen.getByText(/Antes de añadir una transacción/)).toBeInTheDocument();
    expect(screen.getByText(/Account A/)).toBeInTheDocument();

    const addButton = screen.getByLabelText('Add Transaction');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/Agregar Transacción/)).toBeInTheDocument();
    });
  });
});
