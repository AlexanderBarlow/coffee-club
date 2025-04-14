import { motion } from "framer-motion";
import Image from "next/image";

export default function FullPageLoader() {
	return (
		<div className="fixed inset-0 bg-[#fef8f2] z-50 flex flex-col items-center justify-center">
			<motion.div
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				className="relative w-32 h-32 mb-6"
			>
				<Image
					src="/images/coffee-cup.png" // Use an icon of a coffee cup with transparent background
					alt="Coffee cup"
					layout="fill"
					objectFit="contain"
				/>
				<motion.div
					className="absolute top-0 left-1/2 w-2 h-16 bg-[#6f4e37] rounded-full origin-top"
					initial={{ scaleY: 0 }}
					animate={{ scaleY: [0, 1, 0] }}
					transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
				/>
			</motion.div>

			<motion.h1
				className="text-xl font-bold text-[#6f4e37]"
				initial={{ opacity: 0 }}
				animate={{ opacity: [0, 1, 0] }}
				transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
			>
				Brewing your coffee...
			</motion.h1>
		</div>
	);
}
