import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "WaxChat",
  description: "connect chat and chill",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col absolute w-[100vw] h-[100vh] items-center bg-[#d5d9db] bigScreen:overflow-hidden bigScreen:p-4">
        <div className="h-[25vh] w-full bg-themecolor absolute top-0"></div>
        <div className=" flex flex-col items-center w-full bigScreen:w-[95vw]  bigScreen:h-[95vh] mx-auto relative ">
          {children}
        </div>
      </body>
    </html>
  );
}
