import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="brand-lockup">
          <img src="/brand/opyta-logo-site.png" alt="Opyta" className="brand-logo brand-logo--auth" />
          <p className="brand-tagline">Consultoria em Sustentabilidade Corporativa</p>
        </div>
        <h1>Acesso ao Portal Cliente</h1>
        <p>Ambiente oficial de visualizacao read-only para analises geoespaciais.</p>
        <Suspense fallback={<p>Carregando formulario de acesso...</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </section>
  );
}