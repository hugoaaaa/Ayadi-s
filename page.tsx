import { prisma } from "@/lib/prisma";
import { Card, Container, Button, Select, Input } from "@/components/ui";

export default async function ServiceDetail({ params }: { params: { id: string } }) {
  const service = await prisma.service.findUnique({
    where: { id: params.id },
    include: { provider: true, category: true },
  });

  if (!service) return <Container>Service introuvable.</Container>;

  return (
    <Container>
      <div className="mb-6">
        <div className="text-sm text-gray-500">{service.category?.name ?? "Service"}</div>
        <h1 className="text-3xl font-semibold">{service.name}</h1>
        <p className="mt-2 text-gray-600">{service.description ?? "—"}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <div className="font-medium">Prestataire</div>
          <div className="mt-2 text-sm text-gray-600">
            {service.provider.name ?? service.provider.email} — {service.provider.city ?? "Gironde"}
          </div>
          <div className="mt-4 text-sm font-medium">{(service.priceCents / 100).toFixed(2)} €</div>
        </Card>

        <Card>
          <div className="font-medium mb-4">Réserver</div>
          <form action="/booking" method="GET" className="grid gap-3">
            <input type="hidden" name="serviceId" value={service.id} />
            <label className="text-sm font-medium">Date/heure</label>
            <Input type="datetime-local" name="scheduledAt" required />
            <label className="text-sm font-medium">Adresse</label>
            <Input name="address" placeholder="Adresse d'intervention" />
            <label className="text-sm font-medium">Méthode de paiement</label>
            <Select name="paymentMethod" defaultValue="CARD">
              <option value="CARD">Carte bancaire</option>
              <option value="CASH">Espèces</option>
            </Select>
            <label className="text-sm font-medium">Quand payer (si carte)</label>
            <Select name="paymentTiming" defaultValue="AT_RESERVATION">
              <option value="AT_RESERVATION">À la réservation</option>
              <option value="AT_SERVICE">Au moment de la prestation</option>
            </Select>
            <Button type="submit">Continuer</Button>
          </form>
        </Card>
      </div>
    </Container>
  );
}
