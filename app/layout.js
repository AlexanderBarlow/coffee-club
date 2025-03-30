import "./globals.css";
import { Poppins } from "next/font/google";
import ThemeRegistry from "@/components/ThemeRegistry";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

export const metadata = {
  title: "Coffee Club",
  description: "Your personalized coffee rewards and menu app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
