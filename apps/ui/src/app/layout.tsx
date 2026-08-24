import type { Metadata } from "next";
import "./globals.css";
import "./task-log.css";
import "./conversation.css";
export const metadata: Metadata = { title: "秘書室 | AI Secretary", description: "Local-first assistant workspace for approved Codex tasks." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ja"><body>{children}</body></html>; }
