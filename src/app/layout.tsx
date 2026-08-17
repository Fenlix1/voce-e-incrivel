import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://voce-e-incrivel.vercel.app"),
  title: {
    default: "Você é Incrível | Faz Teu Nome - Projeto Social Esportivo",
    template: "%s | Você é Incrível",
  },
  description:
    "Transformando vidas através do esporte, saúde, inclusão social e qualidade de vida. Aulas gratuitas de natação, funcional, jiu-jitsu, boxe e muito mais em Belford Roxo - RJ.",
  keywords: [
    "projeto social",
    "esporte gratuito",
    "Belford Roxo",
    "aulas gratuitas",
    "natação",
    "jiu-jitsu",
    "boxe",
    "funcional",
    "inclusão social",
    "Faz Teu Nome",
  ],
  authors: [{ name: "Projeto Você é Incrível" }],
  creator: "Faz Teu Nome",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Você é Incrível",
    title: "Você é Incrível | Faz Teu Nome - Projeto Social Esportivo",
    description:
      "Transformando vidas através do esporte, saúde, inclusão social e qualidade de vida.",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Você é Incrível | Faz Teu Nome",
    description:
      "Transformando vidas através do esporte, saúde, inclusão social e qualidade de vida.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${montserrat.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
