import "./globals.css";
import { Lato, Kavoon } from "next/font/google";

// Configure Lato font
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-lato",
});

// Configure Kavoon font
const kavoon = Kavoon({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-kavoon",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={[lato.variable, kavoon.variable].join(" ")}>
      <body>{children}</body>
    </html>
  );
}
