import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { QuantumProvider } from '@/context/QuantumContext';
import { UserProvider } from '@/context/UserContext';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'QuantamStudio_Bigslayers — AI-Based Interactive Quantum Algorithm Learning Platform',
  description:
    'QuantamStudio_Bigslayers: An interactive quantum computing and algorithm learning platform. Visual quantum circuit builder, 3D Bloch sphere, real-time simulator, and AI tutor.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-50 text-slate-900 font-sans flex flex-col antialiased">
        <UserProvider>
          <QuantumProvider>{children}</QuantumProvider>
        </UserProvider>
      </body>
    </html>
  );
}
