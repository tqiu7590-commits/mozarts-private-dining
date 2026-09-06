import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mozart's Private Dining",
  description: "A fictional private dining experience in Vienna.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
