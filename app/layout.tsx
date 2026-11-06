import type { Metadata } from "next";
import "./globals.css";
import "./task-panel-focus.css";
import "./command-map-focus.css";
import "./focus-workspace.css";
import "./agent-playbook.css";

export const metadata: Metadata = {
  title: "ODIDE — The business, connected",
  description:
    "A clear path from the next step to the bigger picture. Your ODIDE visual roadmap.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
