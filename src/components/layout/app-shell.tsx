import Link from "next/link";
import { ReactNode } from "react";

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function AppShell({ title, subtitle, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Portal Cliente Opyta</p>
          <h1>{title}</h1>
          {subtitle ? <p className="subtitle">{subtitle}</p> : null}
        </div>
        <nav>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/projetos">Projetos</Link>
          <form action="/api/auth/logout" method="post">
            <button type="submit" className="link-button">
              Sair
            </button>
          </form>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}