"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { loadTokens, setTokens, clearTokens, setOnRefreshFail } from "@/api-client/client";
import {
  login as apiLogin,
  logout as apiLogout,
  type AuthenticatedUserDTO,
  type LoginResultDTO,
} from "@/api-client/auth";
import { getUser } from "@/api-client/users";
import * as jose from "jose";

export interface AuthContextValue {
  user: AuthenticatedUserDTO | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

function clearClientSession() {
  clearTokens();

  if (typeof window !== "undefined") {
    window.localStorage.clear();
    window.sessionStorage.clear();

    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      if (!name) return;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  }
}

function decodeUserFromToken(token: string): AuthenticatedUserDTO | null {
  try {
    const payload = jose.decodeJwt(token);
    if (!payload.sub || !payload.churchId) return null;
    return {
      id: payload.sub as string,
      churchId: payload.churchId as string,
      name: (payload.name as string) || "",
      email: (payload.email as string) || "",
      roles: (payload.roles as string[]) || [],
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // best-effort: mesmo se a API falhar, a sessão local é encerrada
    }
    clearClientSession();
    queryClient.clear();
    setUser(null);
    router.push("/login");
  }, [router, queryClient]);

  useEffect(() => {
    setOnRefreshFail(() => {
      clearClientSession();
      queryClient.clear();
      setUser(null);
      router.push("/login");
    });
  }, [router, queryClient]);

  useEffect(() => {
    const { accessToken } = loadTokens();
    if (accessToken) {
      const decoded = decodeUserFromToken(accessToken);
      if (decoded) {
        setUser(decoded);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const result: LoginResultDTO = await apiLogin({ email, password });
      setTokens(result.accessToken, result.refreshToken);

      let userData: AuthenticatedUserDTO = result.user;
      if (!userData.name) {
        const decoded = decodeUserFromToken(result.accessToken);
        if (decoded) userData = decoded;
      }
      setUser(userData);
    },
    [],
  );

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
