// app/api/stripe/webhook/route.js
import Stripe from "stripe";
import { headers } from "next/headers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const config = {
	api: {
		bodyParser: false,
	},
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
	try {
		const rawBody = await req.arrayBuffer();
		const bodyBuffer = Buffer.from(rawBody);
		const reqHeaders = await headers(); // ✅ FIX
		const sig = reqHeaders.get("stripe-signature");

		let event;
		try {
			event = stripe.webhooks.constructEvent(
				bodyBuffer,
				sig,
				process.env.STRIPE_WEBHOOK_SECRET
			);
		} catch (err) {
			console.error("❌ Stripe signature verification failed:", err.message);
			return new Response("Webhook Error", { status: 400 });
		}

		if (event.type === "checkout.session.completed") {
			const session = event.data.object;

			const userId = session.metadata?.userId;
			const tempCartId = session.metadata?.tempCartId;

			if (!userId || !tempCartId) {
				console.error("❌ Missing userId or tempCartId in metadata");
				return new Response("Missing metadata", { status: 400 });
			}

			const temp = await prisma.tempCheckout.findUnique({
				where: { id: tempCartId },
			});

			if (!temp) {
				console.error("❌ Temp checkout not found");
				return new Response("Not found", { status: 404 });
			}

			await prisma.order.create({
				data: {
					userId,
					items: temp.cart,
					total: session.amount_total / 100,
					status: "PENDING",
					paymentStatus: "PAID",
					stripeSessionId: session.id, // ✅ Required
				},
			});

			await prisma.tempCheckout.delete({ where: { id: tempCartId } });

			console.log(`✅ Order created for Stripe session ${session.id}`);
		}

		return new Response("OK", { status: 200 });
	} catch (err) {
		console.error("❌ Stripe webhook handler error:", err.message);
		return new Response("Internal Server Error", { status: 500 });
	}
}
