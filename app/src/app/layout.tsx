import type { Metadata } from 'next';
import './globals.css';
import { NavbarHUD } from '@/components/layout/NavbarHUD';

export const metadata: Metadata = {
  title: 'NetQuest: Protocol Architect',
  description:
    'Interactive computer networking study game and protocol simulation suite over CS303 curriculum.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090D16] text-slate-100 antialiased cyber-grid selection:bg-cyan-500/30 selection:text-cyan-200">
        <NavbarHUD />
        <main className="mx-auto max-w-7xl px-4 py-6 md:py-8">{children}</main>
      </body>
    </html>
  );
}
