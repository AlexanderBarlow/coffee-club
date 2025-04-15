// app/api/create-checkout-session/route.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
	try {
		const body = await req.json();
		const { cartItems } = body;

		const fallbackOrigin =
			process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
		const origin = req.headers.get("origin") || fallbackOrigin;

		console.log("🧪 Origin used for Stripe redirect:", origin);

		const line_items = cartItems.map((item) => ({
			price_data: {
				currency: "usd",
				product_data: {
					name: item.name,
					images: item.imageUrl ? [item.imageUrl] : [],
				},
				unit_amount: Math.round(item.price * 100),
			},
			quantity: 1,
		}));

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items,
			mode: "payment",
			success_url: `${origin}/success`,
			cancel_url: `${origin}/cart`,
		});

		return Response.json({ url: session.url });
	} catch (error) {
		console.error("❌ Stripe checkout error:", error.message);
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
		});
	}
}
