import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { NotificationListener } from "@/components/notifications/notification-listener";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SwasthSetu",
  description: "AI-Powered Hospital & Equipment Management for Patient Care Coordination",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={plusJakartaSans.variable}>
        <div className="app-shell">{children}</div>
        <NotificationListener />
        <Toaster />
      </body>
    </html>
  );
}
