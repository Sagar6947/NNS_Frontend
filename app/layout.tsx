import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import AuthWrapper from "@/components/AuthWrapper";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "National Narrative Security (NNS)",
  description: "News monitoring and narrative marking system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex h-screen overflow-hidden bg-bg-base text-text-primary">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthWrapper>
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </AuthWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
