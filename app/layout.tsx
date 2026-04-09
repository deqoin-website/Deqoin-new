import type { Metadata } from "next";
import { Manrope, Noto_Serif, Outfit, Playfair_Display, Smooch_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-headline",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif-alt",
});

const smooch = Smooch_Sans({
  weight: ["100", "200", "300", "400"],
  subsets: ["latin"],
  variable: "--font-smooch",
});

export const metadata: Metadata = {
  title: " Deqoin I Design Studio ",
  description: "DEQOIN mimari, tasarim ve uygulama odakli kurumsal vitrin sitesi.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body
        className={`${manrope.variable} ${notoSerif.variable} ${outfit.variable} ${playfair.variable} ${smooch.variable}`}
        suppressHydrationWarning
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
