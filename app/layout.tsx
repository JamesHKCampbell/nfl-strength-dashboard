import type { Metadata } from "next";
import Script from 'next/script';
import "./globals.css";

export const metadata: Metadata = {
  title: "NFL Team Strength Network Model (2024-2025)",
  description: "A robust measure of NFL team strength, accounting for strength of opponents in a network model. Built by James H. K. Campbell",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=G-YYV94NXKTD`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
          >
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-YYV94NXKTD');
            `}
          </Script>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}