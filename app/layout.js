import "./globals.css";
import { Poppins } from "next/font/google";
import ThemeRegistry from "@/components/ThemeRegistry";
import { CartProvider } from "@/context/CartContext";
import { OrderStatusProvider } from "@/context/OrderStatusContext";
import OrderStatusBanner from "@/components/OrderStatusBanner";
import CartFab from "@/components/CartFab";
import Footer from "@/components/Footer";

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
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={poppins.className}>
        <CartProvider>
          <OrderStatusProvider>
            <ThemeRegistry>
              {children}
              <OrderStatusBanner />
              <CartFab />
              <Footer />
            </ThemeRegistry>
          </OrderStatusProvider>
        </CartProvider>
      </body>
    </html>
  );
}
