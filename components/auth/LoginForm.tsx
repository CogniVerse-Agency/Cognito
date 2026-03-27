"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
      setError("Email ou senha incorretos");
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError("Email ou senha incorretos");
      return;
    }

    startTransition(async () => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl
      });

      if (!result || result.error) {
        setError("Email ou senha incorretos");
        return;
      }

      window.location.href = result.url ?? callbackUrl;
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="voce@cogniverse.com"
        autoComplete="email"
        icon={<Mail className="h-4 w-4" />}
      />
      <Input
        name="password"
        type="password"
        label="Senha"
        placeholder="Digite sua senha"
        autoComplete="current-password"
        icon={<LockKeyhole className="h-4 w-4" />}
      />

      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
