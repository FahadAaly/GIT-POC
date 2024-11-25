import Navbar from "./components/Navbar/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

// Shared metadata for the whole app
export const metadata = {
  title: "GitOps POC",
  description: "A GitOps proof-of-concept application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
