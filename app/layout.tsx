import type { Metadata } from "next";
import "./globals.scss";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  title: "PowerMapper by Open Secrets",
  description:
    "Discover the PowerMapper by Open Secrets: An interactive tool that maps and profiles key power players benefiting from the climate crisis and the transition to renewables in South Africa.",
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
        <meta
          property="og:url"
          content="https://powermapper.opensecrets.org.za/"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="PowerMapper by Open Secrets" />
        <meta
          property="og:description"
          content="Discover the PowerMapper by Open Secrets: An interactive tool that maps and profiles key power players benefiting from the climate crisis and the transition to renewables in South Africa"
        />
        <meta
          property="og:image"
          content="https://powermapper.opensecrets.org.za/_next/static/media/intro.0b4ef957.png"
        />
        <meta property="og:image:width" content="516" />
        <meta property="og:image:height" content="206" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:domain"
          content="powermapper.opensecrets.org.za"
        />
        <meta
          property="twitter:url"
          content="https://powermapper.opensecrets.org.za/"
        />
        <meta name="twitter:title" content="PowerMapper by Open Secrets" />
        <meta
          name="twitter:description"
          content="Discover the PowerMapper by Open Secrets: An interactive tool that maps and profiles key power players benefiting from the climate crisis and the transition to renewables in South Africa"
        />
        <meta
          name="twitter:image"
          content="https://powermapper.opensecrets.org.za/images/intro.png"
        ></meta>
      </head>
      <body>{children}</body>
    </html>
  );
}
