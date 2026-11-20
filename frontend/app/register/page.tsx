"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { AUTH } from "@/lib/paths";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { GlobalLoader } from "@/components/layout/global-loader";
import { ErrorResponse } from "@/types/api";

export default function RegisterPage() {
  const router = useRouter();
  const { accessToken, isLoading: isAuthLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && accessToken) {
      router.push("/");
    }
  }, [accessToken, isAuthLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await apiFetch(`${AUTH.BASE}${AUTH.REGISTER}`, {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as ErrorResponse;
        if (data.details) {
          const firstError = Object.values(data.details)[0] as string[];
          throw new Error(firstError[0]);
        }
        throw new Error(errorData.error || "Ошибка при регистрации");
      }

      alert("Регистрация успешна! Теперь войдите в систему.");
      router.push(AUTH.LOGIN);
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
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">Регистрация</h1>

        {error && <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            variant="text"
            label="Имя (необязательно)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Олег"
          />
          <Input
            variant="email"
            label="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="oleg@example.com"
          />
          <Input
            variant="password"
            label="Пароль"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Минимум 8 символов"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded bg-blue-600 p-2 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isLoading ? "Загрузка..." : "Зарегистрироваться"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
