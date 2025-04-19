"use client";

import Button from "@/components/Button";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Box, Typography, IconButton } from "@mui/material";
import BottomTabBar from "@/components/MobileNavbar";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // already in your project


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

	const [user, setUser] = useState(null);

	useEffect(() => {
		const getSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			setUser(session?.user || null);
		};
		getSession();
	}, []);


  const [featuredDrinks, setFeaturedDrinks] = useState([]);

	useEffect(() => {
		const fetchFeatured = async () => {
			try {
				const res = await fetch("/api/drinks/featured");
				const data = await res.json();

				if (Array.isArray(data)) {
					setFeaturedDrinks(data);
				} else {
					console.error("Expected an array but got:", data);
					setFeaturedDrinks([]); // fallback
				}
			} catch (err) {
				console.error("Failed to fetch featured drinks", err);
				setFeaturedDrinks([]);
			}
		};

		fetchFeatured();
	}, []);


    const sliderRef = useRef(null);

    const [sliderInstanceRef, slider] = useKeenSlider({
      loop: true,
      mode: "snap",
      slides: {
        perView: 1.2,
        spacing: 16,
      },
      breakpoints: {
        "(min-width: 640px)": {
          slides: { perView: 2.25, spacing: 20 },
        },
        "(min-width: 1024px)": {
          slides: { perView: 3, spacing: 24 },
        },
      },
    });

    const scrollLeft = () => {
      if (slider) slider.current?.prev();
    };

    const scrollRight = () => {
      if (slider) slider.current?.next();
    };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fff9f6] to-[#fefefe] text-[#3e3028]">
      <BottomTabBar />

      {/* Hero */}
      <section className="relative text-center py-24 px-4 max-w-4xl mx-auto overflow-hidden">
        <motion.h1
          className="text-5xl sm:text-6xl font-bold mb-6 z-10 relative"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Welcome to Coffee Club ☕
        </motion.h1>

        <motion.p
          className="text-xl sm:text-2xl text-gray-600 mb-10 z-10 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Your personalized coffee experience, one cup at a time.
        </motion.p>

        {!user && (
          <motion.div
            className="flex justify-center gap-5 z-10 relative"
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

        <motion.div
          className="absolute top-[-20px] right-[-5px] opacity-10 pointer-events-none"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
        >
          <Image
            src="/images/display.png"
            alt="Hero cup"
            width={300}
            height={300}
            className="rounded-full"
          />
        </motion.div>
      </section>

      <section className="bg-[#f3f1ee] py-16 px-4">
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
              {
                title: "Raw Dairy",
                desc: "Unprocessed & fresh from local farms 🥛",
              },
              {
                title: "Daily Fresh Roasts",
                desc: "Roasted every morning for peak flavor ☀️",
              },
              {
                title: "Organic Products",
                desc: "Free from additives and chemicals 🌱",
              },
              {
                title: "Locally Sourced",
                desc: "Supporting small nearby businesses 🏡",
              },
              {
                title: "Fresh Deliveries",
                desc: "Daily milk and pastry restocks 🚚",
              },
              { title: "Custom Blends", desc: "Made to match your vibe 🎨" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="min-w-[240px] flex-shrink-0 sm:min-w-0 bg-white p-5 rounded-xl shadow-md"
                whileHover={{ scale: 1.03 }}
              >
                <h4 className="font-semibold text-lg mb-1">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🌟 Featured Coffees Carousel */}
      <section className="bg-[#f3f1ee] py-14 px-4">
        <div className="max-w-6xl mx-auto relative">
          <Typography variant="h5" fontWeight={600} gutterBottom>
            🌟 Featured Coffees
          </Typography>

          {/* Arrows */}
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

          {/* Slider */}
          <div ref={sliderInstanceRef} className="keen-slider mt-6">
            {featuredDrinks.length === 0 ? (
              <p className="text-center text-gray-500">
                No featured drinks available.
              </p>
            ) : (
              <div ref={sliderInstanceRef} className="keen-slider mt-6">
                {featuredDrinks.map((drink) => (
                  <div key={drink.id} className="keen-slider__slide px-1">
                    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full">
                      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col items-center text-center h-full p-4">
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

      {/* User Reviews */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <Typography variant="h5" fontWeight={600} gutterBottom>
            💬 What Our Users Say
          </Typography>
          <div className="grid sm:grid-cols-3 gap-6 mt-6">
            {[
              "Best coffee rewards app ever!",
              "Smooth design & easy to use.",
              "I never miss my morning brew!",
            ].map((quote, idx) => (
              <motion.div
                key={idx}
                className="bg-[#f9f9f9] rounded-2xl p-5 shadow"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <p className="text-gray-700 italic">“{quote}”</p>
                <p className="text-sm text-gray-500 mt-2">
                  - Happy User #{idx + 1}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
