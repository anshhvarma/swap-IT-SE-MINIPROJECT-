import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "./(dashboard)/_components/navbar";
import Sidebar from "./(dashboard)/_components/sidebar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
           <div className='h-full'>
        {/* Header */}
           <header className='h-20 md:pl-56 fixed insert-y-0 w-full z-50'>
            <Navbar />
            </header> 
        {/* sidebar */}
        <div className='hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50'>
            <Sidebar />
        </div>

        <main className='md:pl-56 pt-20'>
            {children}
        </main>
    </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
