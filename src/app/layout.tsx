import type { Metadata } from "next";
import { Geist, Geist_Mono, Dancing_Script } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yalawildspirit.com"),
  title: "Yala Wild Spirit - Yala Safari & Tours",
  description: "Yala Safari & Tours in Sri Lanka with Yala Wild Spirit. (Vibushana Yala)",
  keywords: ["yala wild spirit", "yala safari", "yala safari tours", "sri lanka safari", "yala national park", "yala tours", "yala jeep safari", "yala tour packages"],
  authors: [
    {
      name: "Yala Wild Spirit",
      url: "https://yalawildspirit.com",
    },
  ],
  creator: "Vibushana Yala",
  openGraph: {
    title: "Yala Wild Spirit - Yala Safari & Tours",
    description: "Yala Safari & Tours in Sri Lanka with Yala Wild Spirit. (Vibushana Yala)",
    url: "https://yalawildspirit.com",
    siteName: "Yala Wild Spirit",
    images: ["/assets/images/about1.jpg"],
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yala Wild Spirit - Yala Safari & Tours',
    description: 'Yala Safari & Tours in Sri Lanka with Yala Wild Spirit. (Vibushana Yala)',
    images: ['/assets/images/about1.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} antialiased`}
      >
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}