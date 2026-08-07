import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/auth"
import WhatsAppButton from "@/components/whatsapp-button"
import { prisma } from "@/lib/prisma"
import { AnnouncementBar } from "@/components/announcement-bar"

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

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <AnnouncementBar
            text={settings?.announcementText || ""}
            bgColor={settings?.announcementBgColor || "#171717"}
            textColor={settings?.announcementTextColor || "#ffffff"}
            isActive={settings?.isAnnouncementActive ?? false}
          />
          <div className="relative flex min-h-screen flex-col justify-between">
            <div>
              <Navbar />
              <main>{children}</main>
            </div>
            <Footer />
          </div>

          {/* Floating WhatsApp button renders globally */}
          <WhatsAppButton />
        </SessionProvider>
      </body>
    </html>
  )
}