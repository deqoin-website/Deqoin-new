import type { Metadata, ResolvingMetadata } from "next";
import { Manrope, Noto_Serif, Outfit, Playfair_Display, Smooch_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArchitecturalLoaderGate from "@/components/ArchitecturalLoaderGate";
import MaintenancePage from "./maintenance/page";
import connectToDatabase from "@/lib/mongodb";
import Settings from "@/models/Settings";
import Script from "next/script";
import { headers } from "next/headers";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-body" });
const notoSerif = Noto_Serif({ subsets: ["latin"], variable: "--font-headline" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-display" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif-alt" });
const smooch = Smooch_Sans({ weight: ["100", "200", "300", "400"], subsets: ["latin"], variable: "--font-smooch" });

async function getSettings() {
  try {
    await connectToDatabase();
    return await Settings.findOne({ key: "site-settings" });
  } catch (e) {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const defaultTitle = settings?.metaTitle || "Deqoin I Architectural Design Studio";
  const defaultDesc = settings?.metaDescription || "DEQOIN mimari, tasarım ve uygulama odaklı kurumsal vitrin sitesi.";
  
  return {
    title: defaultTitle,
    description: defaultDesc,
    keywords: settings?.keywords || "",
    icons: {
      icon: settings?.faviconUrl || "/favicon.png",
    },
    openGraph: {
      title: defaultTitle,
      description: defaultDesc,
      images: [settings?.logoUrl || "/images/logo-new.jpeg"],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const isMaintenance = settings?.maintenanceMode === true;
  
  // Get pathname from headers (passed via middleware)
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const isAdminPath = pathname.startsWith('/admin');

  // Script and analytics integration
  const gaId = settings?.googleAnalyticsId;
  const pixelId = settings?.metaPixelId;

  return (
    <html lang="tr" className="scroll-smooth">
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('deqoin_theme') || 'dark';
                document.documentElement.setAttribute('data-theme', theme);
              } catch (e) {}
            })();
          `
        }} />
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
        {pixelId && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${pixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
      </head>
      <body
        className={`${manrope.variable} ${notoSerif.variable} ${outfit.variable} ${playfair.variable} ${smooch.variable}`}
        suppressHydrationWarning
      >
        {isMaintenance && !isAdminPath ? (
          <MaintenancePage />
        ) : (
          <>
            {!isAdminPath && <Header />}
            {isAdminPath && <Header />} {/* Keep header for admin if needed, or modify logic */}
            {children}
            {!isAdminPath && <ArchitecturalLoaderGate logoSrc={settings?.logoUrl || "/images/logo-new.jpeg"} />}
            {!isAdminPath && <Footer />}
          </>
        )}
      </body>
    </html>
  );
}
