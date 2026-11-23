"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { AUTH } from "@/lib/paths";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { GlobalLoader } from "@/components/layout/global-loader";
import { ErrorResponse, LoginResponse } from "@/types/api";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const { accessToken, setAccessToken, isLoading: isAuthLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && accessToken) {
      router.push("/");
    }
  }, [accessToken, isAuthLoading, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await apiFetch(`${AUTH.BASE}${AUTH.LOGIN}`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as ErrorResponse;
        throw new Error(errorData.error || "Ошибка при входе");
      }

      const authData = data as LoginResponse;
      setAccessToken(authData.accessToken);
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Произошла неизвестная ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthLoading) {
    return <GlobalLoader loading message="Проверка авторизации..." />;
  }

  if (accessToken) {
    return <GlobalLoader loading message="Перенаправление..." />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">Вход в систему</h1>

        {error && <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            variant="email"
            label="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@example.com"
          />

          <Input
            variant="password"
            label="Пароль"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isLoading}
            loadingText="Загрузка..."
            className="w-full"
          >
            Войти
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Нет аккаунта?{" "}
          <Link href={AUTH.REGISTER} className="text-blue-600 hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}
