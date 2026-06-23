#!/usr/bin/env node
/**
 * Generate GUIDE_MONITORING_COHORTE_TECWMS.pdf and .docx
 * from the institutional markdown source.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import fsSync from "node:fs";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const inputMd = path.join(root, "GUIDE_MONITORING_COHORTE_TECWMS.md");
const outputPdf = path.join(root, "GUIDE_MONITORING_COHORTE_TECWMS.pdf");
const outputDocx = path.join(root, "GUIDE_MONITORING_COHORTE_TECWMS.docx");
const outputHtml = path.join(root, "GUIDE_MONITORING_COHORTE_TECWMS.html");

const toolsDir = path.join(__dirname, ".pdf-tools");
fsSync.mkdirSync(toolsDir, { recursive: true });
const toolsPkg = path.join(toolsDir, "package.json");
if (!fsSync.existsSync(toolsPkg)) {
  fsSync.writeFileSync(
    toolsPkg,
    JSON.stringify({ name: "pdf-tools", private: true, type: "commonjs" }, null, 2)
  );
}
const require = createRequire(toolsPkg);

async function ensureDeps() {
  const needed = ["puppeteer", "marked", "pdf-lib", "html-to-docx"];
  const missing = needed.filter((pkg) => {
    try {
      require.resolve(pkg);
      return false;
    } catch {
      return true;
    }
  });
  if (missing.length) {
    console.log(`Installing ${missing.join(", ")} (isolated)...`);
    execSync(`npm install ${missing.join(" ")}`, { cwd: toolsDir, stdio: "inherit" });
  }
}

function stripFrontMatter(raw) {
  if (raw.startsWith("---")) {
    const end = raw.indexOf("\n---", 3);
    if (end !== -1) return raw.slice(end + 4).trimStart();
  }
  return raw;
}

function preprocessMarkdown(raw) {
  return stripFrontMatter(raw)
    .replace(/^\\newpage\s*$/gm, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(
      /(<div class="cover-page">[\s\S]*?<\/div>)\s*<div class="page-break"><\/div>/i,
      "$1"
    );
}

function buildHtmlDocument(bodyHtml, embeddedStyles) {
  return `<!DOCTYPE html>
<html lang="fr-CA">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TEC.WMS — Guide de suivi des cohortes</title>
  <style>
    @page {
      size: A4;
      margin: 22mm 20mm 24mm 20mm;
    }
    @page :first {
      margin: 0;
    }
    * { box-sizing: border-box; }
    body {
      font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
      font-size: 10.5pt;
      line-height: 1.45;
      color: #1a1a1a;
      margin: 0;
      padding: 0;
    }
    h1, h2, h3, h4 {
      color: #0f2d52;
      page-break-after: avoid;
    }
    h1 { font-size: 1.55em; margin-top: 1.2em; border-bottom: 2px solid #0f2d52; padding-bottom: 0.25em; }
    h2 { font-size: 1.25em; margin-top: 1em; }
    h3 { font-size: 1.05em; margin-top: 0.85em; color: #234a73; }
    p, li { orphans: 3; widows: 3; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 0.8em 0 1em;
      font-size: 9.5pt;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #bbb;
      padding: 0.45em 0.55em;
      vertical-align: top;
      text-align: left;
    }
    th {
      background: #e8eef4;
      font-weight: 600;
      color: #0f2d52;
    }
    tr:nth-child(even) td { background: #f8fafc; }
    blockquote {
      margin: 0.8em 0;
      padding: 0.6em 1em;
      border-left: 4px solid #0f2d52;
      background: #f4f7fa;
      color: #333;
    }
    code {
      font-family: Consolas, "Courier New", monospace;
      font-size: 0.92em;
      background: #f0f0f0;
      padding: 0.1em 0.3em;
      border-radius: 3px;
    }
    pre {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 0.8em 1em;
      font-size: 9pt;
      line-height: 1.35;
      white-space: pre-wrap;
      page-break-inside: avoid;
    }
    hr {
      border: none;
      border-top: 1px solid #ccc;
      margin: 1.2em 0;
    }
    ul, ol { padding-left: 1.4em; }
    a { color: #0f2d52; text-decoration: none; }
    .page-break {
      page-break-after: always;
      break-after: page;
      height: 0;
      margin: 0;
      padding: 0;
      border: none;
    }
    .cover-page {
      width: 210mm;
      min-height: 297mm;
      text-align: center;
      padding: 55mm 25mm 20mm;
      page-break-after: always;
      break-after: page;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
    }
    .cover-page .brand {
      font-size: 2.6em;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: #0f2d52;
      margin-bottom: 1.5em;
    }
    .cover-page .title-block h1 {
      font-size: 1.55em;
      font-weight: 600;
      line-height: 1.45;
      margin: 0.35em 0;
      border: none;
      color: #1a1a1a;
    }
    .cover-page .subtitle-block {
      margin-top: 45mm;
      font-size: 1.15em;
      line-height: 1.65;
      color: #333;
    }
    .cover-page .meta {
      margin-top: 35mm;
      font-size: 0.95em;
      color: #555;
      line-height: 1.6;
    }
    ${embeddedStyles}
  </style>
</head>
<body>
${bodyHtml}
</body>
</html>`;
}

async function generatePdf(html, outPath) {
  const puppeteer = require("puppeteer");
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const coverHeight = await page.evaluate(() => {
      const cover = document.querySelector(".cover-page");
      return cover ? cover.offsetHeight : 1122;
    });

    const coverPdf = await page.pdf({
      pageRanges: "1",
      width: "210mm",
      height: `${Math.max(coverHeight, 1122)}px`,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    const bodyPdf = await page.pdf({
      pageRanges: "2-",
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="width:100%;font-size:8pt;color:#444;padding:0 20mm;display:flex;justify-content:space-between;font-family:Segoe UI,Arial,sans-serif;">
          <span>TEC.WMS — Guide de suivi des cohortes</span>
          <span>Collège de la Concorde</span>
        </div>`,
      footerTemplate: `
        <div style="width:100%;font-size:8pt;color:#555;padding:0 20mm;display:flex;justify-content:space-between;font-family:Segoe UI,Arial,sans-serif;">
          <span>Collège de la Concorde · Simulateur pédagogique ERP/WMS · juin 2026</span>
          <span>Page <span class="pageNumber"></span></span>
        </div>`,
      margin: { top: "18mm", bottom: "20mm", left: "20mm", right: "20mm" },
    });

    const { PDFDocument } = require("pdf-lib");
    const merged = await PDFDocument.create();
    const coverDoc = await PDFDocument.load(coverPdf);
    const bodyDoc = await PDFDocument.load(bodyPdf);
    const coverPages = await merged.copyPages(coverDoc, coverDoc.getPageIndices());
    coverPages.forEach((p) => merged.addPage(p));
    const bodyPages = await merged.copyPages(bodyDoc, bodyDoc.getPageIndices());
    bodyPages.forEach((p) => merged.addPage(p));
    const pdfBytes = await merged.save();
    await fs.writeFile(outPath, pdfBytes);
  } finally {
    await browser.close();
  }
}

async function generateDocx(html, outPath) {
  const HTMLtoDOCX = require("html-to-docx");
  const docxBuffer = await HTMLtoDOCX(html, null, {
    table: { row: { cantSplit: true } },
    footer: true,
    pageNumber: true,
    font: "Segoe UI",
    fontSize: 22,
    margins: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
  });
  await fs.writeFile(outPath, docxBuffer);
}

async function verifyPdf(outPath) {
  const { PDFDocument } = require("pdf-lib");
  const bytes = await fs.readFile(outPath);
  const doc = await PDFDocument.load(bytes);
  const pageCount = doc.getPageCount();
  const stat = await fs.stat(outPath);
  const raw = bytes.toString("latin1");
  const accentSamples = ["é", "è", "à", "ô", "û", "ç", "É"];
  const accentsFound = accentSamples.filter((ch) => raw.includes(ch));
  return {
    pageCount,
    sizeKb: Math.round(stat.size / 1024),
    accentsFound,
    accentSampleCount: accentsFound.length,
  };
}

const FORBIDDEN_TERMS = [
  "RC13",
  "RC14",
  "RC15",
  "Railway",
  "feature flag",
  ".manus-logs",
  "commit",
  "branch",
  "Checkpoint Engine",
  "module_progress",
  "isDemo",
  "recomputeModule",
  "backfill",
];

function auditTerminology(mdContent) {
  const canonicalTerms = [
    "Certification Silver Premium TEC.WMS",
    "Certification Gold Premium TEC.WMS",
    "Collège de la Concorde",
    "TEC.LOG",
    "Mini-WMS Concorde",
    "GOV-T01",
    "Fiche Mission",
    "Run Report",
    "Constitution pédagogique TEC.WMS",
    "TECWMS-SIL-",
    "TECWMS-GOLD-",
    "LOCKED",
    "IN_PROGRESS",
    "ELIGIBLE",
    "AWARDED",
    "SCN-001",
    "SCN-017",
    "validation enseignante",
    "système de progression par checkpoints",
  ];

  const forbiddenFound = FORBIDDEN_TERMS.filter((term) =>
    mdContent.toLowerCase().includes(term.toLowerCase())
  );

  const canonicalPresent = canonicalTerms.filter((term) => mdContent.includes(term));
  const canonicalMissing = canonicalTerms.filter((term) => !mdContent.includes(term));

  return { forbiddenFound, canonicalPresent, canonicalMissing };
}

async function main() {
  await ensureDeps();

  const marked = require("marked");
  marked.setOptions({ gfm: true, breaks: false });

  const raw = await fs.readFile(inputMd, "utf8");
  const audit = auditTerminology(raw);

  const styleMatch = raw.match(/<style>([\s\S]*?)<\/style>/);
  const embeddedStyles = styleMatch ? styleMatch[1] : "";

  const md = preprocessMarkdown(raw);
  const bodyHtml = marked.parse(md);
  const html = buildHtmlDocument(bodyHtml, embeddedStyles);
  await fs.writeFile(outputHtml, html, "utf8");

  console.log("Generating PDF...");
  await generatePdf(html, outputPdf);

  console.log("Generating DOCX...");
  await generateDocx(html, outputDocx);

  const verification = await verifyPdf(outputPdf);
  const docxStat = await fs.stat(outputDocx);
  const mdStat = await fs.stat(inputMd);

  console.log("\n=== Output Verification ===");
  console.log(`MD:   ${inputMd}`);
  console.log(`      Size: ${Math.round(mdStat.size / 1024)} KB`);
  console.log(`PDF:  ${outputPdf}`);
  console.log(`      Pages: ${verification.pageCount} | Size: ${verification.sizeKb} KB`);
  console.log(`      Accents: ${verification.accentSampleCount}/7`);
  console.log(`DOCX: ${outputDocx}`);
  console.log(`      Size: ${Math.round(docxStat.size / 1024)} KB`);

  console.log("\n=== Terminology Audit ===");
  if (audit.forbiddenFound.length === 0) {
    console.log("Forbidden terms: NONE FOUND ✓");
  } else {
    console.log(`Forbidden terms FOUND: ${audit.forbiddenFound.join(", ")}`);
  }
  console.log(`Canonical terms present: ${audit.canonicalPresent.length}/${audit.canonicalPresent.length + audit.canonicalMissing.length}`);
  if (audit.canonicalMissing.length) {
    console.log(`Canonical terms missing: ${audit.canonicalMissing.join(", ")}`);
  }
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
