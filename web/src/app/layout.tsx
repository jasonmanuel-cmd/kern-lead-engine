import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kern Lead Engine — Real Estate Lead Intelligence",
  description: "AI-powered real estate lead generation from Kern County public records. Pre-foreclosure, probate, tax delinquent, and lien leads scored and ranked.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}