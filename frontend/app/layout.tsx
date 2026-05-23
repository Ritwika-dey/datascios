import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DataSciOS · Autonomous Data Scientist Platform",
  description: "Upload datasets, train ML models, generate insights — powered by AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet" />
      </head>
      <body className="noise-bg grid-bg antialiased">
        {children}
      </body>
    </html>
  );
}
