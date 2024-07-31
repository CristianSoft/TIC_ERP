import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthContext } from '../contexts/auth-context';
import { EventsPage } from '../pages/landing/events/EventPage';


// Mock hooks and context
jest.mock('../hooks/Events/fetchEventHook', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    events: [
      {
        id: 1,
        title: 'Event A',
        status: 'Pending',
        description: 'Description A',
        startDate: '2023-07-18',
        endDate: '2023-07-20',
        budget: 1000,
        budgetStatus: 'Approved',
        location: 'Location A',
        income: 1500,
      },
    ],
    isLoadingEvents: false,
    eventErrors: null,
    updateEventState: jest.fn(),
    addEventState: jest.fn(),
  }),
}));

jest.mock('../hooks/Events/updateEventhook', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      updateEvent: jest.fn().mockResolvedValue({
        id: 1,
        title: 'Event A',
        status: 'Pending',
        description: 'Description A',
        startDate: '2023-07-18',
        endDate: '2023-07-20',
        budget: 1000,
        budgetStatus: 'Approved',
        location: 'Location A',
        income: 1500,
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
        title: 'Event B',
        status: 'Approved',
        description: 'Description B',
        startDate: '2023-07-21',
        endDate: '2023-07-23',
        budget: 2000,
        budgetStatus: 'Pending',
        location: 'Location B',
        income: 2500,
      }),
      postError: null,
    };
  }),
}));

jest.mock('../hooks/Events/fetchEventStatusHook', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      eventStatesData: ['Pending', 'Approved', 'Rejected'],
      isLoading: false,
      error: null,
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

describe('EventsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders EventsPage and shows add modal', async () => {
    const user = { role: 'Presidente', email: 'user@example.com', uid: 'mock-uid' };
    const token = 'mock-token';
    const loadingContext = false;

    render(
      <AuthContext.Provider value={{ user, token, loadingContext }}>
        <EventsPage />
      </AuthContext.Provider>
    );

    // Verify initial render
    expect(screen.getByText(/Eventos/)).toBeInTheDocument();
    expect(screen.getByText(/Ahora que añadiste los eventos necesarios/)).toBeInTheDocument();
    expect(screen.getByText(/Event A/)).toBeInTheDocument();

    const addButton = screen.getByLabelText(/Agregar evento/);
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/Agregar Evento/)).toBeInTheDocument();
    });
  });

  test('renders EventsPage and shows edit modal', async () => {
    const user = { role: 'Presidente', email: 'user@example.com', uid: 'mock-uid' };
    const token = 'mock-token';
    const loadingContext = false;

    render(
      <AuthContext.Provider value={{ user, token, loadingContext }}>
        <EventsPage />
      </AuthContext.Provider>
    );

    // Verify initial render
    expect(screen.getByText(/Eventos/)).toBeInTheDocument();
    expect(screen.getByText(/Ahora que añadiste los eventos necesarios/)).toBeInTheDocument();
    expect(screen.getByText(/Event A/)).toBeInTheDocument();

    const editButton = screen.getByLabelText('Edit Event');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByText(/Editar Evento/)).toBeInTheDocument();
    });
  });

  test('renders EventsPage and shows delete confirmation modal', async () => {
    const user = { role: 'Presidente', email: 'user@example.com', uid: 'mock-uid' };
    const token = 'mock-token';
    const loadingContext = false;

    render(
      <AuthContext.Provider value={{ user, token, loadingContext }}>
        <EventsPage />
      </AuthContext.Provider>
    );

    // Verify initial render
    expect(screen.getByText(/Eventos/)).toBeInTheDocument();
    expect(screen.getByText(/Ahora que añadiste los eventos necesarios/)).toBeInTheDocument();
    expect(screen.getByText(/Event A/)).toBeInTheDocument();

    // Click delete button and verify confirmation modal
    const deleteButton = screen.getByLabelText(/Delete Event/);
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText(/Eliminar evento/)).toBeInTheDocument();
    });
  });
});
