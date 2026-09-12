import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

const siteTitle = "Where to Look — Student Career Resource Guide";
const siteDescription =
  "A friendly, curated field guide to internship and career resources for college students who are not sure where to start.";
const socialTitle = "whoopberry";
const socialDescription = "Find your next opportunity.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const forwardedHost = requestHeaders.get("x-forwarded-host")?.split(",")[0];
  const host = forwardedHost ?? requestHeaders.get("host") ?? "localhost:3000";
  const forwardedProtocol = requestHeaders
    .get("x-forwarded-proto")
    ?.split(",")[0];
  const protocol =
    forwardedProtocol ?? (host.startsWith("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);
  const socialImage = new URL("/og.png", metadataBase).toString();

  return {
    metadataBase,
    title: siteTitle,
    description: siteDescription,
    applicationName: "Where to Look",
    keywords: [
      "student internships",
      "career resources",
      "college jobs",
      "internship search",
      "early career",
    ],
    icons: {
      icon: [{ url: "/favicon.png", type: "image/png", sizes: "256x256" }],
      shortcut: "/favicon.png",
      apple: "/favicon.png",
    },
    openGraph: {
      type: "website",
      siteName: socialTitle,
      title: socialTitle,
      description: socialDescription,
      images: [
        {
          url: socialImage,
          width: 1730,
          height: 909,
          alt: "whoopberry — Find your next opportunity.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
      images: [socialImage],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fff9ee",
  colorScheme: "light",
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
