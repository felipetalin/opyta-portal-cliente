"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      setError("Email ou senha invalidos.");
      return;
    }

    const next = searchParams.get("next") ?? "/dashboard";
    startTransition(() => {
      router.push(next);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="seu@email.com"
        required
      />
      
      <label htmlFor="password">Senha</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="••••••••"
        required
      />
      
      <button type="submit" disabled={isPending}>
        {isPending ? "Entrando..." : "Entrar"}
      </button>
      
      <p className="hint">Portal de visualizacao read-only para projetos geoespaciais.</p>
      {error ? <p className="error">{error}</p> : null}
    </form>
  );
}
