import type { Metadata } from "next";
import "./globals.css";
import { JetBrains_Mono, Poppins } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

const jetBrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetBrains",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "LoFlo",
  description:
    "Welcome to LoFlo, a simple flashcard app. Create, study, and reinforce knowledge effortlessly.",
  generator: "Next.js",
  applicationName: "LoFlo",
  keywords: ["LoFlo", "Flashcard App"],
  creator: "AdamUhh",
  icons: {
    icon: "/logo_600x600.png",
  },
  openGraph: {
    title: "LoFlo",
    description:
      "Welcome to LoFlo, a simple flashcard app. Create, study, and reinforce knowledge effortlessly.",
    url: "https://loflo.vercel.app",
    siteName: "LoFlo",
    images: [
      {
        url: "https://loflo.vercel.app/logo_600x600.png",
        width: 600,
        height: 600,
        alt: "Loflo Logo",
      },
      {
        url: "https://loflo.vercel.app/logo_1000x1000.png",
        width: 1000,
        height: 1000,
        alt: "Loflo Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  metadataBase: new URL("https://loflo.vercel.app"),
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${jetBrains.variable} ${poppins.variable} overflow-hidden font-poppins`}
      >
        <NextTopLoader showSpinner={false} />
        {children}
      </body>
    </html>
  );
}
