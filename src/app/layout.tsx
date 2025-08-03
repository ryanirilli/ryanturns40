import "./globals.css";
import { Lato, Erica_One } from "next/font/google";

// Configure Lato font
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-lato",
});

// Configure Erica One font
const ericaOne = Erica_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-erica-one",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={[lato.variable, ericaOne.variable].join(" ")}>
      <body>{children}</body>
    </html>
  );
}
