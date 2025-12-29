import { prisma } from "@/lib/prisma";
import { Card, Container } from "@/components/ui";

export default async function AdminPage() {
  const pending = await prisma.user.findMany({
    where: { role: "PROVIDER", providerApproved: false },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <Container>
      <h1 className="text-2xl font-semibold mb-6">Admin</h1>
      <Card>
        <div className="font-medium mb-4">Prestataires en attente</div>
        <ul className="space-y-2 text-sm">
          {pending.length === 0 ? (
            <li className="text-gray-600">Aucun prestataire en attente.</li>
          ) : (
            pending.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-medium">{p.name ?? p.email}</div>
                  <div className="text-gray-600">{p.city ?? ""} • {p.email}</div>
                </div>
                <div className="text-xs text-gray-500">Valider via /api/admin/providers/approve</div>
              </li>
            ))
          )}
        </ul>
      </Card>
    </Container>
  );
}
