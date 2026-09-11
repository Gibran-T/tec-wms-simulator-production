# Release gate — après signature Nadia

## Statut actuel
- Modèle : **institutionnel déclaré** (Été 2026, sans carimbo)
- PDFs signés : importés dans `client/public/certificates/{silver|gold}/2026/` — fichiers `.HOLD` **supprimés**
- Registres ACTIVE : Fondatrice 001–004 **conservés** + Été 2026 005–011 **ACTIVE**
- `railwayVerificationRegistry.json` : 22 identifiants ACTIVE (SIL + GOLD 001–011)
- Flags profil : activer via `npx tsx scripts/ete2026-certification-award.ts --apply --confirm-ete2026-certificates`

## Après signature Nadia — checklist
1. Remplacer les PDF par versions signées (si signature manuscrite scannée) **ou** garder PDF + DocuSign attaché.
2. Supprimer les fichiers `TECWMS-*-2026-00N.HOLD`.
3. Ajouter entrées **ACTIVE** dans :
   - `shared/silverCertificationRegistry.ts` (005–011)
   - `shared/goldCertificationRegistry.ts` (005–011)
   - `shared/certification/railwayVerificationRegistry.json` (SIL + GOLD 005–011)
4. Activer flags profil prod (`silverCertified` / `goldCertified`) pour les 7 étudiants.
5. Mettre à jour `shared/certification/staging/ete2026-pending-nadia-signature.json` → `RELEASED`.
6. Vérifier `/verify/TECWMS-SIL-2026-005` … `011` et GOLD équivalents.

## Ne pas faire avant signature
- Ne pas ajouter 005–011 aux registres ACTIVE
- Ne pas libérer l’icône / credential aux étudiants
