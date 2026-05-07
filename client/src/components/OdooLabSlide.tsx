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
          "Session Odoo requise — connectez-vous à Concorde Logistics Lab avant d'ouvrir ce lien.",
          "Odoo session required — please log in to Concorde Logistics Lab before opening this link."
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
        labelFr="Odoo Lab — Règles de réapprovisionnement"
        labelEn="Odoo Lab — Replenishment Rules"
        badge="M3 · Core"
        badgeColor="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
      />

      <ConceptCard
        titleFr="Concept clé"
        titleEn="Key concept"
        bodyFr="Le réapprovisionnement automatique repose sur des règles Min/Max. Quand le stock descend sous le seuil Min, le système génère automatiquement une demande d'achat."
        bodyEn="Automatic replenishment relies on Min/Max rules. When stock drops below the Min threshold, the system automatically generates a purchase request."
        color="border-blue-400 bg-blue-100/60 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200"
      />

      {/* Min/Max visual gauge */}
      <div className="mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wide opacity-60 mb-2">
          {t("Logique Min/Max — exemple", "Min/Max logic — example")}
        </p>
        <div className="rounded border border-blue-200 dark:border-blue-700 bg-white/60 dark:bg-blue-900/20 p-3">
          <div className="flex justify-between text-[9px] font-mono mb-1 opacity-60">
            <span>0</span><span>Min=20</span><span>Stock=15</span><span>Max=100</span>
          </div>
          {/* Bar */}
          <div className="relative h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 overflow-hidden border border-blue-200 dark:border-blue-700">
            {/* Max zone */}
            <div className="absolute inset-0 bg-green-200 dark:bg-green-900/40 rounded-full" style={{ width: "100%" }} />
            {/* Min zone */}
            <div className="absolute inset-0 bg-orange-200 dark:bg-orange-900/40 rounded-full" style={{ width: "20%" }} />
            {/* Current stock */}
            <div className="absolute inset-y-0 left-0 bg-red-400 dark:bg-red-600 rounded-full flex items-center justify-end pr-1" style={{ width: "15%" }}>
              <span className="text-white text-[8px] font-bold">15</span>
            </div>
            {/* Min line */}
            <div className="absolute inset-y-0 border-l-2 border-orange-500 border-dashed" style={{ left: "20%" }} />
          </div>
          <div className="flex justify-between text-[9px] mt-1">
            <span className="text-red-600 dark:text-red-400 font-bold">⚠️ {t("Stock < Min", "Stock < Min")}</span>
            <span className="text-green-600 dark:text-green-400 font-bold">{t("Commander 85 unités", "Order 85 units")} (100−15)</span>
          </div>
        </div>
      </div>

      {/* Formula cards */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-[10px]">
        {[
          { label: t("Seuil Min", "Min Threshold"), formula: "= 20", desc: t("Déclenche la commande", "Triggers the order"), color: "border-orange-300 bg-orange-50 dark:bg-orange-950/30 text-orange-800 dark:text-orange-200" },
          { label: t("Seuil Max", "Max Threshold"), formula: "= 100", desc: t("Quantité cible", "Target quantity"), color: "border-green-300 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200" },
          { label: t("Qté commandée", "Order Qty"), formula: "Max − Stock", desc: "= 100 − 15 = 85", color: "border-blue-300 bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200" },
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
        fr="Sans règle Min/Max : rupture de stock possible sans alerte système."
        en="Without Min/Max rules: stockout possible with no system alert."
      />
      <OptionalOdooButton url="https://edu-concorde-logistics-lab.odoo.com/odoo/inventory/reordering-rules" />
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
            {t("Session Odoo requise — connectez-vous à Concorde Logistics Lab avant d'ouvrir ce lien.", "Odoo session required — please log in to Concorde Logistics Lab before opening this link.")}
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
            {t("Session Odoo requise — connectez-vous à Concorde Logistics Lab avant d'ouvrir ce lien.", "Odoo session required — please log in to Concorde Logistics Lab before opening this link.")}
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
            {t("Session Odoo requise — connectez-vous à Concorde Logistics Lab avant d'ouvrir ce lien.", "Odoo session required — please log in to Concorde Logistics Lab before opening this link.")}
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
