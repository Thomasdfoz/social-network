import type { Metadata } from "next";
// import { Inter } from "next/font/google"; // Removed google font import to be standard/safer or I should keep it? 
// The initial file had strict types. I should recreate it properly.
// Wait, create-next-app output has Inter probably.
// I'll stick to 'Inter' via Google Fonts as I put in CSS, but loading it here is better.
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { createClient } from "@/utils/supabase/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Global Feed",
  description: "A simple, open social network.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="pt-BR">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className={inter.className}>
        <Header user={user} />
        <main className="container py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
