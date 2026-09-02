import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: '9-Month Learning Roadmap & AI Tracker',
  description: 'Production-grade 9-month, 3-hour/day learning management and progress tracker covering SQL, Data Engineering, ML, AI/LLMs, Go, React, and DevOps with dynamic prioritization, missed task recovery, and Gemini AI assistant.',
  openGraph: {
    title: '9-Month Learning Roadmap & AI Tracker',
    description: 'Production-grade 9-month, 3-hour/day learning management and progress tracker covering SQL, Data Engineering, ML, AI/LLMs, Go, React, and DevOps with dynamic prioritization, missed task recovery, and Gemini AI assistant.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '9-Month Learning Roadmap & AI Tracker',
    description: 'Production-grade 9-month, 3-hour/day learning management and progress tracker covering SQL, Data Engineering, ML, AI/LLMs, Go, React, and DevOps with dynamic prioritization, missed task recovery, and Gemini AI assistant.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
