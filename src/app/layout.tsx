import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import '@/src/app/globals.css';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { ThemeProvider } from '@/src/app/components/theme/ThemeContext';
import { fontVariableClassNames } from '@/src/app/components/theme/fontTokens';
import { BoardProvider } from "./components/kanban/context/BoardContext";

export const metadata: Metadata = {
  title: "Job Tracker",
  description: "Loyal companion on your carrer journey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" data-theme="light">
      <body
        className={`${fontVariableClassNames} antialiased`}
      >
        <ThemeProvider>
          <GluestackUIProvider mode="light">
            <BoardProvider>
              {children}
            </BoardProvider>
          </GluestackUIProvider>
        </ThemeProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
