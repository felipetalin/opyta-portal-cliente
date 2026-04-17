import Link from "next/link";

export default function NotFound() {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Pagina nao encontrada</h1>
        <p>O endereco solicitado nao existe no portal cliente.</p>
        <Link href="/dashboard">Ir para dashboard</Link>
      </div>
    </section>
  );
}