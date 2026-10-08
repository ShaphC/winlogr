import type { Metadata } from "next";
import { Themes } from "@/components/theme";
import "./globals.css";
import "./design-refresh.css";
import "./wins.css";
export const metadata: Metadata = {
  title: "WinLog — Your career has receipts",
  description: "A private place to remember what you accomplished.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Themes>{children}</Themes>
      </body>
    </html>
  );
}
