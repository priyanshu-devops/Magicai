import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ModalProvider } from "@/components/modal-provider";
import { CrispProvider } from "@/components/ui/crisp-provider";
import CustomToast from "./utils/toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MagicAi",
  description: "AI Enhanced Multi-Function Web Platform",
  icons: {
    icon: "/favicon.ico", // Ensure this path is correct
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <CrispProvider />
          <CustomToast />
          <ModalProvider />
        <NextTopLoader 
         color="linear-gradient(to right, rgb(251, 113, 133), rgb(217, 70, 239), rgb(99, 102, 241))"
         initialPosition={0.08}
         crawlSpeed={200}
         height={3}
         crawl={true}
         showSpinner={false}
         easing="ease"
         speed={400}
         shadow="0 0 10px #2299DD,0 0 5px #2299DD"
         template='<div class="bar" role="bar"><div class="peg"></div></div> 
         <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
         zIndex={1600}
         showAtBottom={false}/>
       
        
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
