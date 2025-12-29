import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/options";
import { computeCommission, getDefaultCommissionPercent } from "@/lib/commission";
import { stripe, requireStripeKey } from "@/lib/stripe";
import { PaymentMethod, PaymentTiming } from "@prisma/client";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { serviceId, scheduledAt, address, notes, paymentMethod, paymentTiming } = await req.json() as any;

  const email = (session as any).user?.email as string | undefined;
  const me = email ? await prisma.user.findUnique({ where: { email } }) : null;
  if (!me) return NextResponse.json({ error: "User not found" }, { status: 400 });

  const service = await prisma.service.findUnique({ where: { id: serviceId }, include: { provider: true } });
  if (!service || !service.active) return NextResponse.json({ error: "Service not available" }, { status: 404 });
  if (!service.provider.providerApproved || !service.provider.visibleOnSite) return NextResponse.json({ error: "Provider not approved" }, { status: 403 });

  const commissionPercent = service.commissionPercent ?? getDefaultCommissionPercent();
  const totalCents = service.priceCents;
  const commissionCents = computeCommission(totalCents, commissionPercent);

  const booking = await prisma.booking.create({
    data: {
      clientId: me.id,
      providerId: service.providerId,
      serviceId: service.id,
      scheduledAt: new Date(String(scheduledAt)),
      address,
      notes,
      paymentMethod: paymentMethod as PaymentMethod,
      paymentTiming: paymentTiming as PaymentTiming,
      totalCents,
      commissionCents,
      status: "RESERVED",
    },
  });

  if (paymentMethod === "CARD" && paymentTiming === "AT_RESERVATION") {
    requireStripeKey();
    const destinationAccount = service.provider.stripeAccountId || undefined;

    const pi = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: "eur",
      description: `Ayadi's booking ${booking.id} - ${service.name}`,
      metadata: { bookingId: booking.id, serviceId: service.id, providerId: service.providerId },
      application_fee_amount: commissionCents,
      ...(destinationAccount ? { transfer_data: { destination: destinationAccount } } : {}),
      automatic_payment_methods: { enabled: true },
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: { stripePaymentIntentId: pi.id, stripeStatus: pi.status },
    });

    return NextResponse.json({ ok: true, bookingId: booking.id, paymentIntentClientSecret: pi.client_secret });
  }

  return NextResponse.json({ ok: true, bookingId: booking.id });
}
