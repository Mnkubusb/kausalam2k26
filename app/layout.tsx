import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#ef4444",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://kausalam2k26.vercel.app/"), // Update with actual domain
  title: {
    default: "Kaushalam 2026 | GEC Bilaspur Tech Fest",
    template: "%s | Kaushalam 2026",
  },
  description:
    "Join Kaushalam 2026, the premier annual technical and cultural festival of Government Engineering College Bilaspur. Experience innovation, music, esports, and more.",
  keywords: [
    "Kaushalam 2026",
    "GEC Bilaspur",
    "Tech Fest",
    "Cultural Fest",
    "Bilaspur Engineering College",
    "Hackathon",
    "Esports",
    "Chhattisgarh Tech Fest",
  ],
  authors: [{ name: "GEC Bilaspur Tech Team" }],
  creator: "Government Engineering College Bilaspur",
  publisher: "GEC Bilaspur",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Kaushalam 2026 | Innovation Meets Culture",
    description:
      "The biggest technical and cultural fest of Central India. Join us at GEC Bilaspur for 3 days of events, workshops, and pro-nights.",
    url: "https://kausalam2k26.vercel.app/",
    siteName: "Kaushalam 2026",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // Ensure this image exists in public folder
        width: 1200,
        height: 630,
        alt: "Kaushalam 2026 - GEC Bilaspur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaushalam 2026 | GEC Bilaspur",
    description:
      "The ultimate fusion of technology and culture. Register now for Kaushalam 2026!",
    images: ["/og-image.jpg"], // Reuse OG image or specific twitter image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "verification_token", // Add actual verification token here
  },
  alternates: {
    canonical: "https://kausalam2k26.vercel.app/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Kaushalam 2026",
    startDate: "2026-03-12",
    endDate: "2026-03-14",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "Government Engineering College Bilaspur",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Koni",
        addressLocality: "Bilaspur",
        postalCode: "495009",
        addressRegion: "Chhattisgarh",
        addressCountry: "IN",
      },
    },
    image: ["https://kausalam2k26.vercel.app/screenshot.png"],
    description:
      "Kaushalam is the annual cultural and technical fest of Government Engineering College Bilaspur.",
    organizer: {
      "@type": "Organization",
      name: "GEC Bilaspur",
      url: "https://gecbsp.ac.in",
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta
          name="google-site-verification"
          content="naFh_YN9mBQJjExXIg0Ajf-_ZWlMoFjMPl3-sMU2BTs"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
