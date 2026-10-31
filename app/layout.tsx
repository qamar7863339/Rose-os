import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'ROSE AI OS — AI-Native Business Operating System',
  description:
    'AI-Native Business Operating System inspired by ChatGPT. Autonomous agents, agency workflows, CRM, projects, automations, and client portals in one unified operating system.',
  openGraph: {
    title: 'ROSE AI OS — AI-Native Business Operating System',
    description:
      'AI-Native Business Operating System inspired by ChatGPT. Autonomous agents, agency workflows, CRM, projects, automations, and client portals in one unified operating system.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ROSE AI OS — AI-Native Business Operating System',
    description:
      'AI-Native Business Operating System inspired by ChatGPT. Autonomous agents, agency workflows, CRM, projects, automations, and client portals in one unified operating system.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${plusJakarta.variable} ${jetbrainsMono.variable} font-sans min-h-screen bg-[#0d0d0d] text-[#f5f5f5] antialiased selection:bg-neutral-700 selection:text-white`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
