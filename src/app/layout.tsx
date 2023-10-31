import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Emogi",
  description: "Leave your emogi! What is your mood today?",
  metadataBase: new URL("https://emogi.yunusemre.dev"),
  openGraph: {
    title: "Emogi",
    description: "Leave your emogi! What is your mood today?",
    type: "website",
    url: "https://emogi.yunusemre.dev",
    images: "/thumbnail.png",
  },
  themeColor: "#ee7f33",
  icons: [
    {
      url: "/favicon.ico",
      href: "/favicon.ico",
      sizes: "any",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
