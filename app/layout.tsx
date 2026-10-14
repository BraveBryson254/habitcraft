import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import "./globals.css";
import "./coach-image.css";
import { SITE, DISCLAIMER } from "@/lib/config";
import { SiteSwitcher } from "@/components/SiteSwitcher";
import { Toast } from "@/components/Toast";
import { CoachChat } from "@/components/chat/CoachChat";
import { WorkoutModalProvider } from "@/components/fitness/WorkoutModalContext";
import { BodyMode } from "@/components/BodyMode";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dmsans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Habitcraft — Train for the week you actually have",
    template: "%s · Habitcraft",
  },
  description:
    "Habitcraft: 1-on-1 online fitness and habit coaching for adults 18+, plus a curated store. Meet Coach B, our AI guide.",
  metadataBase: new URL(SITE.url),
  openGraph: { title: "Habitcraft", description: DISCLAIMER.slice(0, 150), type: "website" },
  icons: { icon: "/coach-b/favicon.png" },
};

export const viewport: Viewport = {
  themeColor: "#0a2230",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${dmSans.variable}`}>
      <body>
        <BodyMode />
        <WorkoutModalProvider>
          <SiteSwitcher />
          {children}
          <CoachChat />
          <Toast />
        </WorkoutModalProvider>
      </body>
    </html>
  );
}
