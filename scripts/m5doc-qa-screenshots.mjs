/**
 * Visual QA fixtures for M5 DOC (no production DB required).
 * Writes PNGs under output/m5-doc-qa/
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const outDir = join(process.cwd(), "output", "m5-doc-qa");
mkdirSync(outDir, { recursive: true });

const pages = [
  {
    name: "01_association_pre",
    title: "Pré-M5 — Association granulaire",
    body: `
      <h1>Association granulaire Pré-M5</h1>
      <p>Chaque source a son propre sélecteur — aucune combinaison préfabriquée.</p>
      <label>Compléter chargement 143<select aria-label="Associer demande"><option>— Choisir —</option><option>Demande</option><option>Écart</option></select></label>
      <label>Température 144<select aria-label="Associer écart"><option>— Choisir —</option><option>Demande</option><option>Écart</option></select></label>
      <button disabled>Valider les associations</button>
    `,
  },
  {
    name: "02_journal",
    title: "Journal de mission",
    body: `<h1>Journal de suivi (vue)</h1>
      <div class="grid">
        <div class="card"><b>Ouvertes</b><div>D-143, D-117, D-144</div></div>
        <div class="card"><b>En cours</b><div>—</div></div>
        <div class="card"><b>Sous surveillance</b><div>D-144</div></div>
      </div>`,
  },
  {
    name: "03_scn016",
    title: "SCN-016 — Posture",
    body: `<h1>INT-016-06 Posture</h1>
      <select aria-label="Posture"><option>Maintenir sous surveillance</option><option>Réaffecter</option><option>Escalader</option></select>
      <select aria-label="Responsable"><option>Conserver technicien frigo</option></select>
      <label>Re-lecture (minutes) <input type="number" value="15" /></label>
      <label><input type="checkbox" checked /> Exiger preuve 2–4 °C avant clôture</label>`,
  },
  {
    name: "04_matrix_017",
    title: "SCN-017 — Matrice",
    body: `<h1>Matrice 3×2</h1>
      <table><tr><th>Demande</th><th>Ressource</th><th>Mode</th></tr>
      <tr><td>D-117</td><td><select aria-label="Ressource D-117"><option>— Choisir —</option></select></td><td><select aria-label="Mode D-117"><option>— Choisir —</option></select></td></tr>
      <tr><td>D-143</td><td><select><option>— Choisir —</option></select></td><td><select><option>— Choisir —</option></select></td></tr>
      <tr><td>D-144</td><td><select><option>— Choisir —</option></select></td><td><select><option>— Choisir —</option></select></td></tr>
      </table>
      <button disabled>Valider la matrice</button>`,
  },
  {
    name: "05_post_handover",
    title: "Post-M5 — Handover",
    body: `<h1>Handover structuré</h1>
      <pre>{"stillOpen":["D-143","D-117","D-144"],"gaps":["E-144"],"interventions":["OI-143"]}</pre>
      <button>Transmettre le handover</button>`,
  },
  {
    name: "06_professor_view",
    title: "Professor View DOC",
    body: `<h1>M5 DOC — Professor View</h1>
      <p>Run #42 · SCN-015-DOC · score 100/100 · supervision-doc-v1 · m5-session-v2</p>
      <div class="grid">
        <div class="card">Progression 31/31</div>
        <div class="card">Cohérence +8</div>
        <div class="card">Handover Transmis</div>
      </div>
      <table><tr><th>Interaction</th><th>Mode</th><th>Résultat</th></tr>
      <tr><td>INT-016-06</td><td>OFFICIAL</td><td>OK</td></tr>
      <tr><td>INT-017-02</td><td>OFFICIAL</td><td>OK</td></tr>
      </table>`,
  },
  {
    name: "07_legacy_control",
    title: "Contrôle legacy ops-ledger",
    body: `<h1>M5 Legacy (ops-ledger-v1) — contrôle</h1>
      <p>Ce panneau simule le chrome legacy non modifié (réception / putaway / KPI).</p>
      <div class="card">M5_RECEPTION → M5_PUTAWAY → … (chemin legacy)</div>
      <p class="muted">Aucun élément DOC dans cette vue de contrôle.</p>`,
  },
];

const css = `
  body{font-family:Segoe UI,Calibri,sans-serif;background:#f3f0eb;color:#1b242e;padding:24px}
  h1{font-size:22px;margin:0 0 12px}
  label,select,button,input{display:block;margin:8px 0;font-size:14px}
  select,button,input{padding:8px 10px}
  button{background:#1f6f6a;color:#fff;border:0;border-radius:4px}
  button:disabled{opacity:.45}
  .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:12px}
  .card{background:#fff;border:1px solid #c9d0ce;border-radius:6px;padding:12px}
  table{width:100%;border-collapse:collapse;background:#fff}
  th,td{border:1px solid #c9d0ce;padding:8px;text-align:left;font-size:13px}
  pre{background:#fff;border:1px solid #c9d0ce;padding:12px;font-size:12px}
  .muted{color:#5c6872;font-size:13px}
`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const index = [];

for (const p of pages) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${p.title}</title><style>${css}</style></head><body>${p.body}</body></html>`;
  const htmlPath = join(outDir, `${p.name}.html`);
  writeFileSync(htmlPath, html, "utf8");
  await page.setContent(html, { waitUntil: "load" });
  const pngPath = join(outDir, `${p.name}.png`);
  await page.screenshot({ path: pngPath, fullPage: true });
  index.push({ title: p.title, html: htmlPath, png: pngPath });
}

writeFileSync(join(outDir, "INDEX.json"), JSON.stringify(index, null, 2));
await browser.close();
console.log(JSON.stringify({ ok: true, count: index.length, outDir }, null, 2));
