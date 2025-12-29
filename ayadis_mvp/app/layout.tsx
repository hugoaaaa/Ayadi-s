import "./globals.css";
import { Container } from "@/components/ui";

export const metadata = { title: "Ayadi's", description: "Marketplace de services à la demande" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <header className="bg-white ring-1 ring-line">
          <Container>
            <div className="flex h-16 items-center justify-between">
              <div className="font-semibold">Ayadi&apos;s</div>
              <nav className="flex items-center gap-6 text-sm">
                <a className="hover:underline" href="/">Accueil</a>
                <a className="hover:underline" href="/results">Services</a>
                <a className="hover:underline" href="/admin">Admin</a>
              </nav>
            </div>
          </Container>
        </header>
        <main className="py-10">{children}</main>
        <footer className="py-10 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Ayadi&apos;s — Gironde
        </footer>
      </body>
    </html>
  );
}
