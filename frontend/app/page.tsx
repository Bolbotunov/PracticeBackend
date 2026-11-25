import { ButtonLink } from "@/components/ui/button-link";
import { AUTH } from "@/lib/paths";

export default function Home() {
  return (
    <>
      <h1 className="mb-8 text-4xl font-bold text-zinc-800">Home Page</h1>
      <div className="flex gap-4">
        <ButtonLink href={AUTH.LOGIN}>Войти</ButtonLink>
        <ButtonLink href={AUTH.REGISTER}>Зарегистрироваться</ButtonLink>
        <ButtonLink href={AUTH.PROFILE} variant="secondary">
          Мой профиль
        </ButtonLink>
      </div>
    </>
  );
}
