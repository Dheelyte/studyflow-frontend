import "./globals.css";
import Script from "next/script";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, TWITTER_HANDLE } from "@/lib/site";
import { ThemeProvider } from "@/components/ThemeProvider";
import ClientLayout from "@/components/ClientLayout";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import ToastContainer from "@/components/Toast";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s | Primerly',
    default: 'Primerly',
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
  },
  icons: {
    icon: [
      { url: '/Primerly Logo.png', type: 'image/png' },
    ],
    shortcut: '/Primerly Logo.png',
    apple: '/Primerly Logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JZ7SZ2XTF6"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-JZ7SZ2XTF6');
          `}
        </Script>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <ClientLayout>
                {children}
              </ClientLayout>
              <ToastContainer />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
