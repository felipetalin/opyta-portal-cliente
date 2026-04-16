"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";

export function DemoLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("demo@opyta.com");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const response = await fetch("/api/auth/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      setError("Credenciais invalidas para ambiente de demonstracao.");
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
      <label htmlFor="email">Email autorizado</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <button type="submit" disabled={isPending}>
        {isPending ? "Entrando..." : "Entrar"}
      </button>
      <p className="hint">Use demo@opyta.com para navegar no prototipo.</p>
      {error ? <p className="error">{error}</p> : null}
    </form>
  );
}