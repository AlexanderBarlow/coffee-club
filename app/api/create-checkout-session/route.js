import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {

	try {
		const body = await req.json();
		const { cartItems, userId } = body;

		if (!userId) throw new Error("Missing userId in request");

		const tempCart = await prisma.tempCheckout.create({
			data: {
				userId,
				cart: cartItems,
			},
		});

		const origin = req.headers.get("origin") || "http://localhost:3000";
		console.log("🧪 Origin used for Stripe redirect:", origin);

	const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.imageUrl?.startsWith("http")
            ? [item.imageUrl]
            : [`${origin}${item.imageUrl}`],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: 1,
    })),
    mode: "payment",
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cancel`,
    metadata: {
      userId,
      tempCartId: tempCart.id,
    },
  });


		return Response.json({ url: session.url });
	} catch (error) {
		console.error("❌ Stripe checkout error:", error.message);
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
		});
	}
}
