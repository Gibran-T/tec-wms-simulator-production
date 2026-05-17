/**
 * OdooLabSlide — Rich visual didactic lab panels for TEC.WMS
 *
 * Each lab is a self-contained "slide" with:
 *  - Header: lab title + module badge
 *  - Concept card: key learning objective
 *  - Visual diagram: warehouse structure, flow, table, or checklist
 *  - Mapping table: TEC.WMS ↔ Odoo equivalences
 *  - Warning: common production error
 *  - Optional Odoo button: clearly secondary, with availability disclaimer
 *
 * The embedded content is the PRIMARY learning experience.
 * Odoo is optional and clearly marked as such.
 */

import { BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// ─── Shared sub-components ────────────────────────────────────────────────────

function SlideHeader({ icon, labelFr, labelEn, badge, badgeColor }: {
  icon: string;
  labelFr: string;
  labelEn: string;
  badge: string;
  badgeColor: string;
}) {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <span className="text-xs font-bold uppercase tracking-wider">{t(labelFr, labelEn)}</span>
      </div>
      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${badgeColor}`}>
        {badge}
      </span>
    </div>
  );
}

function ConceptCard({ titleFr, titleEn, bodyFr, bodyEn, color }: {
  titleFr: string; titleEn: string;
  bodyFr: string; bodyEn: string;
  color: string;
}) {
  const { t } = useLanguage();
  return (
    <div className={`rounded-md px-3 py-2 mb-3 border-l-4 ${color}`}>
      <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5 opacity-70">{t(titleFr, titleEn)}</p>
      <p className="text-[11px] leading-snug">{t(bodyFr, bodyEn)}</p>
    </div>
  );
}

function MappingTable({ rows, headerFr, headerEn }: {
  rows: { left: string; right: string }[];
  headerFr: [string, string];
  headerEn: [string, string];
}) {
  const { t } = useLanguage();
  return (
    <div className="rounded-md overflow-hidden border border-current/20 mb-3 text-[10px]">
      <div className="grid grid-cols-2 bg-current/10 font-bold">
        <div className="px-2 py-1 border-r border-current/20">{t(headerFr[0], headerEn[0])}</div>
        <div className="px-2 py-1">{t(headerFr[1], headerEn[1])}</div>
      </div>
      {rows.map((row, i) => (
        <div key={i} className={`grid grid-cols-2 ${i % 2 === 0 ? "bg-current/5" : ""}`}>
          <div className="px-2 py-1 border-r border-current/20 font-mono">{row.left}</div>
          <div className="px-2 py-1">{row.right}</div>
        </div>
      ))}
    </div>
  );
}

function WarningBanner({ fr, en }: { fr: string; en: string }) {
  const { t } = useLanguage();
  return (
    <p className="text-[10px] italic opacity-70 mt-2">⚠️ {t(fr, en)}</p>
  );
}

function OptionalOdooButton({ url }: { url: string }) {
  const { t } = useLanguage();
  return (
    <div className="border-t border-current/20 pt-3 mt-3">
      <p className="text-[9px] italic opacity-60 mb-1.5">
        {t(
          "Session Odoo requise — connectez-vous à Odoo EDU LAB avant d'ouvrir ce lien.",
          "Odoo session required — please log in to Odoo EDU LAB before opening this link."
        )}
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-current/30 text-[9px] font-medium opacity-70 hover:opacity-100 transition-opacity"
      >
        <BookOpen size={10} />
        {t("Optionnel : Explorer dans Odoo ↗", "Optional: Explore in Odoo ↗")}
      </a>
    </div>
  );
}

// ─── M1 — GR: Goods Receipt ───────────────────────────────────────────────────

export function LabGR() {
  const { t } = useLanguage();
  return (
    <div className="mt-4 border border-blue-300 dark:border-blue-700 rounded-md overflow-hidden bg-blue-50/60 dark:bg-blue-950/30 px-4 py-3 text-blue-800 dark:text-blue-200">
      <SlideHeader
        icon="🔵"
        labelFr="Odoo Lab — Réception marchandises"
        labelEn="Odoo Lab — Goods Receipt"
        badge="M1 · Core"
        badgeColor="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
      />

      <ConceptCard
        titleFr="Concept clé"
        titleEn="Key concept"
        bodyFr="Le stock n'augmente QUE lorsque la réception est validée (postée). Avant validation = brouillon, aucun impact stock."
        bodyEn="Stock only increases WHEN the receipt is validated (posted). Before validation = draft, no stock impact."
        color="border-blue-400 bg-blue-100/60 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200"
      />

      {/* Warehouse flow diagram */}
      <div className="mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wide opacity-60 mb-2">
          {t("Flux de réception dans l'entrepôt", "Receiving flow in the warehouse")}
        </p>
        <div className="flex items-stretch gap-1 text-[10px]">
          {[
            { icon: "📄", labelFr: "Bon de\nCommande\n(PO)", labelEn: "Purchase\nOrder\n(PO)", sub: "Source doc" },
            { icon: "→", arrow: true },
            { icon: "📦", labelFr: "Réception\nmarchandises\n(GR)", labelEn: "Goods\nReceipt\n(GR)", sub: "TEC.WMS" },
            { icon: "→", arrow: true },
            { icon: "🏭", labelFr: "WH/Input\n(REC-01)", labelEn: "WH/Input\n(REC-01)", sub: "Zone réception" },
            { icon: "→", arrow: true },
            { icon: "✅", labelFr: "Stock\nmis à jour", labelEn: "Stock\nupdated", sub: "Après validation" },
          ].map((node, i) =>
            node.arrow ? (
              <div key={i} className="flex items-center text-blue-400 dark:text-blue-500 font-bold text-base px-0.5">→</div>
            ) : (
              <div key={i} className="flex-1 rounded border border-blue-200 dark:border-blue-700 bg-white/60 dark:bg-blue-900/30 px-1.5 py-1.5 text-center">
                <div className="text-base mb-0.5">{node.icon}</div>
                <div className="font-semibold leading-tight whitespace-pre-line">{t(node.labelFr!, node.labelEn!)}</div>
                <div className="text-[9px] opacity-50 mt-0.5">{node.sub}</div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Validation state diagram */}
      <div className="mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wide opacity-60 mb-2">
          {t("États de la transaction", "Transaction states")}
        </p>
        <div className="flex gap-2 text-[10px]">
          <div className="flex-1 rounded border border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-950/40 px-2 py-1.5 text-orange-800 dark:text-orange-300">
            <div className="font-bold mb-0.5">⏳ {t("Brouillon", "Draft")}</div>
            <div className="opacity-70">{t("GR créé, non validé", "GR created, not validated")}</div>
            <div className="text-[9px] mt-1 font-mono opacity-60">stock_impact = 0</div>
          </div>
          <div className="flex items-center text-blue-400 font-bold">→</div>
          <div className="flex-1 rounded border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/40 px-2 py-1.5 text-green-800 dark:text-green-300">
            <div className="font-bold mb-0.5">✅ {t("Validé / Fait", "Validated / Done")}</div>
            <div className="opacity-70">{t("GR posté dans le système", "GR posted in system")}</div>
            <div className="text-[9px] mt-1 font-mono opacity-60">stock_impact = +qty</div>
          </div>
        </div>
      </div>

      <MappingTable
        headerFr={["TEC.WMS", "Odoo Inventaire"]}
        headerEn={["TEC.WMS", "Odoo Inventory"]}
        rows={[
          { left: "MIGO (GR)", right: t("Valider une Réception", "Validate a Receipt") },
          { left: "REC-01", right: "WH/Input" },
          { left: "Statut VALIDÉ", right: t("Statut Fait (Done)", "Status Done") },
          { left: "PO obligatoire", right: t("Bon de Commande source", "Source Purchase Order") },
        ]}
      />

      <WarningBanner
        fr="Créer un GR sans PO = exception d'audit interne. Toujours lier GR → PO."
        en="Creating a GR without a PO = internal audit exception. Always link GR → PO."
      />
      <OptionalOdooButton url="https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/receipts" />
    </div>
  );
}

// ─── M2 — PUTAWAY: Warehouse Locations ───────────────────────────────────────

export function LabPutaway() {
  const { t } = useLanguage();
  return (
    <div className="mt-4 border border-blue-300 dark:border-blue-700 rounded-md overflow-hidden bg-blue-50/60 dark:bg-blue-950/30 px-4 py-3 text-blue-800 dark:text-blue-200">
      <SlideHeader
        icon="🔵"
        labelFr="Odoo Lab — Emplacements et structure d'entrepôt"
        labelEn="Odoo Lab — Warehouse Locations & Structure"
        badge="M2 · Core"
        badgeColor="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
      />

      <ConceptCard
        titleFr="Concept clé"
        titleEn="Key concept"
        bodyFr="Tout entrepôt ERP est organisé en hiérarchie d'emplacements. Le rangement automatique (putaway) dirige chaque article vers le bon emplacement selon des règles prédéfinies."
        bodyEn="Every ERP warehouse is organized as a location hierarchy. Automatic putaway routes each item to the correct bin based on predefined rules."
        color="border-blue-400 bg-blue-100/60 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200"
      />

      {/* Warehouse hierarchy diagram */}
      <div className="mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wide opacity-60 mb-2">
          {t("Structure hiérarchique de l'entrepôt", "Warehouse location hierarchy")}
        </p>
        <div className="rounded border border-blue-200 dark:border-blue-700 bg-white/60 dark:bg-blue-900/20 p-2 font-mono text-[10px] space-y-1">
          <div className="font-bold text-blue-700 dark:text-blue-300">🏭 WH/ ({t("Entrepôt principal", "Main Warehouse")})</div>
          <div className="pl-4 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-blue-400">├─</span>
              <span className="bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 px-1.5 py-0.5 rounded text-[9px] font-bold">WH/Input</span>
              <span className="opacity-60">→ {t("Zone réception", "Receiving zone")} (= REC-01)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">├─</span>
              <span className="bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 px-1.5 py-0.5 rounded text-[9px] font-bold">WH/Quality</span>
              <span className="opacity-60">→ {t("Contrôle qualité", "Quality control")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">├─</span>
              <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded text-[9px] font-bold">WH/Stock</span>
              <span className="opacity-60">→ {t("Zone stockage", "Storage zone")} (= B-01-R1-L1)</span>
            </div>
            <div className="pl-4 space-y-0.5 opacity-70">
              <div className="flex items-center gap-2">
                <span className="text-blue-300">├─</span>
                <span className="text-[9px]">WH/Stock/Allée-01 → B-01-R1-L1</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-300">├─</span>
                <span className="text-[9px]">WH/Stock/Allée-02 → B-02-R1-L1</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-300">└─</span>
                <span className="text-[9px]">WH/Stock/Réserve → RESERVE-01</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">└─</span>
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-[9px] font-bold">WH/Output</span>
              <span className="opacity-60">→ {t("Zone expédition", "Shipping zone")} (= EXP-01)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Putaway rules visual */}
      <div className="mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wide opacity-60 mb-2">
          {t("Règles de rangement automatique", "Automatic putaway rules")}
        </p>
        <div className="space-y-1 text-[10px]">
          {[
            { cat: t("Réfrigéré", "Refrigerated"), dest: "WH/Stock/Froid", icon: "❄️" },
            { cat: t("Produits chimiques", "Chemicals"), dest: "WH/Stock/Chimie", icon: "⚗️" },
            { cat: t("Standard", "Standard"), dest: "WH/Stock/Allée-01", icon: "📦" },
            { cat: t("Vrac / Palettes", "Bulk / Pallets"), dest: "WH/Stock/Réserve", icon: "🏗️" },
          ].map((rule, i) => (
            <div key={i} className="flex items-center gap-2 rounded border border-blue-200 dark:border-blue-700 bg-white/40 dark:bg-blue-900/20 px-2 py-1">
              <span>{rule.icon}</span>
              <span className="flex-1 font-medium">{rule.cat}</span>
              <span className="text-blue-400 dark:text-blue-500">→</span>
              <span className="font-mono text-[9px] bg-blue-100 dark:bg-blue-900/40 px-1.5 py-0.5 rounded">{rule.dest}</span>
            </div>
          ))}
        </div>
      </div>

      <MappingTable
        headerFr={["TEC.WMS", "Odoo Inventaire"]}
        headerEn={["TEC.WMS", "Odoo Inventory"]}
        rows={[
          { left: "LT0A (Transfer Order)", right: t("Mouvement de stock auto", "Automatic stock move") },
          { left: "B-01-R1-L1", right: "WH/Stock/Allée-01" },
          { left: "REC-01", right: "WH/Input" },
          { left: "EXP-01", right: "WH/Output" },
        ]}
      />

      <WarningBanner
        fr="Sans putaway : le stock reste en WH/Input et ne peut pas être prélevé pour les commandes."
        en="Without putaway: stock stays in WH/Input and cannot be picked for orders."
      />
      <OptionalOdooButton url="https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/configuration/warehouses" />
    </div>
  );
}

// ─── M3 — REPLENISH: Reordering Rules ────────────────────────────────────────

export function LabReplenish() {
  const { t } = useLanguage();
  return (
    <div className="mt-4 border border-blue-300 dark:border-blue-700 rounded-md overflow-hidden bg-blue-50/60 dark:bg-blue-950/30 px-4 py-3 text-blue-800 dark:text-blue-200">
      <SlideHeader
        icon="🔵"
        labelFr="Odoo Lab — Règles de réapprovisionnement Min/Max"
        labelEn="Odoo Lab — Min/Max Replenishment Rules"
        badge="M3 · Core"
        badgeColor="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
      />

      <ConceptCard
        titleFr="Concept clé"
        titleEn="Key concept"
        bodyFr="Le réapprovisionnement automatique repose sur des règles Min/Max. Quand le stock descend sous le seuil Min, le système génère automatiquement une demande d'achat (Qté = Max − Stock actuel)."
        bodyEn="Automatic replenishment relies on Min/Max rules. When stock drops below the Min threshold, the system automatically generates a purchase request (Qty = Max − Current stock)."
        color="border-blue-400 bg-blue-100/60 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200"
      />

      {/* Dual product gauges — real Odoo EDU data (Phase 3B) */}
      <div className="mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wide opacity-60 mb-2">
          {t("Données réelles — Odoo EDU Lab", "Real data — Odoo EDU Lab")}
        </p>
        {/* SKU-004: Ruban adhésif — Min=10, Max=50, Stock=0 */}
        <div className="rounded border border-blue-200 dark:border-blue-700 bg-white/60 dark:bg-blue-900/20 p-2.5 mb-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-mono font-bold text-blue-700 dark:text-blue-300">SKU-004</span>
            <span className="text-[9px] opacity-70">{t("Ruban adhésif d'emballage", "Packaging tape")}</span>
          </div>
          <div className="flex justify-between text-[8px] font-mono mb-1 opacity-50">
            <span className="text-red-500 font-bold">Stock=0</span><span>Min=10</span><span>Max=50</span>
          </div>
          <div className="relative h-4 rounded-full overflow-hidden border border-blue-200 dark:border-blue-700">
            <div className="absolute inset-0 bg-green-200 dark:bg-green-900/40" style={{ width: "100%" }} />
            <div className="absolute inset-0 bg-orange-200 dark:bg-orange-900/40" style={{ width: "20%" }} />
            <div className="absolute inset-y-0 left-0 bg-red-400 dark:bg-red-600" style={{ width: "0%" }} />
            <div className="absolute inset-y-0 border-l-2 border-orange-500 border-dashed" style={{ left: "20%" }} />
          </div>
          <div className="flex justify-between text-[8px] mt-1">
            <span className="text-red-600 dark:text-red-400 font-bold">⚠️ {t("Stock = 0 < Min (10)", "Stock = 0 < Min (10)")}</span>
            <span className="text-green-600 dark:text-green-400 font-bold">{t("Commander 50 unités", "Order 50 units")} (50−0)</span>
          </div>
        </div>
        {/* SKU-005: Étiquette code-barres — Min=20, Max=100, Stock=0 */}
        <div className="rounded border border-blue-200 dark:border-blue-700 bg-white/60 dark:bg-blue-900/20 p-2.5">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-mono font-bold text-blue-700 dark:text-blue-300">SKU-005</span>
            <span className="text-[9px] opacity-70">{t("Étiquette code-barres", "Barcode label")}</span>
          </div>
          <div className="flex justify-between text-[8px] font-mono mb-1 opacity-50">
            <span className="text-red-500 font-bold">Stock=0</span><span>Min=20</span><span>Max=100</span>
          </div>
          <div className="relative h-4 rounded-full overflow-hidden border border-blue-200 dark:border-blue-700">
            <div className="absolute inset-0 bg-green-200 dark:bg-green-900/40" style={{ width: "100%" }} />
            <div className="absolute inset-0 bg-orange-200 dark:bg-orange-900/40" style={{ width: "20%" }} />
            <div className="absolute inset-y-0 left-0 bg-red-400 dark:bg-red-600" style={{ width: "0%" }} />
            <div className="absolute inset-y-0 border-l-2 border-orange-500 border-dashed" style={{ left: "20%" }} />
          </div>
          <div className="flex justify-between text-[8px] mt-1">
            <span className="text-red-600 dark:text-red-400 font-bold">⚠️ {t("Stock = 0 < Min (20)", "Stock = 0 < Min (20)")}</span>
            <span className="text-green-600 dark:text-green-400 font-bold">{t("Commander 100 unités", "Order 100 units")} (100−0)</span>
          </div>
        </div>
      </div>

      {/* Formula cards — SKU-004 as primary example */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-[10px]">
        {[
          { label: t("Seuil Min", "Min Threshold"), formula: "SKU-004: 10", desc: t("Déclenche la commande", "Triggers the order"), color: "border-orange-300 bg-orange-50 dark:bg-orange-950/30 text-orange-800 dark:text-orange-200" },
          { label: t("Seuil Max", "Max Threshold"), formula: "SKU-004: 50", desc: t("Quantité cible", "Target quantity"), color: "border-green-300 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200" },
          { label: t("Qté commandée", "Order Qty"), formula: "Max − Stock", desc: "= 50 − 0 = 50", color: "border-blue-300 bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200" },
        ].map((card, i) => (
          <div key={i} className={`rounded border px-2 py-1.5 ${card.color}`}>
            <div className="font-bold text-[9px] uppercase opacity-60 mb-0.5">{card.label}</div>
            <div className="font-mono font-bold text-sm">{card.formula}</div>
            <div className="text-[9px] opacity-70 mt-0.5">{card.desc}</div>
          </div>
        ))}
      </div>

      <MappingTable
        headerFr={["TEC.WMS", "Odoo Inventaire"]}
        headerEn={["TEC.WMS", "Odoo Inventory"]}
        rows={[
          { left: t("Analyse CC manuelle", "Manual CC analysis"), right: t("Règle Min/Max automatique", "Automatic Min/Max rule") },
          { left: "REPLENISH", right: t("Bon de Commande auto", "Auto Purchase Order") },
          { left: t("Décision manuelle", "Manual decision"), right: t("Déclenchement automatique", "Automatic trigger") },
        ]}
      />

      <WarningBanner
        fr="Le stock est à zéro pour SKU-004 et SKU-005 — inférieur au seuil Min. Odoo propose une quantité à commander égale à Max − Stock actuel."
        en="Stock is at zero for SKU-004 and SKU-005 — below the Min threshold. Odoo suggests an order quantity equal to Max − Current stock."
      />
      <OptionalOdooButton url="https://edu-concorde-logistics-lab.odoo.com/odoo/replenishment" />
    </div>
  );
}

// ─── M4 — KPI_DIAGNOSTIC: Inventory Reporting ────────────────────────────────

export function LabKpiDiagnostic() {
  const { t } = useLanguage();
  return (
    <div className="mt-4 border border-blue-300 dark:border-blue-700 rounded-md overflow-hidden bg-blue-50/60 dark:bg-blue-950/30 px-4 py-3 text-blue-800 dark:text-blue-200">
      <SlideHeader
        icon="🔵"
        labelFr="Odoo Lab — Rapports d'inventaire et KPI"
        labelEn="Odoo Lab — Inventory Reporting & KPI"
        badge="M4 · Core"
        badgeColor="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
      />

      <ConceptCard
        titleFr="Concept clé"
        titleEn="Key concept"
        bodyFr="Les KPI logistiques mesurent la performance opérationnelle. Un ERP centralise ces indicateurs en temps réel pour permettre la prise de décision."
        bodyEn="Logistics KPIs measure operational performance. An ERP centralizes these indicators in real time to support decision-making."
        color="border-blue-400 bg-blue-100/60 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200"
      />

      {/* KPI metric cards */}
      <div className="mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wide opacity-60 mb-2">
          {t("Les 4 KPI essentiels", "The 4 essential KPIs")}
        </p>
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          {[
            {
              icon: "🔄",
              nameFr: "Taux de rotation",
              nameEn: "Inventory Turnover",
              formula: t("Coût ventes ÷ Stock moyen", "COGS ÷ Avg Inventory"),
              targetFr: "Cible : > 4×/an",
              targetEn: "Target: > 4×/year",
              odoo: t("Rapports → Valorisation", "Reporting → Valuation"),
              color: "border-blue-300 bg-blue-50 dark:bg-blue-950/30",
            },
            {
              icon: "🚚",
              nameFr: "Taux de service",
              nameEn: "Service Level (OTIF)",
              formula: t("Livraisons à temps ÷ Total × 100", "On-time ÷ Total × 100"),
              targetFr: "Cible : > 95%",
              targetEn: "Target: > 95%",
              odoo: t("Ventes → Rapports OTIF", "Sales → OTIF Reports"),
              color: "border-green-300 bg-green-50 dark:bg-green-950/30",
            },
            {
              icon: "⚠️",
              nameFr: "Taux d'erreur",
              nameEn: "Error Rate",
              formula: t("Erreurs ÷ Opérations × 100", "Errors ÷ Operations × 100"),
              targetFr: "Cible : < 2%",
              targetEn: "Target: < 2%",
              odoo: t("Inventaire → Ajustements", "Inventory → Adjustments"),
              color: "border-orange-300 bg-orange-50 dark:bg-orange-950/30",
            },
            {
              icon: "💰",
              nameFr: "Valeur du stock",
              nameEn: "Stock Value",
              formula: t("Σ (Qté × Coût unitaire)", "Σ (Qty × Unit Cost)"),
              targetFr: "Surveiller les écarts",
              targetEn: "Monitor variances",
              odoo: t("Inventaire → Valorisation", "Inventory → Valuation"),
              color: "border-purple-300 bg-purple-50 dark:bg-purple-950/30",
            },
          ].map((kpi, i) => (
            <div key={i} className={`rounded border ${kpi.color} px-2 py-1.5 text-blue-800 dark:text-blue-200`}>
              <div className="flex items-center gap-1 mb-1">
                <span>{kpi.icon}</span>
                <span className="font-bold text-[10px]">{t(kpi.nameFr, kpi.nameEn)}</span>
              </div>
              <div className="font-mono text-[9px] bg-white/60 dark:bg-black/20 rounded px-1 py-0.5 mb-1">{kpi.formula}</div>
              <div className="text-[9px] opacity-60">{t(kpi.targetFr, kpi.targetEn)}</div>
              <div className="text-[9px] opacity-50 mt-0.5">Odoo: {kpi.odoo}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation path in Odoo */}
      <div className="mb-3 rounded border border-blue-200 dark:border-blue-700 bg-white/40 dark:bg-blue-900/20 px-2 py-1.5 text-[10px]">
        <p className="font-bold opacity-60 uppercase text-[9px] mb-1">{t("Navigation dans Odoo", "Navigation in Odoo")}</p>
        <div className="space-y-0.5">
          <div className="flex items-center gap-1">
            <span className="text-blue-400">▸</span>
            <span>{t("Inventaire → Rapports → Valorisation des stocks", "Inventory → Reporting → Inventory Valuation")}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-blue-400">▸</span>
            <span>{t("Inventaire → Rapports → Mouvements de stock", "Inventory → Reporting → Stock Moves")}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-blue-400">▸</span>
            <span>{t("Filtrer par : période, produit, emplacement", "Filter by: period, product, location")}</span>
          </div>
        </div>
      </div>

      <WarningBanner
        fr="Un taux de rotation < 2 indique un stock dormant qui immobilise du capital."
        en="A turnover rate < 2 indicates dormant stock that ties up capital."
      />
      <OptionalOdooButton url="https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/reporting" />
    </div>
  );
}

// ─── M5 — M5_DECISION: Manufacturing & Integrated ERP ────────────────────────

export function LabM5Decision() {
  const { t } = useLanguage();
  return (
    <div className="mt-4 border border-blue-300 dark:border-blue-700 rounded-md overflow-hidden bg-blue-50/60 dark:bg-blue-950/30 px-4 py-3 text-blue-800 dark:text-blue-200">
      <SlideHeader
        icon="🔵"
        labelFr="Odoo Lab — Fabrication et flux ERP intégré"
        labelEn="Odoo Lab — Manufacturing & Integrated ERP Flow"
        badge="M5 · Core"
        badgeColor="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
      />

      <ConceptCard
        titleFr="Concept clé"
        titleEn="Key concept"
        bodyFr="La fabrication est une extension naturelle du flux WMS. Les mêmes principes (GR, stock, GI) s'appliquent, mais avec une étape de transformation entre la réception et l'expédition."
        bodyEn="Manufacturing is a natural extension of the WMS flow. The same principles (GR, stock, GI) apply, but with a transformation step between receipt and shipment."
        color="border-blue-400 bg-blue-100/60 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200"
      />

      {/* Integrated ERP flow */}
      <div className="mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wide opacity-60 mb-2">
          {t("Flux ERP intégré complet", "Full integrated ERP flow")}
        </p>
        <div className="space-y-1 text-[10px]">
          {[
            { step: "1", icon: "📦", labelFr: "GR Matières premières", labelEn: "GR Raw materials", effectFr: "Stock composants ↑", effectEn: "Component stock ↑", color: "border-green-300 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200" },
            { step: "2", icon: "🏭", labelFr: "Ordre de Fabrication (MO)", labelEn: "Manufacturing Order (MO)", effectFr: "Composants consommés ↓", effectEn: "Components consumed ↓", color: "border-orange-300 bg-orange-50 dark:bg-orange-950/30 text-orange-800 dark:text-orange-200" },
            { step: "3", icon: "✅", labelFr: "GR Produit fini", labelEn: "GR Finished goods", effectFr: "Stock produit fini ↑", effectEn: "Finished goods stock ↑", color: "border-green-300 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200" },
            { step: "4", icon: "🚚", labelFr: "SO + GI Expédition", labelEn: "SO + GI Shipment", effectFr: "Stock diminue ↓", effectEn: "Stock decreases ↓", color: "border-blue-300 bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200" },
          ].map((step, i) => (
            <div key={i} className={`flex items-center gap-2 rounded border ${step.color} px-2 py-1.5`}>
              <span className="w-4 h-4 rounded-full bg-current/20 flex items-center justify-center text-[9px] font-bold flex-shrink-0">{step.step}</span>
              <span className="text-base">{step.icon}</span>
              <span className="flex-1 font-medium">{t(step.labelFr, step.labelEn)}</span>
              <span className="text-[9px] font-mono opacity-70">{t(step.effectFr, step.effectEn)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key documents */}
      <div className="mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wide opacity-60 mb-2">
          {t("Documents clés — Odoo Manufacturing", "Key documents — Odoo Manufacturing")}
        </p>
        <div className="grid grid-cols-3 gap-1.5 text-[10px]">
          {[
            { abbr: "BoM", nameFr: "Nomenclature", nameEn: "Bill of Materials", descFr: "Liste des composants requis", descEn: "List of required components" },
            { abbr: "MO", nameFr: "Ordre de fabrication", nameEn: "Manufacturing Order", descFr: "Ordre de production", descEn: "Production order" },
            { abbr: "WO", nameFr: "Opération atelier", nameEn: "Work Order", descFr: "Tâche sur poste de travail", descEn: "Task on work center" },
          ].map((doc, i) => (
            <div key={i} className="rounded border border-blue-200 dark:border-blue-700 bg-white/40 dark:bg-blue-900/20 px-2 py-1.5 text-center">
              <div className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400">{doc.abbr}</div>
              <div className="font-medium text-[9px] mt-0.5">{t(doc.nameFr, doc.nameEn)}</div>
              <div className="text-[9px] opacity-50 mt-0.5">{t(doc.descFr, doc.descEn)}</div>
            </div>
          ))}
        </div>
      </div>

      <MappingTable
        headerFr={["TEC.WMS (ce cours)", "TEC.SYS (prochain cours)"]}
        headerEn={["TEC.WMS (this course)", "TEC.SYS (next course)"]}
        rows={[
          { left: "GR + Putaway", right: "GR + Putaway + BoM" },
          { left: t("Gestion du stock", "Stock management"), right: t("Stock + Planification", "Stock + Production planning") },
          { left: "GI + Compliance", right: "GI + MRP + Costing" },
        ]}
      />

      <WarningBanner
        fr="Ce module est conceptuel — aucune exécution détaillée requise dans TEC.WMS."
        en="This module is conceptual — no detailed execution required in TEC.WMS."
      />
      <OptionalOdooButton url="https://edu-concorde-logistics-lab.odoo.com/odoo/manufacturing" />
    </div>
  );
}

// ─── ERROR LAB 1 — FIFO Violation ────────────────────────────────────────────

export function LabFifoPick() {
  const { t } = useLanguage();
  return (
    <div className="mt-4 border border-orange-300 dark:border-orange-700 rounded-md overflow-hidden">
      {/* Warning banner */}
      <div className="bg-orange-50 dark:bg-orange-950/50 px-4 py-2 border-b border-orange-200 dark:border-orange-800">
        <p className="text-[11px] font-semibold text-orange-700 dark:text-orange-300 leading-snug">
          ⚠️ {t("Erreur fréquente en production : mauvaise méthode de picking — FIFO non respecté.", "Common production error: wrong picking method — FIFO not respected.")}
        </p>
      </div>
      <div className="bg-orange-50/60 dark:bg-orange-950/30 px-4 py-3 text-orange-800 dark:text-orange-200">
        <SlideHeader
          icon="🟠"
          labelFr="Odoo Lab — Mauvaise méthode de picking"
          labelEn="Odoo Lab — Wrong Picking Method"
          badge={t("Erreur · FIFO", "Error · FIFO")}
          badgeColor="bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200"
        />

        <ConceptCard
          titleFr="FIFO — Premier entré, Premier sorti"
          titleEn="FIFO — First In, First Out"
          bodyFr="Le lot le plus ANCIEN doit TOUJOURS être prélevé en premier. Violer le FIFO = risque de péremption, problème de traçabilité, non-conformité réglementaire."
          bodyEn="The OLDEST lot must ALWAYS be picked first. Violating FIFO = expiry risk, traceability issue, regulatory non-compliance."
          color="border-orange-400 bg-orange-100/60 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200"
        />

        {/* FIFO vs violation visual */}
        <div className="mb-3">
          <p className="text-[10px] font-bold uppercase tracking-wide opacity-60 mb-2">
            {t("FIFO correct vs violation", "Correct FIFO vs violation")}
          </p>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="rounded border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/30 px-2 py-2">
              <div className="font-bold text-green-700 dark:text-green-300 mb-1.5">✅ {t("FIFO respecté", "FIFO respected")}</div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 rounded bg-green-100 dark:bg-green-900/40 px-1.5 py-1">
                  <span className="text-[9px] font-mono bg-green-200 dark:bg-green-800 px-1 rounded">LOT-A</span>
                  <span className="text-[9px] opacity-70">01/01 — {t("prélevé 1er", "picked 1st")}</span>
                  <span className="ml-auto text-green-600">✓</span>
                </div>
                <div className="flex items-center gap-1.5 rounded bg-white/40 dark:bg-black/10 px-1.5 py-1">
                  <span className="text-[9px] font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">LOT-B</span>
                  <span className="text-[9px] opacity-70">15/01 — {t("prélevé 2ème", "picked 2nd")}</span>
                </div>
              </div>
            </div>
            <div className="rounded border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30 px-2 py-2">
              <div className="font-bold text-red-700 dark:text-red-300 mb-1.5">❌ {t("Violation FIFO", "FIFO violation")}</div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 rounded bg-white/40 dark:bg-black/10 px-1.5 py-1">
                  <span className="text-[9px] font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">LOT-A</span>
                  <span className="text-[9px] opacity-70">01/01 — {t("ignoré", "ignored")}</span>
                  <span className="ml-auto text-red-500">⚠</span>
                </div>
                <div className="flex items-center gap-1.5 rounded bg-red-100 dark:bg-red-900/40 px-1.5 py-1">
                  <span className="text-[9px] font-mono bg-red-200 dark:bg-red-800 px-1 rounded">LOT-B</span>
                  <span className="text-[9px] opacity-70">15/01 — {t("prélevé 1er ❌", "picked 1st ❌")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Correction steps */}
        <div className="mb-3">
          <p className="text-[10px] font-bold uppercase tracking-wide opacity-60 mb-2">
            {t("Correction dans TEC.WMS", "Correction in TEC.WMS")}
          </p>
          <div className="space-y-1 text-[10px]">
            {[
              t("Annuler le transfert de picking incorrect", "Cancel the incorrect picking transfer"),
              t("Identifier le lot le plus ancien dans la zone STOCKAGE", "Identify the oldest lot in the STOCKAGE zone"),
              t("Recréer le picking avec le bon lot (LOT-A)", "Recreate the picking with the correct lot (LOT-A)"),
              t("Valider et documenter l'écart", "Validate and document the discrepancy"),
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-2 rounded border border-orange-200 dark:border-orange-800 bg-white/40 dark:bg-black/10 px-2 py-1">
                <span className="w-4 h-4 rounded-full bg-orange-200 dark:bg-orange-800 flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-orange-200 dark:border-orange-800 pt-3">
          <p className="text-[9px] italic opacity-60 mb-1.5">
            {t("Session Odoo requise — connectez-vous à Odoo EDU LAB avant d'ouvrir ce lien.", "Odoo session required — please log in to Odoo EDU LAB before opening this link.")}
          </p>
          <a href="https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/products" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-orange-300 dark:border-orange-700 text-[9px] font-medium opacity-70 hover:opacity-100 transition-opacity">
            <BookOpen size={10} />
            {t("Optionnel : Explorer dans Odoo ↗", "Optional: Explore in Odoo ↗")}
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── ERROR LAB 2 — Inventory Adjustment ──────────────────────────────────────

export function LabAdj() {
  const { t } = useLanguage();
  return (
    <div className="mt-4 border border-orange-300 dark:border-orange-700 rounded-md overflow-hidden">
      <div className="bg-orange-50 dark:bg-orange-950/50 px-4 py-2 border-b border-orange-200 dark:border-orange-800">
        <p className="text-[11px] font-semibold text-orange-700 dark:text-orange-300 leading-snug">
          ⚠️ {t("Écart de stock détecté — un ajustement d'inventaire est requis pour corriger le solde.", "Stock discrepancy detected — an inventory adjustment is required to correct the balance.")}
        </p>
      </div>
      <div className="bg-orange-50/60 dark:bg-orange-950/30 px-4 py-3 text-orange-800 dark:text-orange-200">
        <SlideHeader
          icon="🟠"
          labelFr="Odoo Lab — Ajustement d'inventaire"
          labelEn="Odoo Lab — Inventory Adjustment"
          badge={t("Erreur · ADJ", "Error · ADJ")}
          badgeColor="bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200"
        />

        <ConceptCard
          titleFr="Pourquoi un ajustement est nécessaire"
          titleEn="Why an adjustment is necessary"
          bodyFr="Après un comptage cyclique (CC), si le stock physique ≠ stock système → écart détecté. L'ADJ corrige le solde système pour qu'il reflète la réalité physique."
          bodyEn="After a cycle count (CC), if physical stock ≠ system stock → discrepancy detected. The ADJ corrects the system balance to reflect physical reality."
          color="border-orange-400 bg-orange-100/60 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200"
        />

        {/* Variance calculation visual */}
        <div className="mb-3">
          <p className="text-[10px] font-bold uppercase tracking-wide opacity-60 mb-2">
            {t("Calcul de l'écart — exemple", "Variance calculation — example")}
          </p>
          <div className="rounded border border-orange-200 dark:border-orange-700 bg-white/60 dark:bg-orange-900/20 p-2 text-[10px]">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-700 px-2 py-1.5">
                <div className="text-[9px] opacity-60 mb-0.5">{t("Stock système", "System stock")}</div>
                <div className="font-mono font-bold text-lg text-blue-600 dark:text-blue-400">50</div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-lg font-bold text-orange-500">−</div>
                <div className="text-[9px] opacity-50">{t("Comptage physique", "Physical count")}</div>
              </div>
              <div className="rounded bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-700 px-2 py-1.5">
                <div className="text-[9px] opacity-60 mb-0.5">{t("Stock physique", "Physical stock")}</div>
                <div className="font-mono font-bold text-lg text-green-600 dark:text-green-400">43</div>
              </div>
            </div>
            <div className="mt-2 rounded bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-700 px-2 py-1.5 text-center">
              <span className="text-[9px] opacity-60">{t("Écart", "Variance")} = </span>
              <span className="font-mono font-bold text-red-600 dark:text-red-400">−7 {t("unités", "units")}</span>
              <span className="text-[9px] opacity-60 ml-2">→ ADJ −7</span>
            </div>
          </div>
        </div>

        {/* Variance types */}
        <div className="mb-3">
          <p className="text-[10px] font-bold uppercase tracking-wide opacity-60 mb-2">
            {t("Types d'écarts et causes", "Variance types and causes")}
          </p>
          <div className="space-y-1 text-[10px]">
            {[
              { sign: "−", type: t("Écart négatif", "Negative variance"), causes: t("Vol, casse, erreur picking, péremption", "Theft, breakage, picking error, expiry"), color: "border-red-300 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200" },
              { sign: "+", type: t("Écart positif", "Positive variance"), causes: t("Double réception, retour non enregistré", "Double receipt, unrecorded return"), color: "border-green-300 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200" },
              { sign: "↻", type: t("Écart récurrent", "Recurring variance"), causes: t("Problème de processus → audit approfondi", "Process issue → deep audit required"), color: "border-orange-300 bg-orange-50 dark:bg-orange-950/30 text-orange-800 dark:text-orange-200" },
            ].map((v, i) => (
              <div key={i} className={`flex items-start gap-2 rounded border ${v.color} px-2 py-1`}>
                <span className="font-mono font-bold text-sm w-4 flex-shrink-0">{v.sign}</span>
                <span className="font-medium flex-shrink-0">{v.type}</span>
                <span className="opacity-70">— {v.causes}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-orange-200 dark:border-orange-800 pt-3">
          <p className="text-[9px] italic opacity-60 mb-1.5">
            {t("Session Odoo requise — connectez-vous à Odoo EDU LAB avant d'ouvrir ce lien.", "Odoo session required — please log in to Odoo EDU LAB before opening this link.")}
          </p>
          <a href="https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/reporting" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-orange-300 dark:border-orange-700 text-[9px] font-medium opacity-70 hover:opacity-100 transition-opacity">
            <BookOpen size={10} />
            {t("Optionnel : Explorer dans Odoo ↗", "Optional: Explore in Odoo ↗")}
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── ERROR LAB 3 — Compliance & Audit ────────────────────────────────────────

export function LabCompliance() {
  const { t } = useLanguage();
  return (
    <div className="mt-4 border border-orange-300 dark:border-orange-700 rounded-md overflow-hidden">
      <div className="bg-orange-50 dark:bg-orange-950/50 px-4 py-2 border-b border-orange-200 dark:border-orange-800">
        <p className="text-[11px] font-semibold text-orange-700 dark:text-orange-300 leading-snug">
          ⚠️ {t("Écart de conformité détecté — audit système requis", "Compliance issue detected — system audit required")}
        </p>
      </div>
      <div className="bg-orange-50/60 dark:bg-orange-950/30 px-4 py-3 text-orange-800 dark:text-orange-200">
        <SlideHeader
          icon="🟠"
          labelFr="Odoo Lab — Conformité et audit des transactions"
          labelEn="Odoo Lab — Transaction Compliance & Audit"
          badge={t("Erreur · Conformité", "Error · Compliance")}
          badgeColor="bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200"
        />

        <ConceptCard
          titleFr="Qu'est-ce que la non-conformité ?"
          titleEn="What is non-compliance?"
          bodyFr="Une transaction est non conforme si elle viole les règles du processus ERP : séquence incorrecte, document manquant, ou validation non effectuée."
          bodyEn="A transaction is non-compliant if it violates ERP process rules: incorrect sequence, missing document, or validation not performed."
          color="border-orange-400 bg-orange-100/60 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200"
        />

        {/* 3 anomaly type cards */}
        <div className="mb-3">
          <p className="text-[10px] font-bold uppercase tracking-wide opacity-60 mb-2">
            {t("Les 3 types d'anomalies de conformité", "The 3 types of compliance anomalies")}
          </p>
          <div className="space-y-2 text-[10px]">
            {[
              {
                num: "1",
                titleFr: "Transaction non postée",
                titleEn: "Unposted transaction",
                causesFr: "GR ou GI créé mais jamais validé",
                causesEn: "GR or GI created but never validated",
                impactFr: "Stock non mis à jour, paiement bloqué",
                impactEn: "Stock not updated, payment blocked",
                fixFr: "Valider ou annuler le document brouillon",
                fixEn: "Validate or cancel the draft document",
              },
              {
                num: "2",
                titleFr: "Écart de stock non résolu",
                titleEn: "Unresolved stock variance",
                causesFr: "CC détecté un écart, aucun ADJ créé",
                causesEn: "CC detected discrepancy, no ADJ created",
                impactFr: "Stock système ≠ stock réel → erreurs picking",
                impactEn: "System stock ≠ real stock → picking errors",
                fixFr: "Créer et valider l'ADJ correspondant",
                fixEn: "Create and validate the corresponding ADJ",
              },
              {
                num: "3",
                titleFr: "Mouvement sans document source",
                titleEn: "Movement without source document",
                causesFr: "Transfert de stock sans PO ou SO traçable",
                causesEn: "Stock transfer with no traceable PO or SO",
                impactFr: "Non-conformité audit interne / externe",
                impactEn: "Internal/external audit non-compliance",
                fixFr: "Créer le document source ou annuler",
                fixEn: "Create source document or cancel",
              },
            ].map((anomaly, i) => (
              <div key={i} className="rounded border border-orange-200 dark:border-orange-700 bg-white/40 dark:bg-black/10 overflow-hidden">
                <div className="flex items-center gap-2 px-2 py-1 bg-orange-100/60 dark:bg-orange-900/30 border-b border-orange-200 dark:border-orange-700">
                  <span className="w-4 h-4 rounded-full bg-orange-400 dark:bg-orange-600 text-white flex items-center justify-center text-[9px] font-bold">{anomaly.num}</span>
                  <span className="font-bold">{t(anomaly.titleFr, anomaly.titleEn)}</span>
                </div>
                <div className="grid grid-cols-3 divide-x divide-orange-200 dark:divide-orange-700 text-[9px]">
                  <div className="px-2 py-1"><span className="opacity-50 block">{t("Cause", "Cause")}</span>{t(anomaly.causesFr, anomaly.causesEn)}</div>
                  <div className="px-2 py-1"><span className="opacity-50 block">{t("Impact", "Impact")}</span>{t(anomaly.impactFr, anomaly.impactEn)}</div>
                  <div className="px-2 py-1"><span className="opacity-50 block">{t("Correction", "Fix")}</span>{t(anomaly.fixFr, anomaly.fixEn)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance checklist */}
        <div className="mb-3">
          <p className="text-[10px] font-bold uppercase tracking-wide opacity-60 mb-2">
            {t("Checklist de conformité TEC.WMS", "TEC.WMS compliance checklist")}
          </p>
          <div className="grid grid-cols-2 gap-1 text-[10px]">
            {[
              t("PO validé avant GR", "PO validated before GR"),
              t("GR posté avant Putaway", "GR posted before Putaway"),
              t("SO validé avant Picking", "SO validated before Picking"),
              t("Picking posté avant GI", "Picking posted before GI"),
              t("CC avec écart → ADJ obligatoire", "CC with variance → ADJ mandatory"),
              t("Chaque étape liée à un document source", "Each step linked to a source document"),
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 rounded border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200 px-2 py-1">
                <span className="text-green-500">✅</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-orange-200 dark:border-orange-800 pt-3">
          <p className="text-[9px] italic opacity-60 mb-1.5">
            {t("Session Odoo requise — connectez-vous à Odoo EDU LAB avant d'ouvrir ce lien.", "Odoo session required — please log in to Odoo EDU LAB before opening this link.")}
          </p>
          <a href="https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/receipts" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-orange-300 dark:border-orange-700 text-[9px] font-medium opacity-70 hover:opacity-100 transition-opacity">
            <BookOpen size={10} />
            {t("Optionnel : Explorer dans Odoo ↗", "Optional: Explore in Odoo ↗")}
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── M1 — STOCK: Stock Visibility (MMBE) ─────────────────────────────────────
export function LabStock() {
  const { t } = useLanguage();
  const stockTypes = [
    { icon: "✅", fr: "Disponible", en: "Available", descFr: "Peut être utilisé pour les commandes", descEn: "Can be used for orders", color: "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200" },
    { icon: "🔒", fr: "Réservé", en: "Reserved", descFr: "Affecté à un SO, non disponible", descEn: "Assigned to a SO, not available", color: "border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-950/30 text-orange-800 dark:text-orange-200" },
    { icon: "🔄", fr: "En transit", en: "In transit", descFr: "En cours de mouvement interne", descEn: "Currently in internal movement", color: "border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200" },
  ];
  return (
    <div className="mt-4 border border-emerald-300 dark:border-emerald-700 rounded-md overflow-hidden bg-emerald-50/60 dark:bg-emerald-950/30 px-4 py-3 text-emerald-800 dark:text-emerald-200">
      <SlideHeader
        icon="📊"
        labelFr="Odoo Lab — Visibilité stock (MMBE)"
        labelEn="Odoo Lab — Stock Visibility (MMBE)"
        badge="M1 · Core"
        badgeColor="bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200"
      />
      <ConceptCard
        titleFr="Concept clé"
        titleEn="Key concept"
        bodyFr="Le stock système n'est fiable que si chaque transaction est validée. Stock disponible ≠ Stock physique si des transactions sont en brouillon."
        bodyEn="System stock is only reliable if every transaction is validated. Available stock ≠ Physical stock if transactions are in draft."
        color="border-emerald-400 bg-emerald-100/60 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200"
      />
      <div className="mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wide opacity-60 mb-2">
          {t("Types de stock dans Odoo", "Stock types in Odoo")}
        </p>
        <div className="grid grid-cols-3 gap-1.5 text-[10px]">
          {stockTypes.map((s, i) => (
            <div key={i} className={`rounded border px-2 py-1.5 ${s.color}`}>
              <div className="text-base mb-0.5">{s.icon}</div>
              <div className="font-bold">{t(s.fr, s.en)}</div>
              <div className="opacity-70 leading-tight mt-0.5">{t(s.descFr, s.descEn)}</div>
            </div>
          ))}
        </div>
      </div>
      <MappingTable
        headerFr={["TEC.WMS", "Odoo Inventaire"]}
        headerEn={["TEC.WMS", "Odoo Inventory"]}
        rows={[
          { left: "MMBE", right: t("Inventaire → Rapport → Stock par emplacement", "Inventory → Reporting → Stock by Location") },
          { left: "Stock disponible", right: t("Quantité disponible", "On-hand quantity") },
          { left: "Stock réservé", right: t("Quantité réservée", "Reserved quantity") },
          { left: "Écart stock", right: t("Ajustement d'inventaire", "Inventory Adjustment") },
        ]}
      />
      <WarningBanner
        fr="Un écart non corrigé se propage à tous les modules suivants. Toujours vérifier MMBE après chaque transaction."
        en="An uncorrected discrepancy propagates to all subsequent modules. Always check MMBE after each transaction."
      />
      <OptionalOdooButton url="https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/products" />
    </div>
  );
}
// ─── M1 — FIFO_M1: FIFO Logic in Odoo ───────────────────────────────────────
export function LabFifoM1() {
  const { t } = useLanguage();
  return (
    <div className="mt-4 border border-violet-300 dark:border-violet-700 rounded-md overflow-hidden bg-violet-50/60 dark:bg-violet-950/30 px-4 py-3 text-violet-800 dark:text-violet-200">
      <SlideHeader
        icon="🔄"
        labelFr="Odoo Lab — Logique FIFO et sortie de stock"
        labelEn="Odoo Lab — FIFO Logic & Stock Issue"
        badge="M1 · Core"
        badgeColor="bg-violet-200 dark:bg-violet-800 text-violet-800 dark:text-violet-200"
      />
      <ConceptCard
        titleFr="Concept clé"
        titleEn="Key concept"
        bodyFr="FIFO = Premier Entré, Premier Sorti. Le lot le plus ANCIEN doit TOUJOURS être prélevé en premier. Violer le FIFO = risque de péremption, non-conformité réglementaire."
        bodyEn="FIFO = First In, First Out. The OLDEST lot must ALWAYS be picked first. Violating FIFO = expiry risk, regulatory non-compliance."
        color="border-violet-400 bg-violet-100/60 dark:bg-violet-900/40 text-violet-800 dark:text-violet-200"
      />
      <div className="mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wide opacity-60 mb-2">
          {t("Règle FIFO — Séquence obligatoire", "FIFO Rule — Mandatory sequence")}
        </p>
        <div className="flex items-stretch gap-1 text-[10px]">
          <div className="flex-1 rounded border border-violet-400 bg-violet-100/60 dark:bg-violet-900/40 px-1.5 py-1.5 text-center font-bold">
            <div className="text-base mb-0.5">📦</div>
            <div className="text-[9px] leading-tight">LOT-001</div>
            <div className="text-[9px] leading-tight opacity-70">Jan 2025</div>
            <div className="text-[9px] leading-tight text-violet-600 dark:text-violet-300">{t("Plus ancien", "Oldest")}</div>
          </div>
          <div className="flex items-center text-violet-400 font-bold text-base px-0.5">→</div>
          <div className="flex-1 rounded border border-gray-300 dark:border-gray-600 opacity-60 px-1.5 py-1.5 text-center">
            <div className="text-base mb-0.5">📦</div>
            <div className="text-[9px] leading-tight">LOT-002</div>
            <div className="text-[9px] leading-tight opacity-70">Mar 2025</div>
            <div className="text-[9px] leading-tight">{t("Plus récent", "More recent")}</div>
          </div>
          <div className="flex items-center text-violet-400 font-bold text-base px-0.5">→</div>
          <div className="flex-1 rounded border border-violet-400 bg-violet-100/60 dark:bg-violet-900/40 px-1.5 py-1.5 text-center font-bold">
            <div className="text-base mb-0.5">📤</div>
            <div className="text-[9px] leading-tight">{t("Livraison", "Delivery")}</div>
            <div className="text-[9px] leading-tight opacity-70">{t("client", "customer")}</div>
          </div>
        </div>
        <p className="text-[9px] mt-1.5 opacity-60">
          {t(
            "✅ LOT-001 sort en premier (FIFO respecté) · ❌ Sortir LOT-002 en premier = violation FIFO",
            "✅ LOT-001 exits first (FIFO respected) · ❌ Issuing LOT-002 first = FIFO violation"
          )}
        </p>
      </div>
      <MappingTable
        headerFr={["TEC.WMS", "Odoo Inventaire"]}
        headerEn={["TEC.WMS", "Odoo Inventory"]}
        rows={[
          { left: "GI FIFO (VL02N)", right: t("Valider une Livraison", "Validate a Delivery") },
          { left: "Sélection lot FIFO", right: t("Stratégie de retrait FIFO", "FIFO removal strategy") },
          { left: "Lot le plus ancien", right: t("Date de réception la plus ancienne", "Oldest receipt date") },
          { left: "Violation FIFO −20pts", right: t("Alerte de conformité", "Compliance alert") },
        ]}
      />
      <WarningBanner
        fr="FIFO est non négociable. Dans les secteurs pharma et alimentaire, une violation peut entraîner un rappel de produit."
        en="FIFO is non-negotiable. In pharma and food sectors, a violation can trigger a product recall."
      />
      <OptionalOdooButton url="https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/delivery-orders" />
    </div>
  );
}
// ─── M1 — LOTS: Lot Traceability ─────────────────────────────────────────────
export function LabLots() {
  const { t } = useLanguage();
  const traceSteps = [
    { icon: "🏭", fr: "Fournisseur", en: "Supplier" },
    { icon: "📦", fr: "GR + Lot assigné", en: "GR + Lot assigned" },
    { icon: "🗄️", fr: "Bin stockage", en: "Storage bin" },
    { icon: "📤", fr: "GI + Lot sorti", en: "GI + Lot issued" },
    { icon: "🚚", fr: "Client livré", en: "Customer delivered" },
  ];
  const navSteps = [
    t("1. Inventaire → Lots/Numéros de série", "1. Inventory → Lots/Serial Numbers"),
    t("2. Rechercher LOT-SKU005-A", "2. Search for LOT-SKU005-A"),
    t("3. Cliquer sur le lot → voir les détails", "3. Click on the lot → view details"),
    t("4. Onglet Traçabilité → voir tous les mouvements", "4. Traceability tab → view all movements"),
    t("5. Observer : GR entrée + GI sortie", "5. Observe: GR entry + GI exit"),
  ];
  return (
    <div className="mt-4 border border-rose-300 dark:border-rose-700 rounded-md overflow-hidden bg-rose-50/60 dark:bg-rose-950/30 px-4 py-3 text-rose-800 dark:text-rose-200">
      <SlideHeader
        icon="🔬"
        labelFr="Odoo Lab — Numéros de lot et traçabilité"
        labelEn="Odoo Lab — Lot Numbers & Traceability"
        badge="M1 · Core"
        badgeColor="bg-rose-200 dark:bg-rose-800 text-rose-800 dark:text-rose-200"
      />
      <ConceptCard
        titleFr="Concept clé"
        titleEn="Key concept"
        bodyFr="La traçabilité complète = Fournisseur → Lot → Emplacement → Client. Chaque mouvement de lot est enregistré dans l'historique Odoo."
        bodyEn="Full traceability = Supplier → Lot → Location → Customer. Every lot movement is recorded in Odoo history."
        color="border-rose-400 bg-rose-100/60 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200"
      />
      <div className="mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wide opacity-60 mb-2">
          {t("Chaîne de traçabilité complète", "Full traceability chain")}
        </p>
        <div className="flex items-center gap-0.5 text-[9px] flex-wrap">
          {traceSteps.map((node, i) => (
            <div key={i} className="flex items-center gap-0.5">
              <div className="rounded border border-rose-200 dark:border-rose-700 bg-white/40 dark:bg-rose-900/20 px-1.5 py-1 text-center">
                <div className="text-sm">{node.icon}</div>
                <div className="font-semibold leading-tight">{t(node.fr, node.en)}</div>
              </div>
              {i < traceSteps.length - 1 && <span className="text-rose-400 font-bold">→</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wide opacity-60 mb-2">
          {t("Navigation Odoo — Consulter un lot", "Odoo Navigation — View a lot")}
        </p>
        <div className="space-y-1 text-[10px]">
          {navSteps.map((step, i) => (
            <div key={i} className="flex items-center gap-1.5 rounded border border-rose-200 dark:border-rose-700 bg-white/30 dark:bg-rose-900/10 px-2 py-1">
              <span className="text-rose-500">▶</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
      <MappingTable
        headerFr={["TEC.WMS", "Odoo Inventaire"]}
        headerEn={["TEC.WMS", "Odoo Inventory"]}
        rows={[
          { left: "LOT-001, LOT-002", right: t("Numéros de lot Odoo", "Odoo lot numbers") },
          { left: "Historique mouvements", right: t("Onglet Traçabilité", "Traceability tab") },
          { left: "FIFO lot sélection", right: t("Stratégie retrait FIFO", "FIFO removal strategy") },
          { left: "Conformité lot", right: t("Rapport de traçabilité", "Traceability report") },
        ]}
      />
      <WarningBanner
        fr="Un lot sans historique complet = non-conformité réglementaire. Chaque mouvement doit être tracé."
        en="A lot without complete history = regulatory non-compliance. Every movement must be traced."
      />
      <OptionalOdooButton url="https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/lots" />
    </div>
  );
}

// ─── M2 — FIFO_PICK: FIFO Picking in Odoo ────────────────────────────────────
export function LabFifoPick_M2() {
  const { t, language } = useLanguage();
  const navSteps = language === "FR"
    ? ["Inventaire → Produits → SKU-001", "Onglet 'Prélèvements' → voir les mouvements en attente", "Vérifier : lot le plus ancien sélectionné en premier", "Comparer date entrée lot A vs lot B", "Confirmer : FIFO = premier entré, premier sorti"]
    : ["Inventory → Products → SKU-001", "Tab 'Pickings' → view pending moves", "Verify: oldest lot selected first", "Compare entry date lot A vs lot B", "Confirm: FIFO = first in, first out"];
  return (
    <div className="text-xs text-emerald-900 dark:text-emerald-100">
      <SlideHeader icon="📦" labelFr="Odoo Lab — Prélèvement FIFO" labelEn="Odoo Lab — FIFO Picking" badge="M2 · FIFO_PICK" badgeColor="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" />
      <ConceptCard
        titleFr="Règle FIFO dans Odoo" titleEn="FIFO Rule in Odoo"
        bodyFr="FIFO (First In First Out) = le stock le plus ancien est prélevé en premier. Dans Odoo, cette règle est configurée par produit ou catégorie."
        bodyEn="FIFO (First In First Out) = oldest stock is picked first. In Odoo, this rule is configured per product or category."
        color="border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30"
      />
      <div className="rounded-md border border-emerald-200 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/10 p-2 mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wide opacity-60 mb-2">
          {t("Vérification FIFO dans Odoo", "FIFO Verification in Odoo")}
        </p>
        <div className="space-y-1 text-[10px]">
          {navSteps.map((step, i) => (
            <div key={i} className="flex items-center gap-1.5 rounded border border-emerald-200 dark:border-emerald-700 bg-white/30 dark:bg-emerald-900/10 px-2 py-1">
              <span className="text-emerald-500">▶</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
      <MappingTable
        headerFr={["TEC.WMS", "Odoo Inventaire"]}
        headerEn={["TEC.WMS", "Odoo Inventory"]}
        rows={[
          { left: "FIFO_PICK step", right: t("Stratégie retrait FIFO", "FIFO removal strategy") },
          { left: "Lot le plus ancien", right: t("Date de réception la plus ancienne", "Oldest receipt date") },
          { left: "Ordre de prélèvement", right: t("Bon de livraison / Picking", "Delivery order / Picking") },
          { left: "Validation FIFO", right: t("Transfert validé Odoo", "Validated Odoo transfer") },
        ]}
      />
      <WarningBanner
        fr="Sans règle FIFO configurée, Odoo peut prélever n'importe quel lot — risque de péremption et non-conformité."
        en="Without FIFO rule configured, Odoo may pick any lot — expiry risk and non-compliance."
      />
      <OptionalOdooButton url="https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/picking-type-all" />
    </div>
  );
}

// ─── M2 — STOCK_ACCURACY: Inventory Accuracy in Odoo ─────────────────────────
export function LabStockAccuracy() {
  const { t, language } = useLanguage();
  const checkItems = language === "FR"
    ? ["Inventaire → Produits → Vérifier quantité disponible", "Comparer : stock système vs stock physique compté", "Identifier les écarts (variance positive ou négative)", "Créer ajustement d'inventaire si écart > seuil", "Valider l'ajustement → stock mis à jour"]
    : ["Inventory → Products → Check on-hand quantity", "Compare: system stock vs physical count", "Identify variances (positive or negative)", "Create inventory adjustment if variance > threshold", "Validate adjustment → stock updated"];
  return (
    <div className="text-xs text-blue-900 dark:text-blue-100">
      <SlideHeader icon="🎯" labelFr="Odoo Lab — Précision inventaire" labelEn="Odoo Lab — Stock Accuracy" badge="M2 · STOCK_ACCURACY" badgeColor="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" />
      <ConceptCard
        titleFr="Précision d'inventaire (Stock Accuracy)" titleEn="Inventory Accuracy (Stock Accuracy)"
        bodyFr="La précision d'inventaire mesure l'écart entre le stock système et le stock physique réel. Objectif industrie : ≥ 98%."
        bodyEn="Inventory accuracy measures the gap between system stock and real physical stock. Industry target: ≥ 98%."
        color="border-blue-500 bg-blue-50 dark:bg-blue-900/30"
      />
      <div className="rounded-md border border-blue-200 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10 p-2 mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wide opacity-60 mb-2">
          {t("Vérification précision dans Odoo", "Accuracy Check in Odoo")}
        </p>
        <div className="space-y-1 text-[10px]">
          {checkItems.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 rounded border border-blue-200 dark:border-blue-700 bg-white/30 dark:bg-blue-900/10 px-2 py-1">
              <span className="text-blue-500">▶</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <MappingTable
        headerFr={["TEC.WMS", "Odoo Inventaire"]}
        headerEn={["TEC.WMS", "Odoo Inventory"]}
        rows={[
          { left: "STOCK_ACCURACY step", right: t("Ajustement d'inventaire", "Inventory adjustment") },
          { left: "Variance détectée", right: t("Écart de stock Odoo", "Odoo stock variance") },
          { left: "ADJ créé + validé", right: t("Ajustement validé → stock corrigé", "Validated adjustment → corrected stock") },
          { left: "Précision ≥ 98%", right: t("Rapport de précision inventaire", "Inventory accuracy report") },
        ]}
      />
      <WarningBanner
        fr="Un écart non résolu en M2 = non-conformité en COMPLIANCE_ADV. Toujours valider l'ajustement avant de continuer."
        en="An unresolved variance in M2 = non-compliance in COMPLIANCE_ADV. Always validate the adjustment before continuing."
      />
      <OptionalOdooButton url="https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/inventory-adjustments" />
    </div>
  );
}

// ─── M3 — CC_RECON: Cycle Count Reconciliation in Odoo ───────────────────────
export function LabCcRecon() {
  const { t, language } = useLanguage();
  const steps = language === "FR"
    ? ["Inventaire → Inventaires physiques → Créer", "Sélectionner les emplacements à compter", "Saisir les quantités comptées réellement", "Valider → Odoo calcule les écarts automatiquement", "Créer ajustement pour chaque écart détecté"]
    : ["Inventory → Physical Inventories → Create", "Select locations to count", "Enter physically counted quantities", "Validate → Odoo calculates variances automatically", "Create adjustment for each detected variance"];
  return (
    <div className="text-xs text-violet-900 dark:text-violet-100">
      <SlideHeader icon="🔄" labelFr="Odoo Lab — Réconciliation inventaire cyclique" labelEn="Odoo Lab — Cycle Count Reconciliation" badge="M3 · CC_RECON" badgeColor="bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200" />
      <ConceptCard
        titleFr="Inventaire cyclique vs inventaire annuel" titleEn="Cycle Count vs Annual Inventory"
        bodyFr="L'inventaire cyclique compte une partie du stock en continu (ex: classe A chaque semaine). Plus précis et moins perturbant que l'inventaire annuel complet."
        bodyEn="Cycle counting counts part of the stock continuously (e.g., class A items weekly). More accurate and less disruptive than full annual inventory."
        color="border-violet-500 bg-violet-50 dark:bg-violet-900/30"
      />
      <div className="rounded-md border border-violet-200 dark:border-violet-700 bg-violet-50/50 dark:bg-violet-900/10 p-2 mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wide opacity-60 mb-2">
          {t("Processus inventaire cyclique Odoo", "Odoo Cycle Count Process")}
        </p>
        <div className="space-y-1 text-[10px]">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-1.5 rounded border border-violet-200 dark:border-violet-700 bg-white/30 dark:bg-violet-900/10 px-2 py-1">
              <span className="text-violet-500">▶</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
      <MappingTable
        headerFr={["TEC.WMS", "Odoo Inventaire"]}
        headerEn={["TEC.WMS", "Odoo Inventory"]}
        rows={[
          { left: "CC_LIST → CC_COUNT", right: t("Inventaire physique Odoo", "Odoo physical inventory") },
          { left: "Variance détectée", right: t("Ligne d'ajustement Odoo", "Odoo adjustment line") },
          { left: "CC_RECON (ADJ)", right: t("Validation ajustement Odoo", "Odoo adjustment validation") },
          { left: "Stock corrigé", right: t("Quantité disponible mise à jour", "Updated on-hand quantity") },
        ]}
      />
      <WarningBanner
        fr="Un inventaire cyclique non réconcilié = stock fantôme. Les commandes clients peuvent être acceptées pour du stock inexistant."
        en="An unreconciled cycle count = ghost stock. Customer orders may be accepted for non-existent stock."
      />
      <OptionalOdooButton url="https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/inventory-adjustments" />
    </div>
  );
}

// ─── M4 — KPI_DATA: KPI Data Collection in Odoo ──────────────────────────────
export function LabKpiData() {
  const { t, language } = useLanguage();
  const navSteps = language === "FR"
    ? ["Inventaire → Rapports → Mouvements de stock", "Filtrer par période (mois en cours)", "Exporter les données : entrées, sorties, valeur", "Inventaire → Produits → Voir quantité disponible", "Calculer : Rotation = Consommation / Stock moyen"]
    : ["Inventory → Reporting → Stock Moves", "Filter by period (current month)", "Export data: inflows, outflows, value", "Inventory → Products → View on-hand quantity", "Calculate: Turnover = Consumption / Average Stock"];
  return (
    <div className="text-xs text-amber-900 dark:text-amber-100">
      <SlideHeader icon="📊" labelFr="Odoo Lab — Collecte données KPI" labelEn="Odoo Lab — KPI Data Collection" badge="M4 · KPI_DATA" badgeColor="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" />
      <ConceptCard
        titleFr="Sources de données KPI dans Odoo" titleEn="KPI Data Sources in Odoo"
        bodyFr="Les KPI logistiques se calculent à partir des mouvements de stock, des niveaux d'inventaire et des délais de traitement — toutes ces données sont dans Odoo."
        bodyEn="Logistics KPIs are calculated from stock moves, inventory levels, and processing times — all this data is in Odoo."
        color="border-amber-500 bg-amber-50 dark:bg-amber-900/30"
      />
      <div className="rounded-md border border-amber-200 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10 p-2 mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wide opacity-60 mb-2">
          {t("Extraction données KPI dans Odoo", "KPI Data Extraction in Odoo")}
        </p>
        <div className="space-y-1 text-[10px]">
          {navSteps.map((step, i) => (
            <div key={i} className="flex items-center gap-1.5 rounded border border-amber-200 dark:border-amber-700 bg-white/30 dark:bg-amber-900/10 px-2 py-1">
              <span className="text-amber-500">▶</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
      <MappingTable
        headerFr={["KPI TEC.WMS", "Source Odoo"]}
        headerEn={["TEC.WMS KPI", "Odoo Source"]}
        rows={[
          { left: "Consommation annuelle", right: t("Rapports → Mouvements sortants", "Reports → Outgoing moves") },
          { left: "Stock moyen", right: t("Produits → Quantité disponible", "Products → On-hand qty") },
          { left: "Commandes livrées", right: t("Bons de livraison validés", "Validated delivery orders") },
          { left: "Valeur stock immobilisé", right: t("Valorisation de l'inventaire", "Inventory valuation") },
        ]}
      />
      <WarningBanner
        fr="Des données incomplètes (GR ou GI non postés) faussent tous les KPI. Vérifier la conformité avant d'analyser."
        en="Incomplete data (unposted GR or GI) distorts all KPIs. Verify compliance before analyzing."
      />
      <OptionalOdooButton url="https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/reporting" />
    </div>
  );
}

// ─── M4 — KPI_ROTATION: Inventory Turnover in Odoo ───────────────────────────
export function LabKpiRotation() {
  const { t } = useLanguage();
  return (
    <div className="text-xs text-orange-900 dark:text-orange-100">
      <SlideHeader icon="🔁" labelFr="Odoo Lab — Taux de rotation des stocks" labelEn="Odoo Lab — Inventory Turnover Rate" badge="M4 · KPI_ROTATION" badgeColor="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" />
      <ConceptCard
        titleFr="Taux de rotation = Consommation / Stock moyen" titleEn="Turnover Rate = Consumption / Average Stock"
        bodyFr="Un taux élevé = stock qui tourne vite = bonne liquidité. Un taux faible = surstock = capital immobilisé. Référence industrie : 4–12 rotations/an selon le secteur."
        bodyEn="High rate = fast-moving stock = good liquidity. Low rate = overstock = tied-up capital. Industry benchmark: 4–12 turns/year depending on sector."
        color="border-orange-500 bg-orange-50 dark:bg-orange-900/30"
      />
      <div className="rounded-md border border-orange-200 dark:border-orange-700 bg-orange-50/50 dark:bg-orange-900/10 p-2 mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wide opacity-60 mb-2">
          {t("Formule et interprétation", "Formula and Interpretation")}
        </p>
        <div className="space-y-1 text-[10px]">
          {[
            t("Rotation = Consommation annuelle ÷ Stock moyen", "Turnover = Annual consumption ÷ Average stock"),
            t("< 4 rotations → Surstock — réduire les commandes", "< 4 turns → Overstock — reduce orders"),
            t("4–12 rotations → Zone normale — maintenir", "4–12 turns → Normal zone — maintain"),
            t("> 12 rotations → Risque rupture — augmenter stock sécurité", "> 12 turns → Stockout risk — increase safety stock"),
            t("Odoo : Rapports → Analyse de stock → Rotation", "Odoo: Reports → Stock Analysis → Turnover"),
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 rounded border border-orange-200 dark:border-orange-700 bg-white/30 dark:bg-orange-900/10 px-2 py-1">
              <span className="text-orange-500">▶</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <MappingTable
        headerFr={["TEC.WMS", "Odoo Rapports"]}
        headerEn={["TEC.WMS", "Odoo Reports"]}
        rows={[
          { left: "KPI_ROTATION step", right: t("Analyse de stock Odoo", "Odoo stock analysis") },
          { left: "Surstock détecté", right: t("Rotation < 4 → alerte", "Turnover < 4 → alert") },
          { left: "Sous-performance", right: t("Rotation > 12 → risque rupture", "Turnover > 12 → stockout risk") },
          { left: "Action plan", right: t("Règles de réappro à ajuster", "Reorder rules to adjust") },
        ]}
      />
      <WarningBanner
        fr="Le taux de rotation seul ne suffit pas — toujours croiser avec le taux de service et le taux d'erreur."
        en="Turnover rate alone is not enough — always cross with service level and error rate."
      />
      <OptionalOdooButton url="https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/reporting" />
    </div>
  );
}

// ─── M4 — KPI_SERVICE: Service Level in Odoo ─────────────────────────────────
export function LabKpiService() {
  const { t } = useLanguage();
  return (
    <div className="text-xs text-teal-900 dark:text-teal-100">
      <SlideHeader icon="🎖️" labelFr="Odoo Lab — Taux de service (OTIF)" labelEn="Odoo Lab — Service Level (OTIF)" badge="M4 · KPI_SERVICE" badgeColor="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200" />
      <ConceptCard
        titleFr="OTIF = On Time In Full" titleEn="OTIF = On Time In Full"
        bodyFr="OTIF mesure le % de commandes livrées à temps et complètes. C'est le KPI client principal en logistique. Objectif : ≥ 95%."
        bodyEn="OTIF measures the % of orders delivered on time and complete. It is the primary customer KPI in logistics. Target: ≥ 95%."
        color="border-teal-500 bg-teal-50 dark:bg-teal-900/30"
      />
      <div className="rounded-md border border-teal-200 dark:border-teal-700 bg-teal-50/50 dark:bg-teal-900/10 p-2 mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wide opacity-60 mb-2">
          {t("Calcul taux de service dans Odoo", "Service Level Calculation in Odoo")}
        </p>
        <div className="space-y-1 text-[10px]">
          {[
            t("Taux de service = Commandes livrées / Total commandes × 100", "Service level = Orders fulfilled / Total orders × 100"),
            t("Odoo : Ventes → Commandes → Filtrer 'Livré'", "Odoo: Sales → Orders → Filter 'Done'"),
            t("Comparer date promise vs date réelle de livraison", "Compare promised date vs actual delivery date"),
            t("< 90% → Problème critique — analyser les causes", "< 90% → Critical issue — analyze root causes"),
            t("≥ 95% → Performance acceptable — maintenir", "≥ 95% → Acceptable performance — maintain"),
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 rounded border border-teal-200 dark:border-teal-700 bg-white/30 dark:bg-teal-900/10 px-2 py-1">
              <span className="text-teal-500">▶</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <MappingTable
        headerFr={["TEC.WMS", "Odoo"]}
        headerEn={["TEC.WMS", "Odoo"]}
        rows={[
          { left: "KPI_SERVICE step", right: t("Bons de livraison Odoo", "Odoo delivery orders") },
          { left: "Commandes livrées", right: t("Transferts validés", "Validated transfers") },
          { left: "Taux d'erreur", right: t("Retours / Annulations", "Returns / Cancellations") },
          { left: "OTIF ≥ 95%", right: t("Objectif performance client", "Customer performance target") },
        ]}
      />
      <WarningBanner
        fr="Un faible taux de service = clients insatisfaits = perte de contrats. Toujours identifier la cause racine avant d'agir."
        en="Low service level = dissatisfied customers = lost contracts. Always identify root cause before acting."
      />
      <OptionalOdooButton url="https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/reporting" />
    </div>
  );
}

// ─── M5 — M5_RECEPTION: End-to-End Reception in Odoo ─────────────────────────
export function LabM5Reception() {
  const { t, language } = useLanguage();
  const steps = language === "FR"
    ? ["Achats → Bons de commande → Valider le PO", "Inventaire → Réceptions → Trouver le bon de réception", "Vérifier les quantités reçues vs commandées", "Valider la réception → stock mis à jour automatiquement", "Vérifier : Inventaire → Produits → Quantité disponible"]
    : ["Purchases → Purchase Orders → Validate PO", "Inventory → Receipts → Find the receipt", "Verify received quantities vs ordered", "Validate receipt → stock updated automatically", "Verify: Inventory → Products → On-hand quantity"];
  return (
    <div className="text-xs text-sky-900 dark:text-sky-100">
      <SlideHeader icon="🏭" labelFr="Odoo Lab — Réception intégrée M5" labelEn="Odoo Lab — M5 Integrated Reception" badge="M5 · M5_RECEPTION" badgeColor="bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200" />
      <ConceptCard
        titleFr="Flux intégré : PO → GR → Stock" titleEn="Integrated Flow: PO → GR → Stock"
        bodyFr="En M5, vous simulez le flux complet. La réception n'est que la première étape — chaque action a un impact sur toutes les étapes suivantes."
        bodyEn="In M5, you simulate the complete flow. Reception is just the first step — every action impacts all subsequent steps."
        color="border-sky-500 bg-sky-50 dark:bg-sky-900/30"
      />
      <div className="rounded-md border border-sky-200 dark:border-sky-700 bg-sky-50/50 dark:bg-sky-900/10 p-2 mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wide opacity-60 mb-2">
          {t("Réception fournisseur dans Odoo", "Supplier Reception in Odoo")}
        </p>
        <div className="space-y-1 text-[10px]">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-1.5 rounded border border-sky-200 dark:border-sky-700 bg-white/30 dark:bg-sky-900/10 px-2 py-1">
              <span className="text-sky-500">▶</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
      <MappingTable
        headerFr={["TEC.WMS M5", "Odoo"]}
        headerEn={["TEC.WMS M5", "Odoo"]}
        rows={[
          { left: "M5_RECEPTION", right: t("Bon de réception validé", "Validated receipt") },
          { left: "PO → GR", right: t("Achat → Réception Odoo", "Purchase → Odoo Receipt") },
          { left: "Stock mis à jour", right: t("Qté disponible +", "On-hand qty +") },
          { left: "Traçabilité lot", right: t("Lot créé à la réception", "Lot created at receipt") },
        ]}
      />
      <WarningBanner
        fr="En M5, une erreur à la réception se propage à toutes les étapes suivantes. Vérifier avant de valider."
        en="In M5, a reception error propagates to all subsequent steps. Verify before validating."
      />
      <OptionalOdooButton url="https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/receipts" />
    </div>
  );
}

// ─── M5 — M5_PUTAWAY: M5 Putaway & FIFO in Odoo ──────────────────────────────
export function LabM5Putaway() {
  const { t } = useLanguage();
  return (
    <div className="text-xs text-indigo-900 dark:text-indigo-100">
      <SlideHeader icon="📍" labelFr="Odoo Lab — Rangement FIFO M5" labelEn="Odoo Lab — M5 FIFO Putaway" badge="M5 · M5_PUTAWAY" badgeColor="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200" />
      <ConceptCard
        titleFr="Rangement + FIFO = précision opérationnelle" titleEn="Putaway + FIFO = operational accuracy"
        bodyFr="En M5, le rangement correct ET le respect du FIFO sont tous les deux requis pour la conformité finale. Une erreur sur l'un affecte l'autre."
        bodyEn="In M5, correct putaway AND FIFO compliance are both required for final compliance. An error in one affects the other."
        color="border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
      />
      <div className="rounded-md border border-indigo-200 dark:border-indigo-700 bg-indigo-50/50 dark:bg-indigo-900/10 p-2 mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wide opacity-60 mb-2">
          {t("Validation rangement dans Odoo", "Putaway Validation in Odoo")}
        </p>
        <div className="space-y-1 text-[10px]">
          {[
            t("Inventaire → Transferts internes → Voir rangement", "Inventory → Internal Transfers → View putaway"),
            t("Vérifier : emplacement destination = règle putaway", "Verify: destination location = putaway rule"),
            t("Inventaire → Lots → Vérifier date entrée", "Inventory → Lots → Check entry date"),
            t("Confirmer : lot le plus ancien = emplacement accessible", "Confirm: oldest lot = accessible location"),
            t("Valider le transfert interne", "Validate the internal transfer"),
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 rounded border border-indigo-200 dark:border-indigo-700 bg-white/30 dark:bg-indigo-900/10 px-2 py-1">
              <span className="text-indigo-500">▶</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <MappingTable
        headerFr={["TEC.WMS M5", "Odoo"]}
        headerEn={["TEC.WMS M5", "Odoo"]}
        rows={[
          { left: "M5_PUTAWAY", right: t("Transfert interne Odoo", "Odoo internal transfer") },
          { left: "Règle putaway", right: t("Configuration → Règles rangement", "Configuration → Putaway rules") },
          { left: "FIFO validé", right: t("Stratégie retrait = FIFO", "Removal strategy = FIFO") },
          { left: "Emplacement correct", right: t("Destination = WH/Stock/Zone", "Destination = WH/Stock/Zone") },
        ]}
      />
      <WarningBanner
        fr="En M5, un mauvais rangement + violation FIFO = double non-conformité. Les deux doivent être corrects simultanément."
        en="In M5, wrong putaway + FIFO violation = double non-compliance. Both must be correct simultaneously."
      />
      <OptionalOdooButton url="https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/configuration/putaway-rules" />
    </div>
  );
}

// ─── M5 — M5_REPLENISH: M5 Replenishment in Odoo ─────────────────────────────
export function LabM5Replenish() {
  const { t } = useLanguage();
  return (
    <div className="text-xs text-green-900 dark:text-green-100">
      <SlideHeader icon="🔋" labelFr="Odoo Lab — Réapprovisionnement intégré M5" labelEn="Odoo Lab — M5 Integrated Replenishment" badge="M5 · M5_REPLENISH" badgeColor="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" />
      <ConceptCard
        titleFr="Réapprovisionnement = réponse au cycle count" titleEn="Replenishment = response to cycle count"
        bodyFr="En M5, le réapprovisionnement est déclenché par les résultats du cycle count. Si le stock est sous le seuil Min, une demande d'achat doit être créée."
        bodyEn="In M5, replenishment is triggered by cycle count results. If stock is below Min threshold, a purchase request must be created."
        color="border-green-500 bg-green-50 dark:bg-green-900/30"
      />
      <div className="rounded-md border border-green-200 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10 p-2 mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wide opacity-60 mb-2">
          {t("Réapprovisionnement dans Odoo", "Replenishment in Odoo")}
        </p>
        <div className="space-y-1 text-[10px]">
          {[
            t("Inventaire → Réapprovisionnement → Voir les alertes", "Inventory → Replenishment → View alerts"),
            t("Identifier les SKU sous le seuil Min", "Identify SKUs below Min threshold"),
            t("Cliquer 'Commander' → Bon de commande créé automatiquement", "Click 'Order' → Purchase order created automatically"),
            t("Vérifier : Achats → Bons de commande → Nouveau PO", "Verify: Purchases → Purchase Orders → New PO"),
            t("Valider le PO → En attente de réception", "Validate PO → Awaiting receipt"),
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 rounded border border-green-200 dark:border-green-700 bg-white/30 dark:bg-green-900/10 px-2 py-1">
              <span className="text-green-500">▶</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <MappingTable
        headerFr={["TEC.WMS M5", "Odoo"]}
        headerEn={["TEC.WMS M5", "Odoo"]}
        rows={[
          { left: "M5_REPLENISH", right: t("Règle de réapprovisionnement", "Replenishment rule") },
          { left: "Stock < Min", right: t("Alerte réapprovisionnement", "Replenishment alert") },
          { left: "Demande d'achat", right: t("Bon de commande automatique", "Automatic purchase order") },
          { left: "Validation PO", right: t("PO confirmé → En attente GR", "PO confirmed → Awaiting GR") },
        ]}
      />
      <WarningBanner
        fr="En M5, un réapprovisionnement non déclenché après un cycle count avec écart = non-conformité de processus."
        en="In M5, replenishment not triggered after a cycle count with variance = process non-compliance."
      />
      <OptionalOdooButton url="https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/reordering-rules" />
    </div>
  );
}

// ─── M5 — M5_KPI: KPI Calculation in Integrated Flow ─────────────────────────
export function LabM5Kpi() {
  const { t } = useLanguage();
  return (
    <div className="text-xs text-rose-900 dark:text-rose-100">
      <SlideHeader icon="📈" labelFr="Odoo Lab — KPI flux intégré M5" labelEn="Odoo Lab — M5 Integrated KPI" badge="M5 · M5_KPI" badgeColor="bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200" />
      <ConceptCard
        titleFr="KPI = mesure de la performance du flux complet" titleEn="KPI = measure of complete flow performance"
        bodyFr="En M5, les KPI reflètent la performance de TOUTES les étapes précédentes. Un KPI faible révèle une défaillance opérationnelle quelque part dans le flux."
        bodyEn="In M5, KPIs reflect the performance of ALL previous steps. A weak KPI reveals an operational failure somewhere in the flow."
        color="border-rose-500 bg-rose-50 dark:bg-rose-900/30"
      />
      <div className="rounded-md border border-rose-200 dark:border-rose-700 bg-rose-50/50 dark:bg-rose-900/10 p-2 mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wide opacity-60 mb-2">
          {t("Tableau de bord KPI dans Odoo", "KPI Dashboard in Odoo")}
        </p>
        <div className="space-y-1 text-[10px]">
          {[
            t("Inventaire → Rapports → Vue d'ensemble", "Inventory → Reporting → Overview"),
            t("Vérifier : Rotation, Taux de service, Valeur stock", "Check: Turnover, Service level, Stock value"),
            t("Identifier le KPI le plus faible → cause racine", "Identify weakest KPI → root cause"),
            t("Croiser avec les mouvements de stock de la session", "Cross with stock moves from the session"),
            t("Proposer une action corrective justifiée par les données", "Propose corrective action justified by data"),
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 rounded border border-rose-200 dark:border-rose-700 bg-white/30 dark:bg-rose-900/10 px-2 py-1">
              <span className="text-rose-500">▶</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <MappingTable
        headerFr={["TEC.WMS M5", "Odoo Rapports"]}
        headerEn={["TEC.WMS M5", "Odoo Reports"]}
        rows={[
          { left: "M5_KPI", right: t("Tableau de bord inventaire", "Inventory dashboard") },
          { left: "Rotation calculée", right: t("Analyse de stock Odoo", "Odoo stock analysis") },
          { left: "Taux de service", right: t("Livraisons validées / Total", "Validated deliveries / Total") },
          { left: "Décision stratégique", right: t("Plan d'action basé sur KPI", "KPI-based action plan") },
        ]}
      />
      <WarningBanner
        fr="En M5, la décision stratégique doit être justifiée par les KPI calculés — pas par intuition. Référencer les chiffres."
        en="In M5, the strategic decision must be justified by calculated KPIs — not intuition. Reference the numbers."
      />
      <OptionalOdooButton url="https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/reporting" />
    </div>
  );
}
