import './globals.css';
import { Instrument_Sans, Newsreader } from 'next/font/google';
import { MotionProvider } from '../components/Motion';

const display = Newsreader({ subsets: ['latin'], variable: '--font-display', style: ['normal', 'italic'], display: 'swap' });
const body = Instrument_Sans({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

const title = 'Cognexy — Jawaban bisnis, dengan sumber yang jelas';

export const metadata = {
  title,
  description: 'Cognexy membantu tim menjawab pertanyaan dari dokumen bisnisnya sendiri, dengan kutipan sumber yang bisa diperiksa.',
  robots: 'index,follow',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'Cognexy',
    title,
    description: 'Rapikan pengetahuan usaha, tanya dalam bahasa sehari-hari, dan periksa kalimat sumbernya.',
  },
  twitter: { card: 'summary' },
};

export const viewport = { themeColor: '#f5f1e8' };

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Cognexy',
  inLanguage: 'id-ID',
  description: 'Ruang kerja pengetahuan bisnis dengan jawaban yang merujuk pada sumber.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${display.variable} ${body.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}