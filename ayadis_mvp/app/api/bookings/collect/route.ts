import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/options";
import { stripe, requireStripeKey } from "@/lib/stripe";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { bookingId } = await req.json() as { bookingId: string };

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: { include: { provider: true } } },
  });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const role = (session as any).role;
  const email = (session as any).user?.email as string;
  const me = await prisma.user.findUnique({ where: { email } });
  if (!me) return NextResponse.json({ error: "User not found" }, { status: 400 });

  const isOwnerProvider = role === "PROVIDER" && me.id === booking.providerId;
  const isAdmin = role === "ADMIN";
  if (!isOwnerProvider && !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (booking.paymentMethod !== "CARD" || booking.paymentTiming !== "AT_SERVICE") {
    return NextResponse.json({ error: "Not eligible" }, { status: 400 });
  }
  if (booking.stripePaymentIntentId) {
    return NextResponse.json({ ok: true, bookingId, paymentIntentAlreadyCreated: true });
  }

  requireStripeKey();
  const destinationAccount = booking.service.provider.stripeAccountId || undefined;

  const pi = await stripe.paymentIntents.create({
    amount: booking.totalCents,
    currency: "eur",
    description: `Ayadi's booking ${booking.id} - ${booking.service.name}`,
    metadata: { bookingId: booking.id, serviceId: booking.serviceId, providerId: booking.providerId },
    application_fee_amount: booking.commissionCents,
    ...(destinationAccount ? { transfer_data: { destination: destinationAccount } } : {}),
    automatic_payment_methods: { enabled: true },
  });

  await prisma.booking.update({
    where: { id: booking.id },
    data: { stripePaymentIntentId: pi.id, stripeStatus: pi.status },
  });

  return NextResponse.json({ ok: true, bookingId: booking.id, paymentIntentClientSecret: pi.client_secret });
}
