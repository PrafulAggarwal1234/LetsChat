import { Inter } from "next/font/google";
import "./globals.css";
import AppContext from "@/context/AppContext";
import { ChakraProvider } from "@chakra-ui/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chat App",
  description: "Chat Securely & Freely!",
  icons: {
    icon: '/next.svg', // /public path
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ChakraProvider>
          <AppContext>
            {children}
          </AppContext>
          </ChakraProvider>
        </body>
    </html>
  );
}
