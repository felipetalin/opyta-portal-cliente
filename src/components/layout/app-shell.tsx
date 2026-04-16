import Link from "next/link";
import { ReactNode } from "react";
import { DashboardIcon, LogoutIcon, ProjectsIcon } from "@/components/ui/nav-icons";

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function AppShell({ title, subtitle, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-main">
          <a className="brand-inline" href="https://opyta.com.br" target="_blank" rel="noreferrer">
            <img src="/brand/opyta-logo-site.png" alt="Opyta" className="brand-logo brand-logo--topbar" />
          </a>
          <div>
            <p className="eyebrow">Portal Cliente Opyta</p>
            <h1>{title}</h1>
            <p className="company-line">Consultoria em Sustentabilidade Corporativa</p>
            {subtitle ? <p className="subtitle">{subtitle}</p> : null}
          </div>
        </div>
        <nav>
          <Link href="/dashboard" className="nav-link">
            <DashboardIcon className="nav-icon" />
            Dashboard
          </Link>
          <Link href="/projetos" className="nav-link">
            <ProjectsIcon className="nav-icon" />
            Projetos
          </Link>
          <form action="/api/auth/logout" method="post">
            <button type="submit" className="link-button logout-button">
              <LogoutIcon className="nav-icon" />
              Sair
            </button>
          </form>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}