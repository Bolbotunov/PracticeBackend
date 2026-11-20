"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
  useCallback,
} from "react";
import { apiFetch, configureApi } from "@/lib/api";
import { AUTH } from "@/lib/paths";
import { useRouter } from "next/navigation";

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const tokenRef = useRef<string | null>(null);

  const setAccessToken = useCallback((token: string | null) => {
    tokenRef.current = token;
    setAccessTokenState(token);
  }, []);

  useEffect(() => {
    configureApi({
      getToken: () => tokenRef.current,
      setToken: setAccessToken,
      onExpired: () => {
        setAccessToken(null);
        router.push(AUTH.LOGIN);
      },
    });
  }, [setAccessToken, router]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await apiFetch(`${AUTH.BASE}${AUTH.REFRESH}`, {
          method: "POST",
        });
        if (response.ok) {
          const data = await response.json();
          setAccessToken(data.accessToken);
        }
      } catch (error) {
        console.log("Нет сессии", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [setAccessToken]);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
