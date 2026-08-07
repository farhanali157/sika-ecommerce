import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/auth"
import WhatsAppButton from "@/components/whatsapp-button"
import { prisma } from "@/lib/prisma"
import { AnnouncementBar, AnnouncementItem } from "@/components/announcement-bar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sika Pakistan | Construction Solutions",
  description: "Official E-commerce Store for Sika Construction Chemicals",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  const settings = await prisma.storeSetting.findFirst().catch(() => null)

  let announcementMessages: AnnouncementItem[] = []
  try {
    if (settings?.announcementMessages) {
      const parsed = JSON.parse(settings.announcementMessages)
      if (Array.isArray(parsed)) {
        announcementMessages = parsed.map((m) =>
          typeof m === "string" ? { text: m, textColor: "#ffffff" } : m
        )
      }
    }
  } catch {
    announcementMessages = [{ text: "🎉 SIKA STOREWIDE SALE LIVE NOW!", textColor: "#ffffff" }]
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          {/* Sticky Header Wrapper locking both Announcement Bar and Navbar */}
          <header className="sticky top-0 z-50 w-full shadow-sm">
            <AnnouncementBar
              messages={announcementMessages}
              bgColor={settings?.announcementBgColor || "#171717"}
              isActive={settings?.isAnnouncementActive ?? false}
            />
            <Navbar />
          </header>

          <div className="relative flex min-h-[calc(100vh-120px)] flex-col justify-between">
            <main>{children}</main>
            <Footer />
          </div>

          {/* Floating WhatsApp button renders globally */}
          <WhatsAppButton />
        </SessionProvider>
      </body>
    </html>
  )
}