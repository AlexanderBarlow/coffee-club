import "./globals.css";
// import { Poppins } from "next/font/google";
import ThemeRegistry from "@/components/ThemeRegistry";
import { CartProvider } from "@/context/CartContext";
import { OrderStatusProvider } from "@/context/OrderStatusContext";
import OrderStatusBanner from "@/components/OrderStatusBanner";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

export const metadata = {
  title: "Coffee Club",
  description: "Your personalized coffee app",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Coffee Club</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="application-name" content="Coffee Club" />
        <meta name="theme-color" content="#6f4e37" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>

      <body className={poppins.className}>
        <CartProvider>
          <OrderStatusProvider>
            <ThemeRegistry>
              {children}
              <OrderStatusBanner />
            </ThemeRegistry>
          </OrderStatusProvider>
        </CartProvider>
      </body>
    </html>
  );
}
