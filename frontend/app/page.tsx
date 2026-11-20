import { Button } from "@/components/ui/button";
import { AUTH } from "@/lib/paths";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50">
      <h1 className="mb-8 text-4xl font-bold text-zinc-800">Мой Auth Проект</h1>
      <div className="flex gap-4">
        <Link href={AUTH.LOGIN}>
          <Button>Войти</Button>
        </Link>
        <Link href={AUTH.REGISTER}>
          <Button>Зарегистрироваться</Button>
        </Link>
        <Link href={AUTH.PROFILE}>
          <Button variant="secondary">Мой профиль</Button>
        </Link>
      </div>
    </div>
  );
}
