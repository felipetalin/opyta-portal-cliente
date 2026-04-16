import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Portal Cliente Opyta",
  description: "Portal read-only para visualizacao analitica geoespacial."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}