"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Button from "@/components/Button";
import BottomTabBar from "@/components/MobileNavbar";
import { Avatar, Typography, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const steps = [
	{
		title: "Select Your Style",
		description:
			"Choose from a variety of brews: iced, hot, espresso, and more.",
		emoji: "☕",
	},
	{
		title: "Customize & Order",
		description:
			"Add extras, adjust sweetness, and order straight from the app.",
		emoji: "🛠️",
	},
	{
		title: "Brewed to Perfection",
		description: "Baristas prepare your drink just the way you like it.",
		emoji: "👨‍🍳",
	},
	{
		title: "Sip & Earn Rewards",
		description: "Enjoy your coffee and collect points with every purchase.",
		emoji: "🎉",
	},
];

export default function LandingPage() {
	const router = useRouter();
	const [user, setUser] = useState(null);
	const [featuredDrinks, setFeaturedDrinks] = useState([]);
	const [realReviews, setRealReviews] = useState([]);

	const [sliderInstanceRef, slider] = useKeenSlider({
		loop: true,
		mode: "snap",
		slides: { perView: 1.2, spacing: 16 },
		breakpoints: {
			"(min-width: 640px)": { slides: { perView: 2.25, spacing: 20 } },
			"(min-width: 1024px)": { slides: { perView: 3, spacing: 24 } },
		},
	});

	const scrollLeft = () => slider?.current?.prev();
	const scrollRight = () => slider?.current?.next();

	useEffect(() => {
		// 1) Guard: if JWT cookie exists and role ≠ "USER", redirect into /admin
		const guardAdmin = () => {
			const match = document.cookie
				.split("; ")
				.find((row) => row.startsWith("cc_token="));
			const token = match?.split("=")[1];
			if (!token) return;
			try {
				// decode payload
				const b64 = token.split(".")[1];
				const json = atob(b64.replace(/-/g, "+").replace(/_/g, "/"));
				const { role } = JSON.parse(json);
				if (role && role !== "USER") {
					router.replace("/admin");
				}
			} catch (e) {
				console.error("Failed to decode cc_token:", e);
			}
		};

		// 2) Standard Supabase session check
		const getSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			setUser(session?.user || null);
		};

		// 3) Fetch featured drinks
		const fetchFeatured = async () => {
			try {
				const res = await fetch("/api/drinks/featured");
				const data = await res.json();
				setFeaturedDrinks(Array.isArray(data) ? data : []);
			} catch (err) {
				console.error("Error loading featured drinks:", err);
			}
		};

		// 4) Fetch real reviews
		const fetchReviews = async () => {
			try {
				const res = await fetch("/api/reviews");
				const data = await res.json();
				setRealReviews(Array.isArray(data) ? data : []);
			} catch (err) {
				console.error("Error loading reviews:", err);
			}
		};

		guardAdmin();
		getSession();
		fetchFeatured();
		fetchReviews();
	}, [router]);

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#fff9f6] to-[#fefefe] text-[#3e3028] overflow-hidden">
      <BottomTabBar />
      {/* Floating Beans */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[
          { top: "10%", left: "20%" },
          { top: "5%", left: "80%" },
        ].map((pos, i) => (
          <motion.img
            key={i}
            src="/images/coffee-bean.png"
            alt="Floating Coffee Bean"
            className="absolute w-4 h-4 opacity-30"
            style={{ top: pos.top, left: pos.left }}
            animate={{ y: [0, -15, 0] }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Hero */}
      <section className="relative text-center py-24 px-4 max-w-4xl mx-auto z-10">
        <motion.h1
          className="text-5xl sm:text-6xl font-bold mb-6 relative"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Welcome to Coffee Club ☕
          <span className="absolute inset-0 blur-2xl opacity-30 bg-gradient-to-r from-[#ffecd2] to-[#fcb69f] rounded-xl -z-10" />
        </motion.h1>
        <motion.p
          className="text-xl sm:text-2xl text-gray-600 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Your personalized coffee experience, one cup at a time.
        </motion.p>
        {!user && (
          <motion.div
            className="flex justify-center gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/signup">
              <Button className="rounded-full px-6 py-2 text-lg shadow-lg hover:shadow-2xl hover:brightness-105 transition">
                Sign Up
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                className="rounded-full px-6 py-2 text-lg border-[#6f4e37] hover:bg-[#6f4e37]/10 transition"
              >
                Log In
              </Button>
            </Link>
          </motion.div>
        )}
      </section>

      {/* Why We're Different */}
      <section className="bg-[#f3f1ee] py-16 px-4 pb-2">
        <div className="max-w-5xl mx-auto text-center">
          <Typography variant="h5" fontWeight={700} gutterBottom>
            🌿 Why We're Different
          </Typography>
          <Typography variant="body1" className="text-gray-600 mb-8">
            Coffee Club is committed to quality ingredients and local
            partnerships.
          </Typography>
          <div className="flex gap-4 overflow-x-auto sm:grid sm:grid-cols-2 md:grid-cols-3 sm:overflow-visible pb-4">
            {[
              "Raw Dairy",
              "Daily Fresh Roasts",
              "Organic Products",
              "Locally Sourced",
              "Fresh Deliveries",
              "Custom Blends",
            ].map((title, idx) => (
              <motion.div
                key={idx}
                className="min-w-[240px] flex-shrink-0 sm:min-w-0 bg-white p-5 rounded-xl shadow-md"
                whileHover={{ scale: 1.03 }}
              >
                <h4 className="font-semibold text-lg mb-1">{title}</h4>
                <p className="text-sm text-gray-500">
                  Quality and freshness you can taste.
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Coffees */}
      <section className="bg-[#f3f1ee] py-14 px-4">
        <div className="max-w-6xl mx-auto relative">
          <Typography variant="h5" fontWeight={600} gutterBottom>
            🌟 Featured Coffees
          </Typography>
          <div className="hidden lg:flex absolute top-[50%] -translate-y-1/2 left-[-30px] z-10">
            <IconButton onClick={scrollLeft}>
              <ChevronLeft fontSize="large" />
            </IconButton>
          </div>
          <div className="hidden lg:flex absolute top-[50%] -translate-y-1/2 right-[-30px] z-10">
            <IconButton onClick={scrollRight}>
              <ChevronRight fontSize="large" />
            </IconButton>
          </div>
          <div className="mt-6">
            {featuredDrinks.length === 0 ? (
              <p className="text-center text-gray-500">
                No featured drinks available.
              </p>
            ) : (
              <div
                ref={sliderInstanceRef}
                className="keen-slider transition-transform duration-300 will-change-transform"
              >
                {featuredDrinks.map((drink) => (
                  <div
                    key={drink.id}
                    className="keen-slider__slide px-2"
                    style={{
                      minWidth: "240px",
                      maxWidth: "260px",
                      transform: "translateZ(0)",
                    }}
                  >
                    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col items-center text-center p-4 h-full">
                      <Image
                        src={drink.imageUrl || "/images/fallback.jpg"}
                        alt={drink.name}
                        width={220}
                        height={220}
                        className="object-contain rounded-xl mb-4"
                      />
                      <h4 className="font-semibold text-lg">{drink.name}</h4>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {drink.description}
                      </p>
                      <p className="text-md font-semibold text-[#6f4e37] mt-2">
                        ${drink.price?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Coffee Journey */}
      <section className="py-20 px-4 bg-[#6f4e37] text-white">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Typography variant="h4" fontWeight={700} gutterBottom>
            🔥 Your Coffee Journey
          </Typography>
          <p className="text-lg text-neutral-200">
            From beans to brew, we personalize every sip just for you.
          </p>
        </div>
        <div className="relative max-w-2xl mx-auto border-l-4 border-white/20 pl-6 space-y-12">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="relative pl-10"
            >
              <div className="absolute left-[-26px] top-1 bg-white text-[#6f4e37] w-10 h-10 flex items-center justify-center rounded-full text-xl font-bold shadow-md border-2 border-[#6f4e37]">
                {step.emoji}
              </div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-neutral-200 mt-1">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Real Reviews */}
      <section className="py-20 px-4 bg-white z-10 relative">
        <div className="max-w-5xl mx-auto text-center">
          <Typography variant="h5" fontWeight={600} gutterBottom>
            💬 What Our Users Say
          </Typography>
          <div className="grid sm:grid-cols-3 gap-6 mt-6">
            {realReviews.length === 0 ? (
              <p className="text-gray-500 text-center col-span-full">
                No reviews yet.
              </p>
            ) : (
              realReviews.slice(0, 6).map((review, idx) => (
                <motion.div
                  key={review.id}
                  className="bg-[#f9f9f9] rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar>
                      {review.user?.email?.charAt(0)?.toUpperCase() || "U"}
                    </Avatar>
                    <p className="font-medium text-gray-800">
                      {review.user?.email?.split("@")[0] || `User #${idx + 1}`}
                    </p>
                    <span className="ml-auto text-yellow-400">
                      {Array(review.rating).fill("⭐").join("")}
                    </span>
                  </div>
                  <p className="text-gray-600 italic">“{review.comment}”</p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
