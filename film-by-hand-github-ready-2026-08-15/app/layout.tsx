import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "35mm, by hand — Film developing survey",
  description: "An independent research survey about the tools, spaces and realities of developing 35mm film by hand.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
