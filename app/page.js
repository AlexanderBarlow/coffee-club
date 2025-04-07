"use client";

import Button from "@/components/Button";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import BottomTabBar from "@/components/MobileNavbar";

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

        <motion.div
          className="absolute bottom-[-20px] right-[-40px] opacity-10 pointer-events-none"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
        >
          <Image
            src="/images/caramel-cloud.jpg"
            alt="Hero cup"
            width={300}
            height={300}
            className="rounded-full"
          />
        </motion.div>
      </section>

      {/* Featured Coffees */}
      <section className="bg-[#f3f1ee] py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <Typography variant="h5" fontWeight={600} gutterBottom>
            🌟 Featured Coffees
          </Typography>
          <div className="grid sm:grid-cols-3 gap-6 mt-6">
            {[1, 2, 3].map((id) => (
              <motion.div
                key={id}
                whileHover={{ scale: 1.05, rotate: [-1, 1, 0] }}
                className="bg-white p-4 rounded-2xl shadow transition-all duration-300"
              >
                <Image
                  src={`/images/caramel-cloud.jpg`}
                  alt={`Coffee ${id}`}
                  width={300}
                  height={200}
                  className="rounded-xl object-cover w-full h-40"
                />
                <h4 className="font-semibold text-lg mt-3">
                  Deluxe Brew #{id}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  A rich, smooth blend brewed to perfection.
                </p>
              </motion.div>
            ))}
          </div>
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
    </main>
  );
}
