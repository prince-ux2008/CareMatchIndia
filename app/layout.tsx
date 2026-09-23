import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HealthcareChatbot } from '@/components/chat/HealthcareChatbot';

export const metadata: Metadata = {
  title: 'CAREMATCH INDIA — Find hospitals that match your healthcare needs.',
  description:
    'National AI Healthcare Discovery, Intelligent Hospital Matching & Visual Care Assistance Platform. Find, understand, compare capabilities, and navigate verified hospital registries across India without fake medical claims.',
  keywords: [
    'CareMatch India',
    'AI Healthcare Discovery',
    'Intelligent Hospital Matching',
    'Hospital search India',
    'Check My Case',
    'Ayushman Bharat PM-JAY',
    'NABH Accredited Hospitals',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-navy-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-navy-950">
        {/* Animated Background Mesh & Floating Lights */}
        <div className="animated-bg">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>

        <AppProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <HealthcareChatbot />
        </AppProvider>
      </body>
    </html>
  );
}
