import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthContext } from '../contexts/auth-context';
import { InventoryPage } from '../pages/landing/inventory/InventoryPage';


// Mock hooks and context
jest.mock('../hooks/inventory/fetchInventoryHook', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    inventoryMovements: [
      {
        id: 1,
        product: 'Product A',
        movementType: 'Type A',
        quantity: 10,
        date: '2023-07-18',
      },
    ],
    isLoadingInventoryMovements: false,
    inventoryMovementErrors: null,
    updateInventoryMovementState: jest.fn(),
    addInventoryMovementState: jest.fn(),
  }),
}));

jest.mock('../hooks/inventory/updateInventoryHook', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      updateInventoryMovement: jest.fn().mockResolvedValue({
        id: 1,
        product: 'Product A',
        movementType: 'Type A',
        quantity: 20,
        date: '2023-07-18',
      }),
      updateError: null,
    };
  }),
}));

jest.mock('../hooks/inventory/patchInventoryHook', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      patchInventoryMovementState: jest.fn().mockResolvedValue({
        id: 1,
        state: 'patched',
      }),
      patchError: null,
    };
  }),
}));

jest.mock('../hooks/inventory/createInventoryHook', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      postInventoryMovement: jest.fn().mockResolvedValue({
        id: 2,
        product: 'Product B',
        movementType: 'Type B',
        quantity: 15,
        date: '2023-07-19',
      }),
      postError: null,
    };
  }),
}));

jest.mock('../hooks/inventory/fetchProductHook', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    products: [
      { name: 'Product A' },
      { name: 'Product B' },
      { name: 'Product C' },
    ],
  }),
}));

jest.mock('../hooks/inventory/fetchMovementType', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    inventoryMovementTypes: [
      { movement_Type_Name: 'Type A' },
      { movement_Type_Name: 'Type B' },
    ],
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

describe('InventoryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders InventoryPage and shows edit modal', async () => {
    const user = { role: 'Presidente', email: 'user@example.com', uid: 'mock-uid' };
    const token = 'mock-token';
    const loadingContext = false;

    render(
      <AuthContext.Provider value={{ user, token, loadingContext }}>
        <InventoryPage />
      </AuthContext.Provider>
    );

    // Verify initial render
    expect(screen.getByText(/Movimientos de Inventario/)).toBeInTheDocument();
    expect(screen.getByText(/Antes de añadir un movimiento de inventario/)).toBeInTheDocument();
    expect(screen.getByText(/Product A/)).toBeInTheDocument();

    // Click edit button and verify modal
    const editButton = screen.getByLabelText(/Edit Movement/);
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByText(/Editar Inventario/)).toBeInTheDocument();
    });
  });
});
