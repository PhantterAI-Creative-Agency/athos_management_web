import { api } from "./client";

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthTokensDTO {
  accessToken: string;
  refreshToken: string;
}

export interface AuthenticatedUserDTO {
  id: string;
  churchId: string;
  name: string;
  email: string;
  roles: string[];
}

export interface LoginResultDTO extends AuthTokensDTO {
  user: AuthenticatedUserDTO;
}

export function login(data: LoginDTO): Promise<LoginResultDTO> {
  return api.post<LoginResultDTO>("/auth/login", data);
}

export function refresh(refreshToken: string): Promise<AuthTokensDTO> {
  return api.post<AuthTokensDTO>("/auth/refresh", { refreshToken });
}

export function logout(): Promise<void> {
  return api.post<void>("/auth/logout");
}
