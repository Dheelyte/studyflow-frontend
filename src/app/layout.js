import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import ClientLayout from "@/components/ClientLayout";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import ToastContainer from "@/components/Toast";

export const metadata = {
  title: "Primerly",
  description: "Your personalized learning curriculum, visualized.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
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
