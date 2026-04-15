import {
  Geist,
  Geist_Mono,
  Syne,
  DM_Sans,
  Playfair_Display,
  Inter,
  Outfit,
} from "next/font/google";

import "./globals.css";
import AuthProvider from "./AuthProvider";
import { GlobalStyles } from "./SharedStyles";
import ThemeProvider from "./ThemeProvider";

// ✅ Default Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Extra Premium Fonts
const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

// ✅ Metadata
export const metadata = {
  title: "My App",
  description: "Premium UI App",
};

// ✅ Root Layout
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${syne.variable}
          ${dmSans.variable}
          ${playfair.variable}
          ${inter.variable}
          ${outfit.variable}
          antialiased
        `}
      >
        <GlobalStyles />
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}