import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Open Secrets PowerMapper",
  description: "by OpenUp.",
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
