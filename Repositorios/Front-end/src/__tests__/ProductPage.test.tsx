import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthContext } from '../contexts/auth-context';
import { ProductsPage } from '../pages/landing/inventory/products/ProductsPage';

// Mock hooks and context
jest.mock('../hooks/inventory/fetchProductHook', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    products: [
      {
        id: 1,
        name: 'Product A',
        category: 'Category A',
        description: 'Description A',
        price: 10,
        quantity: 100,
        label: 'Label A',
        provider: 'Provider A',
      },
    ],
    isLoadingProducts: false,
    productErrors: null,
    updateProductState: jest.fn(),
    addProductState: jest.fn(),
  }),
}));

jest.mock('../hooks/inventory/updateProductHook', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      updateProduct: jest.fn().mockResolvedValue({
        id: 1,
        name: 'Product A',
        category: 'Category A',
        description: 'Description A',
        price: 20,
        quantity: 200,
        label: 'Label A',
        provider: 'Provider A',
      }),
      updateError: null,
    };
  }),
}));

jest.mock('../hooks/inventory/patchProductHook', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      patchProductState: jest.fn().mockResolvedValue({
        id: 1,
        state: 'patched',
      }),
      patchError: null,
    };
  }),
}));

jest.mock('../hooks/inventory/createProductHook', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      postProduct: jest.fn().mockResolvedValue({
        id: 2,
        name: 'Product B',
        category: 'Category B',
        description: 'Description B',
        price: 15,
        quantity: 150,
        label: 'Label B',
        provider: 'Provider B',
      }),
      postError: null,
    };
  }),
}));

jest.mock('../hooks/inventory/fetchProviderHook', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    providers: [
     'Provider A',
     'Provider B',
    ],
  }),
}));

jest.mock('../hooks/inventory/fetchCategoryHook', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    categoriesData: [
      'Category A',
      'Category B',
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

describe('ProductsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders ProductsPage and shows delete confirmation modal', async () => {
    const user = { role: 'Presidente', email: 'user@example.com', uid: 'mock-uid' };
    const token = 'mock-token';
    const loadingContext = false;

    render(
      <AuthContext.Provider value={{ user, token, loadingContext }}>
        <ProductsPage />
      </AuthContext.Provider>
    );

    // Verify initial render
    expect(screen.getByText(/Productos/)).toBeInTheDocument();
    expect(screen.getByText(/Ahora que añadiste los productos necesarios/)).toBeInTheDocument();
    expect(screen.getByText(/Product A/)).toBeInTheDocument();

    // Click delete button and verify confirmation modal
    const deleteButton = screen.getByLabelText(/Delete Product/);
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText(/Eliminar producto/)).toBeInTheDocument();
    });
  });

  test('renders ProductsPage and shows add modal', async () => {
    const user = { role: 'Presidente', email: 'user@example.com', uid: 'mock-uid' };
    const token = 'mock-token';
    const loadingContext = false;

    render(
      <AuthContext.Provider value={{ user, token, loadingContext }}>
        <ProductsPage />
      </AuthContext.Provider>
    );

    // Verify initial render
    expect(screen.getByText(/Productos/)).toBeInTheDocument();
    expect(screen.getByText(/Ahora que añadiste los productos necesarios/)).toBeInTheDocument();
    expect(screen.getByText(/Product A/)).toBeInTheDocument();


    // Click edit button and verify modal
    const addButton = screen.getByLabelText(/AddProduct/);
    fireEvent.click(addButton);


    await waitFor(() => {
      expect(screen.getByText(/Agregar Producto/)).toBeInTheDocument();
    });
  });





});
