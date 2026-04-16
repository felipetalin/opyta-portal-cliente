import { DemoLoginForm } from "@/components/auth/demo-login-form";

export default function LoginPage() {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="brand-lockup">
          <img src="/brand/opyta-logo-site.png" alt="Opyta" className="brand-logo brand-logo--auth" />
          <p className="brand-tagline">Consultoria em Sustentabilidade Corporativa</p>
        </div>
        <h1>Acesso ao Portal Cliente</h1>
        <p>Ambiente de visualizacao read-only para analises geoespaciais.</p>
        <DemoLoginForm />
      </div>
    </section>
  );
}