import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/context/SmoothScroll";
import ThemeProvider from "@/context/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Advik Furniture | Premium Furniture & Interiors",
  description: "Experience luxury furniture shopping with Advik Furniture - crafted for your home with immersive 3D and cinematic design.",
  icons: {
    icon: "/logoAFI.png",
    apple: "/logoAFI.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-stone-50 dark:bg-stone-950 text-stone-900 transition-colors duration-500`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <SessionProvider>
            <SmoothScrollProvider>
              <Navbar />
              <main className="min-h-screen">
                {children}
              </main>
              <Footer />
              <Toaster position="top-center" richColors />
            </SmoothScrollProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
