import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthContext } from '../contexts/auth-context';
import { AccountPage } from '../pages/landing/finantial/accounts/AccountPage';


// Mock hooks and context
jest.mock('../hooks/financial/fetchAccountingAccountHook', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    accountingAccounts: [
      {
        id: 1,
        accountType: 'Asset',
        accountName: 'Account A',
        currentValue: 1000,
        date: '2023-07-18',
      },
    ],
    isLoadingAccounts: false,
    accountErrors: null,
    updateAccountState: jest.fn(),
    addAccountState: jest.fn(),
  }),
}));

jest.mock('../hooks/financial/createAccountingAccounts', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      postAccountingAccount: jest.fn().mockResolvedValue({
        id: 2,
        accountType: 'Liability',
        accountName: 'Account B',
        currentValue: 2000,
        date: '2023-07-19',
      }),
      postError: null,
    };
  }),
}));

jest.mock('../hooks/financial/updateAccountingAccountHook', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      updateAccountingAccount: jest.fn().mockResolvedValue({
        id: 1,
        accountType: 'Asset',
        accountName: 'Updated Account A',
        currentValue: 1500,
        date: '2023-07-18',
      }),
      updateError: null,
    };
  }),
}));

jest.mock('../hooks/financial/fetchAccountTypeHook', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      accountTypesData: ['Asset', 'Liability', 'Equity'],
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

describe('AccountPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  test('renders AccountPage and shows add modal', async () => {
    const user = { role: 'Presidente', email: 'user@example.com', uid: 'mock-uid' };
    const token = 'mock-token';
    const loadingContext = false;

    render(
      <AuthContext.Provider value={{ user, token, loadingContext }}>
        <AccountPage />
      </AuthContext.Provider>
    );

    // Verify initial render
    expect(screen.getByText(/Cuentas Contables/)).toBeInTheDocument();
    expect(screen.getByText(/Ahora que añadiste las cuentas contables necesarias/)).toBeInTheDocument();
    expect(screen.getByText(/Account A/)).toBeInTheDocument();

    const addButton = screen.getByLabelText('Add Account');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/Agregar Cuenta Contable/)).toBeInTheDocument();
    });
  });

});
