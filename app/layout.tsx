import type { Metadata } from "next";
import NextTopLoader from 'nextjs-toploader';
import { Inter } from "next/font/google";
import "./globals.css";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from './providers'
import { ModalProvider } from "@/components/modal-provider";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { CrispProvider } from "@/components/ui/crisp-provider";
import { Toaster } from "react-hot-toast";
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
    <html lang='en'>
      <CrispProvider/>
      <CustomToast/>
      
      <body>
        <ModalProvider/>
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
