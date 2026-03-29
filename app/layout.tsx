import type { Metadata } from "next";
import { getServerAuthSession } from "@/lib/auth";
import { Providers } from "@/app/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "CogniVerse ERP",
  description: "Centro operacional interno da CogniVerse Agency."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerAuthSession();

  return (
    <html lang="pt-BR">
      <body className="font-body antialiased">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
