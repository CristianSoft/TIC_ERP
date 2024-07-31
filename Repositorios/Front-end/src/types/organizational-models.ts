export interface Member {
  id?: number;
  state_id?: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  cellphone: string;
  faculty: string;
  career: string;
  semester: string;
  email: string;
  position: string;
  password:string
}

export interface UpdateMember {
  id?: number;
  state_id?: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  cellphone: string;
  faculty: string;
  career: string;
  semester: string;
  email: string;
  position: string;
}

export interface RegisterUser {
  id?: number;
  email: string;
  position: string;
  password: string;
}

export interface LoginUser {
  id?: number;
  email: string;
  password: string;
}

export interface OrganizationalInfo {
  id?: number;
  state_id?: number;
  mission: string;
  vision: string;
}

export interface UserData {
  uid: string | null;
  email: string | null;
  role: string | null;
}
