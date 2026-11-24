import { Button } from "@/components/ui/button";
import { AUTH } from "@/lib/paths";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className="mb-8 text-4xl font-bold text-zinc-800">Home Page</h1>
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
    </>
  );
}
