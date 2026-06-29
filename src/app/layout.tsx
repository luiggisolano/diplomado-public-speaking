import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SEO } from "@/lib/constants";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: SEO.title,
  description: SEO.description,
  keywords: [
    "public speaking",
    "diplomado",
    "oratoria",
    "comunicación",
    "UTMACH",
    "Universidad Técnica de Machala",
    "liderazgo",
    "persuasión",
  ],
  openGraph: {
    title: SEO.title,
    description: SEO.description,
    type: "website",
    locale: "es_EC",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-cream font-sans">
        {children}
      </body>
    </html>
  );
}
