import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bigboz = localFont({
  src: "../../public/assets/fonts/Bigboz.otf",
  variable: "--font-bigboz",
  display: "swap",
});

const mgs4Brush = localFont({
  src: "../../public/assets/fonts/MGS4 Brush.ttf",
  variable: "--font-mgs4-brush",
  display: "swap",
});

const bebasNeue = localFont({
  src: "../../public/assets/fonts/bebas-neue-pro/Bebas Neue Pro Regular.otf",
  variable: "--font-bebas",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Paradise",
  description: "Discover the ultimate experience. Unveiling soon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${bigboz.variable} ${mgs4Brush.variable} ${bebasNeue.variable}`} suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=arrow_back,close" />
        <link rel="preload" as="video" href="https://828w0y4x5k.ufs.sh/f/STslBtUPAU3wUC04S1PB6LbOpi8KV4SN5ZoxheqRcCyFrX3D" type="video/mp4" />
        <link rel="preload" as="video" href="https://828w0y4x5k.ufs.sh/f/STslBtUPAU3wUh13e5PB6LbOpi8KV4SN5ZoxheqRcCyFrX3D" type="video/mp4" />
      </head>
      <body>{children}</body>
    </html>
  );
}
