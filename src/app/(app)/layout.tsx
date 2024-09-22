

// 'use client';

// import { SessionProvider } from 'next-auth/react';
// import Navbar from '@/components/navbar';


// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>
//       <SessionProvider>
//       <div className="flex flex-col min-h-screen">
//         <Navbar />
//         {children}
//       </div>
//     </SessionProvider>





//       </body>
//     </html>
//   );
// }

import Navbar from "@/components/navbar";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {children}
    </div>
  );
}