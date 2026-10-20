import type { Metadata, Viewport } from "next";
import { Inter, Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import PageLoader from "./components/PageLoader";
import JsonLd from "./components/JsonLd";
import { getSiteUrl } from "./lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  themeColor: "#FAF8F4",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "The Dogfather – Hundelufting, dagpass og trening i Skien",
    template: "%s | The Dogfather",
  },
  description:
    "Hundelufting, dagpass, døgnpass og privat hundetrening i Skien. Trygghet, struktur og relasjon – hos The Dogfather.",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
    shortcut: "/logo.svg",
  },
  appleWebApp: {
    statusBarStyle: "default",
    capable: true,
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: siteUrl,
    siteName: "The Dogfather",
    title: "The Dogfather – Hundelufting, dagpass og trening i Skien",
    description:
      "Hundelufting, dagpass, døgnpass og privat hundetrening i Skien. Trygghet, struktur og relasjon.",
    images: [
      {
        url: "/hero.jpg",
        width: 1200,
        height: 630,
        alt: "The Dogfather – hundepass og trening i Skien",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Dogfather – Hundelufting, dagpass og trening i Skien",
    description:
      "Hundelufting, dagpass, døgnpass og privat hundetrening i Skien.",
    images: ["/hero.jpg"],
  },
  alternates: {
    canonical: "/",
  },
  other: {
    "apple-mobile-web-app-status-bar-style": "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no" data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${poppins.variable} ${montserrat.variable} font-poppins antialiased`}
        data-default-font="poppins"
      >
        <JsonLd />
        <PageLoader>{children}</PageLoader>
        <Analytics />
      </body>
    </html>
  );
}
