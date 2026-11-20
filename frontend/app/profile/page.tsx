"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { AUTH } from "@/lib/paths";
import { GlobalLoader } from "@/components/layout/global-loader";

interface UserData {
  id: string;
  email: string;
  name?: string | null;
  createdAt: string;
}

export default function ProfilePage() {
  const { accessToken, setAccessToken, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!accessToken) {
      router.push(AUTH.LOGIN);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await apiFetch(`${AUTH.BASE}${AUTH.ME}`);

        if (!response.ok) throw new Error("Не удалось загрузить профиль");
        const data = await response.json();
        setUser(data.user);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [accessToken, isAuthLoading, router]);

  const handleLogout = async () => {
    try {
      await apiFetch(`${AUTH.BASE}${AUTH.LOGOUT}`, { method: "POST" });
    } finally {
      setAccessToken(null);
      router.push(AUTH.LOGIN);
    }
  };

  if (isAuthLoading || isLoading) {
    return <GlobalLoader loading message="Загрузка профиля..." />;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">Личный кабинет</h1>

        {user && (
          <div className="space-y-4 text-gray-700">
            <div className="border-b pb-2">
              <span className="font-semibold">ID:</span> {user.id}
            </div>
            <div className="border-b pb-2">
              <span className="font-semibold">Email:</span> {user.email}
            </div>
            <div className="border-b pb-2">
              <span className="font-semibold">Имя:</span> {user.name || "Не указано"}
            </div>
            <div>
              <span className="font-semibold">Дата регистрации:</span>{" "}
              {new Date(user.createdAt).toLocaleDateString("ru-RU")}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-2">
          <button
            onClick={handleLogout}
            className="w-full rounded bg-red-600 p-2 font-semibold text-white hover:bg-red-700"
          >
            Выйти из аккаунта
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full rounded bg-gray-200 p-2 font-semibold text-gray-800 hover:bg-gray-300"
          >
            На главную
          </button>
        </div>
      </div>
    </div>
  );
}
