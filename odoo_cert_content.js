// Odoo Certification Articles — TEC.LOG
// Run this in the browser console on the Odoo admin page

// ─── CERT 1: TEC.LOG Fundamentals (M1) ────────────────────────────────────────
const cert1Html = `<div style="font-family:'Segoe UI',Arial,sans-serif;background:#0f1e2e;min-height:100vh;padding:40px 20px;">
  <div style="max-width:820px;margin:0 auto;">

    <div style="background:#1e3a2e;color:#6ee7b7;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:6px 16px;border-radius:20px;display:inline-block;margin-bottom:20px;">Certification — Module 1</div>

    <h1 style="color:#ffffff;font-size:28px;font-weight:800;margin:0 0 8px;">TEC.LOG Fundamentals Certification</h1>
    <p style="color:#94a3b8;font-size:14px;margin:0 0 32px;">Validation des fondements opérationnels ERP/WMS — Module 1</p>

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:32px;">
      <div style="background:#1a2d3d;border:1px solid #2d4a5e;border-radius:10px;padding:16px;text-align:center;">
        <div style="color:#6ee7b7;font-size:22px;font-weight:800;">M1</div>
        <div style="color:#94a3b8;font-size:11px;margin-top:4px;">Module couvert</div>
      </div>
      <div style="background:#1a2d3d;border:1px solid #2d4a5e;border-radius:10px;padding:16px;text-align:center;">
        <div style="color:#6ee7b7;font-size:22px;font-weight:800;">60%</div>
        <div style="color:#94a3b8;font-size:11px;margin-top:4px;">Score minimum requis</div>
      </div>
      <div style="background:#1a2d3d;border:1px solid #2d4a5e;border-radius:10px;padding:16px;text-align:center;">
        <div style="color:#6ee7b7;font-size:22px;font-weight:800;">TEC.WMS</div>
        <div style="color:#94a3b8;font-size:11px;margin-top:4px;">Moteur d'évaluation officiel</div>
      </div>
    </div>

    <div style="background:#1a2d3d;border:1px solid #2d4a5e;border-radius:12px;padding:24px;margin-bottom:24px;">
      <h2 style="color:#6ee7b7;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">Compétences validées</h2>
      <ul style="list-style:none;padding:0;margin:0;space-y:8px;">
        <li style="color:#e2e8f0;font-size:13px;padding:6px 0;border-bottom:1px solid #2d4a5e;">✅ Comprendre le flux opérationnel complet : PO → GR → PUTAWAY → STOCK → SO → GI → CC → COMPLIANCE</li>
        <li style="color:#e2e8f0;font-size:13px;padding:6px 0;border-bottom:1px solid #2d4a5e;">✅ Distinguer "créer" vs "valider/poster" dans un ERP/WMS</li>
        <li style="color:#e2e8f0;font-size:13px;padding:6px 0;border-bottom:1px solid #2d4a5e;">✅ Identifier le reflet Odoo ERP de chaque étape du processus M1</li>
        <li style="color:#e2e8f0;font-size:13px;padding:6px 0;border-bottom:1px solid #2d4a5e;">✅ Exécuter une réception marchandises (GR) et valider le mouvement de stock</li>
        <li style="color:#e2e8f0;font-size:13px;padding:6px 0;border-bottom:1px solid #2d4a5e;">✅ Effectuer un comptage cyclique (CC) et corriger les écarts</li>
        <li style="color:#e2e8f0;font-size:13px;padding:6px 0;">✅ Valider la conformité système et identifier les anomalies</li>
      </ul>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
      <div style="background:#1a2d3d;border:1px solid #2d4a5e;border-radius:12px;padding:20px;">
        <h3 style="color:#60a5fa;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">Validation requise — TEC.WMS</h3>
        <ul style="list-style:none;padding:0;margin:0;">
          <li style="color:#94a3b8;font-size:12px;padding:4px 0;">📋 Leçons M1 complétées (Odoo EDU LAB)</li>
          <li style="color:#94a3b8;font-size:12px;padding:4px 0;">📝 Quiz M1 réussi (≥ 60%)</li>
          <li style="color:#94a3b8;font-size:12px;padding:4px 0;">🎯 Scénario(s) M1 TEC.WMS complété(s)</li>
          <li style="color:#94a3b8;font-size:12px;padding:4px 0;">✅ Conformité système validée</li>
        </ul>
      </div>
      <div style="background:#1a2d3d;border:1px solid #2d4a5e;border-radius:12px;padding:20px;">
        <h3 style="color:#a78bfa;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">Référence Odoo EDU LAB</h3>
        <ul style="list-style:none;padding:0;margin:0;">
          <li style="color:#94a3b8;font-size:12px;padding:4px 0;">🔗 Réception marchandises (GR)</li>
          <li style="color:#94a3b8;font-size:12px;padding:4px 0;">🔗 Mise à jour inventaire Odoo</li>
          <li style="color:#94a3b8;font-size:12px;padding:4px 0;">🔗 Traçabilité des mouvements</li>
          <li style="color:#94a3b8;font-size:12px;padding:4px 0;">🔗 Rapport de conformité</li>
        </ul>
      </div>
    </div>

    <div style="background:#1e3a2e;border:1px solid #2d6a4f;border-radius:12px;padding:20px;text-align:center;">
      <p style="color:#6ee7b7;font-size:13px;font-weight:600;margin:0 0 8px;">Évaluation officielle via TEC.WMS Simulator</p>
      <p style="color:#94a3b8;font-size:12px;margin:0;">Accédez à TEC.WMS pour compléter vos scénarios d'évaluation. Le score officiel est calculé par le moteur TEC.WMS, pas par ce portail.</p>
    </div>

  </div>
</div>`;

