import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "react-datepicker/dist/react-datepicker.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const englishSans = localFont({
  variable: "--font-roboto",
  display: "swap",
  src: [
    { path: "./fonts/sf-ui-display-thin-58646e9b26e8b.woff", weight: "100", style: "normal" },
    { path: "./fonts/sf-ui-display-ultralight-58646b19bf205.woff", weight: "200", style: "normal" },
    { path: "./fonts/sf-ui-display-light-58646b33e0551.woff", weight: "300", style: "normal" },
    { path: "./fonts/sf-ui-display-medium-58646be638f96.woff", weight: "400", style: "normal" },
    { path: "./fonts/sf-ui-display-medium-58646be638f96.woff", weight: "500", style: "normal" },
    { path: "./fonts/sf-ui-display-semibold-58646eddcae92.woff", weight: "600", style: "normal" },
    { path: "./fonts/sf-ui-display-bold-58646a511e3d9.woff", weight: "700", style: "normal" },
    { path: "./fonts/sf-ui-display-heavy-586470160b9e5.woff", weight: "800", style: "normal" },
    { path: "./fonts/sf-ui-display-black-58646a6b80d5a.woff", weight: "900", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Complaint to Legal Taskforce",
  description:
    "Typeform-style single-question flow to submit complaints with photo/video uploads.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${englishSans.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-50 text-neutral-900`}
      >
        {children}
      </body>
    </html>
  );
}
