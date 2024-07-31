import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AdminHome } from '../pages/admin/AdminHomePage';
import { AuthContext } from '../contexts/auth-context';
import useFetchAdministrativeMembers from '../hooks/admin/fetchAdminTableHook';

// Mock hooks and context
jest.mock('../hooks/admin/fetchAdminTableHook', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    administrativeMembers: [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        birthDate: '1990-01-01',
        cellphone: '123456789',
        faculty: 'Engineering',
        career: 'Computer Science',
        semester: '5',
        email: 'john.doe@example.com',
        position: 'President',
      },
    ],
    isLoadingAdministrativeMembers: false,
    administrativeMemberErrors: null,
    updateAdministrativeMemberState: jest.fn(),
    addAdminMemberState: jest.fn(),
  }),
}));

jest.mock('../hooks/admin/fetchInformationTableHook', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    associations: [
      {
        id: 1,
        mission: 'Our mission',
        vision: 'Our vision',
      },
    ],
    isLoadingAssociations: false,
    associationErrors: null,
    updateAssociationState: jest.fn(),
    addAssociationState: jest.fn(),
  }),
}));

jest.mock('../hooks/admin/createInformationTableHook', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      postAssociation: jest.fn().mockResolvedValue({
        id: 2,
        mission: 'New Mission',
        vision: 'New Vision',
      }),
      postError: null,
    };
  }),
}));

jest.mock('../hooks/admin/createMemberTableHook', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      postAdministrativeMember: jest.fn().mockResolvedValue({
        id: 2,
        firstName: 'Jane',
        lastName: 'Doe',
        birthDate: '1992-01-01',
        cellphone: '987654321',
        faculty: 'Science',
        career: 'Biology',
        semester: '3',
        email: 'jane.doe@example.com',
        position: 'Vice President',
      }),
      postError: null,
    };
  }),
}));


jest.mock('../hooks/general/fetchRolesHook', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    roles: ['President', 'Vice President', 'Secretary'],
  }),
}));

jest.mock('../hooks/general/fetchSemestersHook', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    semesters: ['1', '2', '3', '4', '5', '6', '7', '8'],
  }),
}));

jest.mock('../hooks/general/FetchCareerHook', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    careersData: ['Computer Science', 'Biology', 'Mechanical Engineering'],
  }),
}));

jest.mock('../hooks/admin/updateInformationTableHook', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        updateAssociation: jest.fn().mockResolvedValue({
          id: 1,
          mission: 'Updated Mission',
          vision: 'Updated Vision',
        }),
        updateError: null,
      };
    }),
  }));

  jest.mock('../hooks/admin/patchAdminTableHook', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({
      patchAdministrativeMemberState: jest.fn().mockResolvedValue({
        id: 1,
        state: 'updated',
      }),
      patchAdminError: null,
    }),
  }));
  
  jest.mock('../hooks/admin/updateAdminTableHook', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({
      updateAdministrativeMember: jest.fn().mockResolvedValue({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        birthDate: '1990-01-01',
        cellphone: '1234567890',
        faculty: 'Engineering',
        career: 'Computer Science',
        semester: '8th',
        email: 'john.doe@example.com',
        position: 'President',
      }),
      updateAdministrativeMemberError: null,
    }),
  }));
  
  jest.mock('../hooks/admin/patchInformationTableHook', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({
      patchAssociationState: jest.fn().mockResolvedValue({
        id: 1,
        state: 'patched',
      }),
      patchError: null,
    }),
  }));
  

jest.mock('../hooks/general/fetchFacultyHook', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    facultiesData: ['Engineering', 'Science', 'Arts'],
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

describe('AdminHome', () => {
  beforeEach(() => {
    (useFetchAdministrativeMembers as jest.Mock).mockImplementation(() => {
      return {
        administrativeMembers: [
          {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            birthDate: '1990-01-01',
            cellphone: '123456789',
            faculty: 'Engineering',
            career: 'Computer Science',
            semester: '5',
            email: 'john.doe@example.com',
            position: 'Presidente',
          },
        ],
        isLoadingAdministrativeMembers: false,
        administrativeMemberErrors: null,
        updateAdministrativeMemberState: jest.fn(),
        addAdminMemberState: jest.fn(),
      };
    });
  });

  test('renders AdminHome and interacts with elements', async () => {
    const user = {
      role: 'Administrador',
      email: 'admin@example.com',
      uid: 'mock-uid',
    };
    const token = 'mock-token';
    const loadingContext = false;

    render(
      <AuthContext.Provider value={{ user, token, loadingContext }}>
        <AdminHome />
      </AuthContext.Provider>
    );

    // Verify initial render
    expect(screen.getByText(/Sistema Cloud ERP de FEPON/)).toBeInTheDocument();
    expect(
      screen.getByText(/¡Bienvenidos al Sistema Cloud ERP de la FEPON!/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Información Organizacional/)).toBeInTheDocument();
    expect(screen.getByText(/Miembros Administrativos/)).toBeInTheDocument();
  });

  test('renders AdminHome and opens add member modal', async () => {
    const user = {
      role: 'Administrador',
      email: 'admin@example.com',
      uid: 'mock-uid',
    };
    const token = 'mock-token';
    const loadingContext = false;

    render(
      <AuthContext.Provider value={{ user, token, loadingContext }}>
        <AdminHome />
      </AuthContext.Provider>
    );

    const addButton = screen.getByLabelText(/Add Member/);
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Agregar Miembro Administrativo/)
      ).toBeInTheDocument();
    });
  });

  test('renders AdminHome and opens edit member modal', async () => {
    const user = {
      role: 'Administrador',
      email: 'admin@example.com',
      uid: 'mock-uid',
    };
    const token = 'mock-token';
    const loadingContext = false;

    render(
      <AuthContext.Provider value={{ user, token, loadingContext }}>
        <AdminHome />
      </AuthContext.Provider>
    );

    const editButton = screen.getByLabelText(/Edit Member/);
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Editar Miembro Administrativo/)
      ).toBeInTheDocument();
    });
  });

  test('renders AdminHome and opens add info modal', async () => {
    const user = {
      role: 'Administrador',
      email: 'admin@example.com',
      uid: 'mock-uid',
    };
    const token = 'mock-token';
    const loadingContext = false;

    render(
      <AuthContext.Provider value={{ user, token, loadingContext }}>
        <AdminHome />
      </AuthContext.Provider>
    );

    const addButton = screen.getByLabelText(/Add Information/);
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Agregar Información de FEPON/)
      ).toBeInTheDocument();
    });
  });

  test('renders AdminHome and opens edit info modal', async () => {
    const user = {
      role: 'Administrador',
      email: 'admin@example.com',
      uid: 'mock-uid',
    };
    const token = 'mock-token';
    const loadingContext = false;

    render(
      <AuthContext.Provider value={{ user, token, loadingContext }}>
        <AdminHome />
      </AuthContext.Provider>
    );

    const editButton = screen.getByLabelText(/Edit Information/);
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Editar Información de FEPON/)
      ).toBeInTheDocument();
    });
  });
});
