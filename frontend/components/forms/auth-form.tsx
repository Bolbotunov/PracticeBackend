"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiFetch, getApiError } from "@/lib/api";
import { AUTH } from "@/lib/paths";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema, registerSchema, loginResponseSchema } from "@/schemas/auth.schema";

type AuthFormData = {
  name?: string;
  email: string;
  password: string;
};

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { accessToken, setAccessToken, isLoading: isAuthLoading } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const isLogin = mode === "login";

  useEffect(() => {
    if (!isAuthLoading && accessToken) {
      router.replace("/");
    }
  }, [accessToken, isAuthLoading, router]);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AuthFormData>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  if (isAuthLoading) {
    return null;
  }

  if (accessToken) {
    return null;
  }

  const onSubmit = async (data: AuthFormData) => {
    setServerError(null);

    try {
      const body = isLogin
        ? { email: data.email, password: data.password }
        : { email: data.email, password: data.password, name: data.name };

      const response = await apiFetch(
        isLogin ? `${AUTH.BASE}${AUTH.LOGIN}` : `${AUTH.BASE}${AUTH.REGISTER}`,
        { method: "POST", body: JSON.stringify(body) },
      );

      if (!response.ok) {
        const errorMsg = await getApiError(
          response,
          isLogin ? "Ошибка входа" : "Ошибка регистрации",
        );
        throw new Error(errorMsg);
      }

      const rawData = await response.json();

      if (isLogin) {
        const authData = loginResponseSchema.parse(rawData);
        setAccessToken(authData.accessToken);
        router.push("/");
      } else {
        alert("Регистрация успешна! Теперь войдите в систему.");
        router.push(AUTH.LOGIN);
      }
    } catch (err: unknown) {
      if (err instanceof Error) setServerError(err.message);
      else setServerError("Произошла неизвестная ошибка");
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
        {isLogin ? "Вход в систему" : "Регистрация"}
      </h1>

      {serverError && (
        <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{serverError}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {!isLogin && (
          <Controller
            name="name"
            control={control}
            render={({ field: { value, onChange, onBlur, ref }, fieldState }) => (
              <Input
                variant="text"
                label="Имя (необязательно)"
                placeholder="Олег"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                ref={ref}
                error={fieldState.error?.message}
              />
            )}
          />
        )}

        <Controller
          name="email"
          control={control}
          render={({ field: { value, onChange, onBlur, ref }, fieldState }) => (
            <Input
              variant="email"
              label="Email"
              required
              placeholder={isLogin ? "example@example.com" : "oleg@example.com"}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field: { value, onChange, onBlur, ref }, fieldState }) => (
            <Input
              variant="password"
              label="Пароль"
              required
              placeholder={isLogin ? "••••••••" : "Минимум 8 символов"}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}
              error={fieldState.error?.message}
            />
          )}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          loadingText="Загрузка..."
          className="w-full"
        >
          {isLogin ? "Войти" : "Зарегистрироваться"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        {isLogin ? (
          <>
            Нет аккаунта?{" "}
            <Link href={AUTH.REGISTER} className="text-blue-600 hover:underline">
              Зарегистрироваться
            </Link>
          </>
        ) : (
          <>
            Уже есть аккаунт?{" "}
            <Link href={AUTH.LOGIN} className="text-blue-600 hover:underline">
              Войти
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
