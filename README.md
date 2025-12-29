# Ayadi's — MVP marketplace de services (Gironde)

Design: bleu roi #0052CC, bleu marine #001B44, vert #22C55E.

## Lancer en local
```bash
cp .env.example .env
npm i
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Admin seed:
- admin@ayadis.local / Admin1234!

## Commission
- `Service.commissionPercent` (par service)
- sinon `.env` `DEFAULT_COMMISSION_PERCENT=20`

## Paiement
- Carte à la réservation: `/api/bookings/create` renvoie `paymentIntentClientSecret`
- Carte au moment de la prestation: créer booking avec `paymentTiming=AT_SERVICE`, puis `/api/bookings/collect`
- Espèces: `paymentMethod=CASH`

## Admin (API)
- Valider prestataire: POST `/api/admin/providers/approve` `{ providerId, approved }`
- Ajouter prestataire + service: POST `/api/admin/providers/create` (voir code)
