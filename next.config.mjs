import withPWA from "next-pwa";

const nextConfig = {
	reactStrictMode: true,
	experimental: {
		appDir: true,
		optimizeCss: false,
	},
};

export default withPWA({
	dest: "public",
	register: true,
	skipWaiting: true,
	disable: process.env.NODE_ENV === "development", // 👈 add this
})(nextConfig);
