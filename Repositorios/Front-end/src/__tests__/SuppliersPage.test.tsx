import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SuppliersPage } from '../pages/landing/suppliers/SuppliersPage';
import { AuthContext } from '../contexts/auth-context';


// Mock hooks and context
jest.mock('../hooks/inventory/fetchProviderHook', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    providers: [
      {
        id: 1,
        name: 'Supplier A',
        phone: '123456789',
        email: 'supplierA@example.com',
      },
    ],
    isLoadingProviders: false,
    providerErrors: null,
    updateProviderState: jest.fn(),
    addProviderState: jest.fn(),
  }),
}));

jest.mock('../hooks/inventory/updateProviderHook', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      updateProvider: jest.fn().mockResolvedValue({
        id: 1,
        name: 'Supplier A',
        phone: '123456789',
        email: 'supplierA@example.com',
      }),
      updateError: null,
    };
  }),
}));

jest.mock('../hooks/inventory/patchProvider', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      patchProviderState: jest.fn().mockResolvedValue({
        id: 1,
        state: 'patched',
      }),
      patchError: null,
    };
  }),
}));

jest.mock('../hooks/inventory/createProviderHook', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      postProvider: jest.fn().mockResolvedValue({
        id: 2,
        name: 'Supplier B',
        phone: '987654321',
        email: 'supplierB@example.com',
      }),
      postError: null,
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

describe('SuppliersPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders SuppliersPage and shows edit modal', async () => {
    const user = { role: 'Presidente', email: 'user@example.com', uid: 'mock-uid' };
    const token = 'mock-token';
    const loadingContext = false;

    render(
      <AuthContext.Provider value={{ user, token, loadingContext }}>
        <SuppliersPage />
      </AuthContext.Provider>
    );

    // Verify initial render
    expect(screen.getByText(/Proveedores/)).toBeInTheDocument();
    expect(screen.getByText(/Ahora que añadiste los proveedores necesarios/)).toBeInTheDocument();
    expect(screen.getByText(/Supplier A/)).toBeInTheDocument();

    // Click edit button and verify modal
    const editButton = screen.getByLabelText(/Edit Event/);
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByText(/Editar Proveedor/)).toBeInTheDocument();
    });
  });

  test('renders SuppliersPage and shows delete confirmation modal', async () => {
    const user = { role: 'Presidente', email: 'user@example.com', uid: 'mock-uid' };
    const token = 'mock-token';
    const loadingContext = false;

    render(
      <AuthContext.Provider value={{ user, token, loadingContext }}>
        <SuppliersPage />
      </AuthContext.Provider>
    );

    // Verify initial render
    expect(screen.getByText(/Proveedores/)).toBeInTheDocument();
    expect(screen.getByText(/Ahora que añadiste los proveedores necesarios/)).toBeInTheDocument();
    expect(screen.getByText(/Supplier A/)).toBeInTheDocument();

    // Click delete button and verify confirmation modal
    const deleteButton = screen.getByLabelText(/Delete Event/);
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText(/Eliminar proveedor/)).toBeInTheDocument();
    });
  });
});
