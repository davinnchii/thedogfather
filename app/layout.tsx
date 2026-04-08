import type { Metadata, Viewport } from "next";
import { Inter, Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import MetaTags from "./components/MetaTags";
import { Analytics } from "@vercel/analytics/next"
import PageLoader from "./components/PageLoader";

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

export const viewport: Viewport = {
  themeColor: "#FAF8F4",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "The Dogfather",
  description: "Hundetrener og hundeinstruktør",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
    shortcut: "/logo.svg",
  },
  appleWebApp: {
    statusBarStyle: "default",
    capable: true,
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
        <MetaTags />
        <PageLoader>{children}</PageLoader>
        <Analytics />
      </body>
    </html>
  );
}

