import { DemoLoginForm } from "@/components/auth/login-form";

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Acesso ao Portal Cliente</h1>
        <p>Visualizacao analitica geoespacial - Acesso restrito.</p>
        <DemoLoginForm />
      </div>
    </section>
  );
}