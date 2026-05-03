import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { apiJson, getToken, setToken, setUnauthorizedHandler } from "./api";

export type AuthUser = {
  username: string;
  roles: string[];
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<AuthUser>;
  register: (username: string, password: string) => Promise<AuthUser>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type JwtPayload = {
  sub?: string;
  username?: string;
  roles?: string[] | string;
  exp?: number;
};

function decodeJwt(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

function userFromToken(token: string): AuthUser | null {
  const p = decodeJwt(token);
  if (!p) return null;
  if (p.exp && p.exp * 1000 < Date.now()) return null;
  const username = p.username || p.sub || "user";
  const roles = Array.isArray(p.roles)
    ? p.roles
    : typeof p.roles === "string"
      ? [p.roles]
      : ["ROLE_USER"];
  return { username, roles };
}

type AuthResponse = {
  username: string;
  roles: string[];
  jwtToken: string;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = getToken();
    if (t) {
      const u = userFromToken(t);
      if (u) setUser(u);
      else setToken(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      async login(username, password) {
        const data = await apiJson<AuthResponse>("/auth/login", {
          method: "POST",
          body: { username, password },
          auth: false,
        });
        setToken(data.jwtToken);
        const u: AuthUser = { username: data.username, roles: data.roles };
        setUser(u);
        return u;
      },
      async register(username, password) {
        const data = await apiJson<AuthResponse>("/auth/register", {
          method: "POST",
          body: { username, password },
          auth: false,
        });
        setToken(data.jwtToken);
        const u: AuthUser = { username: data.username, roles: data.roles };
        setUser(u);
        return u;
      },
      logout() {
        setToken(null);
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
