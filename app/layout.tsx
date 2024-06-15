import type { Metadata } from "next";
import "./globals.scss";
import GoogleAnalytics from "@/components/GoogleAnalytics";


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
      <head>
        <GoogleAnalytics />
      </head>
      <body>{children}</body>
    </html>
  );
}
