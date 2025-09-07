import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Baseball 5 Statistics",
  description: "Application de statistiques pour matches de Baseball 5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-lg">⚾</span>
                Baseball 5 Statistics
              </h1>
              <p className="text-gray-600 mt-1">
                Suivez les statistiques de votre match en temps réel
              </p>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 py-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}