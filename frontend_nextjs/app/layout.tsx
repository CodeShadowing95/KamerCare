import type React from "react"
import type { Metadata } from "next"
import { Inter, Manrope } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: "KamerCare - Accueil",
  description: "Plateforme officielle de prise de rendez-vous dans les hôpitaux publics du Cameroun",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/KamerCare-logo.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/KamerCare-logo.png",
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${manrope.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
