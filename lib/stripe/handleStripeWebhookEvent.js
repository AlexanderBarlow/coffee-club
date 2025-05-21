// lib/stripe/handleStripeWebhook.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function handleStripeWebhookEvent(event) {
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const tempCartId = session.metadata?.tempCartId;

        if (!userId || !tempCartId) {
            throw new Error("Missing userId or tempCartId in metadata");
        }

        const temp = await prisma.tempCheckout.findUnique({ where: { id: tempCartId } });
        if (!temp) throw new Error("Temp checkout not found");

        const total = session.amount_total / 100;

        await prisma.order.create({
            data: {
                userId,
                items: temp.cart,
                total,
                status: "PENDING",
                paymentStatus: "PAID",
                stripeSessionId: session.id,
            },
        });

        await prisma.tempCheckout.delete({ where: { id: tempCartId } });

        const user = await prisma.user.findUnique({ where: { id: userId } });
        const pointsEarned = Math.floor(total);
        const updatedPoints = user.points + pointsEarned;

        let newTier = "BRONZE";
        if (updatedPoints >= 1000) newTier = "VIP";
        else if (updatedPoints >= 600) newTier = "GOLD";
        else if (updatedPoints >= 400) newTier = "SILVER";

        await prisma.user.update({
            where: { id: userId },
            data: { points: updatedPoints, tier: newTier },
        });

        return { success: true };
    }

    return { ignored: true };
}
