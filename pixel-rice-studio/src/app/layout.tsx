import type { Metadata } from 'next';
import { assetPath } from '@/lib/assetPath';
import './globals.css';
import './immersive.css';

export const metadata: Metadata = {
  title: 'Pixel Rice — A little different. By design.',
  description: 'An independent creative technology studio. We blend thoughtful design and playful technology into digital experiences with a little more flavour.',
  robots: { index: false, follow: false },
  icons: {icon:assetPath('/icon.svg')},
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>;
}
