import "./globals.css";
import { Poppins } from "next/font/google";
import ThemeRegistry from "@/components/ThemeRegistry";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

export const metadata = {
	title: "Coffee Club",
	description: "Your personalized coffee app",
	icons: {
		icon: "/favicon.ico",
		apple: "/icons/icon-192x192.png",
	},
	themeColor: "#6f4e37", // gets added to <meta name="theme-color">
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<head>
				<link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="theme-color" content="#6f4e37" />
			</head>
			<body className={poppins.className}>
				<ThemeRegistry>{children}</ThemeRegistry>
			</body>
		</html>
	);
}
