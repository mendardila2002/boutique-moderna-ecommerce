import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Boutique Moderna | Local E-commerce",
  description: "Piezas atemporales diseñadas para el estilo de vida contemporáneo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
