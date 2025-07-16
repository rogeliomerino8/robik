import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "@/components/ui/sidebar";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Robik Legal Tech",
  description: "Plataforma de análisis y gestión de documentos legales con IA.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-black min-h-screen`}>
        <ToastProvider>
          <Sidebar />
          <main className="ml-20 min-h-screen p-8 md:p-12 lg:p-16 transition-colors">
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}
