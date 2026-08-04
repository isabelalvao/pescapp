import type { Metadata, Viewport } from "next";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";
import { AppHeader } from "@/components/app-header";
import { MobileNavigation } from "@/components/navigation";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: { default: "PescApp — Pesca informada em Vila do Conde", template: "%s · PescApp" },
  description: "Planeamento transparente e seguro para pesca lúdica apeada em Vila do Conde.",
  applicationName: "PescApp",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "PescApp" },
  formatDetection: { telephone: false }
};

export const viewport: Viewport = { themeColor: "#08283a", colorScheme: "light", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-PT"><body><a href="#conteudo" className="fixed left-3 top-3 z-[100] -translate-y-20 rounded-full bg-amber px-4 py-2 font-bold focus:translate-y-0">Saltar para o conteúdo</a><AppHeader /><main id="conteudo">{children}</main><MobileNavigation /><Analytics /></body></html>;
}
