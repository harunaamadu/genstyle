import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { siteConfig } from "@/data/site-config";

const interHeading = Inter({ subsets: ["latin"], variable: "--font-sans" });

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-heading" });

const adelia = localFont({
  src: "../../public/fonts/adelia.ttf",
  variable: "--font-adelia",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig().name + (siteConfig().version ? ` v${siteConfig().version}` : ""),
    template: "%s | %s".replace("%s", siteConfig().name),
  },
  description: siteConfig().description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "font-sans",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        montserrat.variable,
        interHeading.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