// ─── CERT 2: TEC.LOG Final Certification (M2–M5) ──────────────────────────────
const cert2Html = `<div style="font-family:'Segoe UI',Arial,sans-serif;background:#0f1e2e;min-height:100vh;padding:40px 20px;">
  <div style="max-width:820px;margin:0 auto;">

    <div style="background:#1e2a4e;color:#818cf8;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:6px 16px;border-radius:20px;display:inline-block;margin-bottom:20px;">Certification Finale — Modules 2 à 5</div>

    <h1 style="color:#ffffff;font-size:28px;font-weight:800;margin:0 0 8px;">TEC.LOG — Integrated ERP/WMS Logistics Certification</h1>
    <p style="color:#94a3b8;font-size:14px;margin:0 0 32px;">Certification du parcours complet — Exécution, Contrôle, KPIs et Simulation intégrée</p>

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;margin-bottom:32px;">
      <div style="background:#1a2d3d;border:1px solid #2d4a5e;border-radius:10px;padding:14px;text-align:center;">
        <div style="color:#818cf8;font-size:20px;font-weight:800;">M2</div>
        <div style="color:#94a3b8;font-size:10px;margin-top:4px;">Exécution entrepôt</div>
      </div>
      <div style="background:#1a2d3d;border:1px solid #2d4a5e;border-radius:10px;padding:14px;text-align:center;">
        <div style="color:#818cf8;font-size:20px;font-weight:800;">M3</div>
        <div style="color:#94a3b8;font-size:10px;margin-top:4px;">Contrôle des stocks</div>
      </div>
      <div style="background:#1a2d3d;border:1px solid #2d4a5e;border-radius:10px;padding:14px;text-align:center;">
        <div style="color:#818cf8;font-size:20px;font-weight:800;">M4</div>
        <div style="color:#94a3b8;font-size:10px;margin-top:4px;">KPIs logistiques</div>
      </div>
      <div style="background:#1a2d3d;border:1px solid #2d4a5e;border-radius:10px;padding:14px;text-align:center;">
        <div style="color:#818cf8;font-size:20px;font-weight:800;">M5</div>
        <div style="color:#94a3b8;font-size:10px;margin-top:4px;">Simulation intégrée</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
      <div style="background:#1a2d3d;border:1px solid #2d4a5e;border-radius:10px;padding:16px;text-align:center;">
        <div style="color:#818cf8;font-size:22px;font-weight:800;">60%</div>
        <div style="color:#94a3b8;font-size:11px;margin-top:4px;">Score minimum par module</div>
      </div>
      <div style="background:#1a2d3d;border:1px solid #2d4a5e;border-radius:10px;padding:16px;text-align:center;">
        <div style="color:#818cf8;font-size:22px;font-weight:800;">TEC.WMS</div>
        <div style="color:#94a3b8;font-size:11px;margin-top:4px;">Moteur d'évaluation officiel</div>
      </div>
    </div>

    <div style="background:#1a2d3d;border:1px solid #2d4a5e;border-radius:12px;padding:24px;margin-bottom:24px;">
      <h2 style="color:#818cf8;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">Compétences validées — Parcours complet</h2>
      <ul style="list-style:none;padding:0;margin:0;">
        <li style="color:#e2e8f0;font-size:13px;padding:6px 0;border-bottom:1px solid #2d4a5e;">✅ M2 — Maîtriser les emplacements, règles de rangement (putaway), transferts internes et FIFO</li>
        <li style="color:#e2e8f0;font-size:13px;padding:6px 0;border-bottom:1px solid #2d4a5e;">✅ M3 — Exécuter un inventaire cyclique, gérer la traçabilité par lots, configurer les règles Min/Max</li>
        <li style="color:#e2e8f0;font-size:13px;padding:6px 0;border-bottom:1px solid #2d4a5e;">✅ M4 — Lire et interpréter les KPIs logistiques (OTIF, Fill Rate, Lead Time, Turnover)</li>
        <li style="color:#e2e8f0;font-size:13px;padding:6px 0;border-bottom:1px solid #2d4a5e;">✅ M5 — Exécuter un flux opérationnel end-to-end avec audit de conformité</li>
        <li style="color:#e2e8f0;font-size:13px;padding:6px 0;border-bottom:1px solid #2d4a5e;">✅ Connecter exécution entrepôt, contrôle des stocks, KPIs et audit final</li>
        <li style="color:#e2e8f0;font-size:13px;padding:6px 0;">✅ Utiliser Odoo EDU LAB comme couche ERP de documentation et de preuve</li>
      </ul>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
      <div style="background:#1a2d3d;border:1px solid #2d4a5e;border-radius:12px;padding:20px;">
        <h3 style="color:#60a5fa;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">Validation requise — TEC.WMS</h3>
        <ul style="list-style:none;padding:0;margin:0;">
          <li style="color:#94a3b8;font-size:12px;padding:4px 0;">📋 M2 complété (scénarios + Odoo Lab)</li>
          <li style="color:#94a3b8;font-size:12px;padding:4px 0;">📋 M3 complété (scénarios + Odoo Lab)</li>
          <li style="color:#94a3b8;font-size:12px;padding:4px 0;">📋 M4 complété (scénarios + Odoo Lab)</li>
          <li style="color:#94a3b8;font-size:12px;padding:4px 0;">📋 M5 complété (scénario intégré final)</li>
          <li style="color:#94a3b8;font-size:12px;padding:4px 0;">✅ Conformité audit M5 validée</li>
        </ul>
      </div>
      <div style="background:#1a2d3d;border:1px solid #2d4a5e;border-radius:12px;padding:20px;">
        <h3 style="color:#a78bfa;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">Référence Odoo EDU LAB</h3>
        <ul style="list-style:none;padding:0;margin:0;">
          <li style="color:#94a3b8;font-size:12px;padding:4px 0;">🔗 M2 — Emplacements & règles putaway</li>
          <li style="color:#94a3b8;font-size:12px;padding:4px 0;">🔗 M3 — Règles réapprovisionnement</li>
          <li style="color:#94a3b8;font-size:12px;padding:4px 0;">🔗 M4 — Tableau de bord KPI</li>
          <li style="color:#94a3b8;font-size:12px;padding:4px 0;">🔗 M5 — Flux intégré & piste d'audit</li>
        </ul>
      </div>
    </div>

    <div style="background:#1e2a4e;border:1px solid #3730a3;border-radius:12px;padding:20px;text-align:center;">
      <p style="color:#818cf8;font-size:13px;font-weight:600;margin:0 0 8px;">Évaluation officielle via TEC.WMS Simulator</p>
      <p style="color:#94a3b8;font-size:12px;margin:0;">Complétez les scénarios M2 à M5 dans TEC.WMS pour obtenir cette certification. Le score officiel est calculé par le moteur TEC.WMS.</p>
    </div>

  </div>
</div>`;

// Export for use
window._cert1Html = cert1Html;
window._cert2Html = cert2Html;
console.log('Cert HTML ready. cert1 length:', cert1Html.length, 'cert2 length:', cert2Html.length);
