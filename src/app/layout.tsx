import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { QuantumProvider } from '@/context/QuantumContext';
import { UserProvider } from '@/context/UserContext';
import { QuantumMouseFollower } from '@/components/ui/QuantumMouseFollower';

const outfit = Outfit({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
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
    <html
      lang="en"
      className={`${outfit.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#FFFFE3] text-[#723480] font-sans flex flex-col antialiased selection:bg-[#DBD4FF] selection:text-[#531D5E]">
        <UserProvider>
          <QuantumProvider>
            <QuantumMouseFollower />
            {children}
          </QuantumProvider>
        </UserProvider>
      </body>
    </html>
  );
}
