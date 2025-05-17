import "./globals.css";
import { Poppins } from "next/font/google";
import ThemeRegistry from "@/components/ThemeRegistry";
import { CartProvider } from "@/context/CartContext";
import { OrderStatusProvider } from "@/context/OrderStatusContext";
import OrderStatusBanner from "@/components/OrderStatusBanner";
import CartFab from "@/components/CartFab";


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
      <body className={poppins.className}>
          <CartProvider>
            <OrderStatusProvider>
              <ThemeRegistry>
                {children}
                <OrderStatusBanner />
                <CartFab />
              </ThemeRegistry>
            </OrderStatusProvider>
          </CartProvider>
      </body>
    </html>
  );
}
