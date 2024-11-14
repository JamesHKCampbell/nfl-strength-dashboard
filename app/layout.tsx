import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NFL Team Strength Network Model",
  description: "A more robust measure of NFL team strength, accounting for strength of opponents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
