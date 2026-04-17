import type { Metadata } from "next";
import { Sora, Manrope } from "next/font/google";
import "@/app/globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading"
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "Portal Cliente Opyta",
  description: "Portal read-only para visualizacao analitica geoespacial.",
  icons: {
    icon: "/brand/opyta-logo-site.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${sora.variable} ${manrope.variable}`}>{children}</body>
    </html>
  );
}