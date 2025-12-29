"use client";
import { Card, Container, Button } from "@/components/ui";
import { useState } from "react";

export default function BookingPage({ searchParams }: { searchParams: any }) {
  const [msg, setMsg] = useState<string>("");

  const payload = {
    serviceId: String(searchParams.serviceId ?? ""),
    scheduledAt: new Date(String(searchParams.scheduledAt ?? "")).toISOString(),
    address: String(searchParams.address ?? ""),
    paymentMethod: String(searchParams.paymentMethod ?? "CARD"),
    paymentTiming: String(searchParams.paymentTiming ?? "AT_RESERVATION"),
  };

  async function createBooking() {
    setMsg("Création...");
    const res = await fetch("/api/bookings/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data.error || "Erreur");
    setMsg(data.paymentIntentClientSecret ? "Réservation créée. Paiement Stripe à brancher (client secret reçu)." : "Réservation créée.");
  }

  return (
    <Container>
      <h1 className="text-2xl font-semibold mb-6">Confirmation</h1>
      <Card>
        <div className="text-sm text-gray-600">Service: {payload.serviceId}</div>
        <div className="text-sm text-gray-600">Créneau: {payload.scheduledAt}</div>
        <div className="text-sm text-gray-600">Adresse: {payload.address || "—"}</div>
        <div className="text-sm text-gray-600">Paiement: {payload.paymentMethod} / {payload.paymentTiming}</div>

        <div className="mt-6 flex gap-3">
          <Button href="/results" variant="secondary">Retour</Button>
          <Button onClick={createBooking}>Créer la réservation</Button>
        </div>

        {msg && <div className="mt-4 text-sm text-gray-700">{msg}</div>}
      </Card>
    </Container>
  );
}
