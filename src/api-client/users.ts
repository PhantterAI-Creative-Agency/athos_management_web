import { api } from "./client";

export interface UserDTO {
  id: string;
  churchId: string;
  name: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  bio?: string;
  birthDate?: string;
  roles: string[];
  active: boolean;
  professionalData?: { company?: string; role?: string };
  familyData?: {
    spouseId?: string;
    childrenIds?: string[];
    spousePending?: { name: string; phone?: string; email?: string };
  };
  vehicles?: { plate: string; model: string }[];
  medicalRecord?: { bloodType?: string; allergies?: string[] };
  createdAt: string;
  updatedAt: string;
}

export interface CreateChildDTO {
  name: string;
  birthDate: string;
  phone?: string;
  email?: string;
  password?: string;
}

export function createUser(data: {
  churchId: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<UserDTO> {
  return api.post<UserDTO>("/users", data);
}

export function getUser(id: string): Promise<UserDTO> {
  return api.get<UserDTO>(`/users/${id}`);
}

export function updateUser(id: string, data: Partial<UserDTO>): Promise<UserDTO> {
  return api.patch<UserDTO>(`/users/${id}`, data);
}

export function listUsers(params?: { churchId?: string }): Promise<UserDTO[]> {
  const query: Record<string, string> = {};
  if (params?.churchId) query.churchId = params.churchId;
  return api.get<UserDTO[]>("/users", { params: query });
}

export function createChild(parentId: string, data: CreateChildDTO): Promise<UserDTO> {
  return api.post<UserDTO>(`/users/${parentId}/children`, data);
}
