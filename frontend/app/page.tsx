import { AUTH } from "@/lib/paths";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50">
      <h1 className="mb-8 text-4xl font-bold text-zinc-800">Мой Auth Проект</h1>
      <div className="flex gap-4">
        <Link
          href={AUTH.LOGIN}
          className="rounded bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Войти
        </Link>
        <Link
          href={AUTH.REGISTER}
          className="rounded bg-gray-200 px-6 py-3 font-semibold text-gray-800 hover:bg-gray-300"
        >
          Зарегистрироваться
        </Link>
        <Link
          href={AUTH.PROFILE}
          className="rounded bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
        >
          Профиль (Защищено)
        </Link>
      </div>
    </div>
  );
}
