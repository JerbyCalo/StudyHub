import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata = {
  title: "Baylo",
  description:
    "Baylo — Exchange notes, files, and knowledge with your classmates.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "0.75rem",
              background: "#07363E",
              color: "#FCC823",
              fontSize: "0.875rem",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
            },
            success: {
              iconTheme: {
                primary: "#FCC823",
                secondary: "#07363E",
              },
            },
            error: {
              style: { background: "#07363E", color: "#2BCFDB" },
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
