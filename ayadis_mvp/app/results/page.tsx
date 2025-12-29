import { prisma } from "@/lib/prisma";
import { Card, Container, Button } from "@/components/ui";

export default async function ResultsPage() {
  const services = await prisma.service.findMany({
    where: { active: true, provider: { providerApproved: true, visibleOnSite: true } },
    include: { provider: true, category: true },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return (
    <Container>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">Services disponibles</h2>
        <p className="mt-2 text-sm text-gray-600">Uniquement des prestataires validés et visibles.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {services.map((s) => (
          <Card key={s.id} className="flex items-start justify-between gap-6">
            <div>
              <div className="text-sm text-gray-500">{s.category?.name ?? "Service"}</div>
              <div className="text-lg font-semibold">{s.name}</div>
              <div className="mt-1 text-sm text-gray-600">
                {s.provider.name ?? "Prestataire"} — {s.provider.city ?? "Gironde"}
              </div>
              <div className="mt-3 text-sm font-medium">{(s.priceCents / 100).toFixed(2)} €</div>
            </div>
            <Button href={`/service/${s.id}`}>Réserver</Button>
          </Card>
        ))}
      </div>
    </Container>
  );
}
