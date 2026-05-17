import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/context/SmoothScroll";
import ThemeProvider from "@/context/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter", 
  display: "swap",
  preload: true,
  adjustFontFallback: true 
});
const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair", 
  display: "swap",
  preload: true,
  adjustFontFallback: true 
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" }
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://advikfurniture.com"),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Advik Furniture | Premium Furniture & Interiors",
    template: "%s | Advik Furniture"
  },
  description: "Experience luxury furniture shopping with Advik Furniture - crafted for your home with immersive 3D and cinematic design.",
  keywords: ["luxury furniture", "interior design", "3d furniture", "premium furniture", "Advik Furniture", "modern interiors", "designer furniture India"],
  authors: [{ name: "Advik Furniture" }],
  creator: "Advik Furniture",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://advikfurniture.com",
    title: "Advik Furniture | Premium Furniture & Interiors",
    description: "Experience luxury furniture shopping with Advik Furniture - crafted for your home with immersive 3D and cinematic design.",
    siteName: "Advik Furniture",
    images: [
      {
        url: "/logoAFI.png",
        width: 1200,
        height: 630,
        alt: "Advik Furniture - Premium Interiors",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Advik Furniture | Premium Furniture & Interiors",
    description: "Experience luxury furniture shopping with Advik Furniture - crafted for your home with immersive 3D and cinematic design.",
    images: ["/logoAFI.png"],
  },
  icons: {
    icon: "/logoAFI.png",
    apple: "/logoAFI.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('advik-theme');
                  var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
                  if (!theme && supportDarkMode) theme = '{"state":{"theme":"dark"}}';
                  if (theme) {
                    var themeValue = JSON.parse(theme).state.theme;
                    if (themeValue === 'dark') {
                      document.documentElement.classList.add('dark');
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Advik Furniture",
              "url": "https://advikfurniture.com",
              "logo": "https://advikfurniture.com/logoAFI.png",
              "sameAs": [
                "https://instagram.com/advikfurniture",
                "https://facebook.com/advikfurniture"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-XXXXXXXXXX",
                "contactType": "customer service",
                "areaServed": "IN",
                "availableLanguage": "en"
              }
            }),
          }}
        />
      </head>
      <body 
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-stone-50 dark:bg-stone-950 text-stone-900 transition-colors duration-500 overflow-x-hidden`}
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
              <Analytics />
              <SpeedInsights />
            </SmoothScrollProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
