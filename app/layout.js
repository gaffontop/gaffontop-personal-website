import "./globals.css";

export const metadata = {
  title: "HeadSnap 360 - AI Hair & Face Shape Analyzer",
  description:
    "Explore hairstyle recommendations and preview styles with the HeadSnap 360 demo.",
};

const tailwindConfig = `tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyan: { 400: '#22d3ee', 500: '#06b6d4', glow: '#00f0ff' },
        purple: { 500: '#a855f7', 600: '#9333ea', glow: '#bd00ff' },
        darkBg: '#090d16',
        cardBg: '#111827',
        cardBorder: '#1f2937'
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(6, 182, 212, 0.4)',
        'neon-purple': '0 0 20px rgba(168, 85, 247, 0.4)',
        'neon-pulse': '0 0 30px rgba(0, 240, 255, 0.6)'
      },
      animation: {
        'scan': 'scanLine 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 10s linear infinite'
      },
      keyframes: {
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        }
      }
    }
  }
};`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.tailwind = window.tailwind || {}; ${tailwindConfig}`,
          }}
        />
        <script src="https://cdn.tailwindcss.com" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Orbitron:wght@500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-darkBg text-slate-100 selection:bg-cyan-500 selection:text-black">
        {children}
        <script src="/app.js" defer />
      </body>
    </html>
  );
}
