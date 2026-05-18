/**
 * CredentialVerify.tsx
 * Public credential verification page — TEC.LOG institutional design
 * Accessible at /verify/:credentialId — no login required
 * Mobile-friendly, LinkedIn-shareable
 */

import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { useEffect, useRef } from "react";

type CertType = "m1_fundamentals" | "m2m5_integrated";

function getCertTitle(certType: CertType) {
  return certType === "m1_fundamentals"
    ? "TEC.LOG Fundamentals Certification"
    : "TEC.LOG Integrated ERP/WMS Logistics Certification";
}

function getCertSubtitle(certType: CertType) {
  return certType === "m1_fundamentals"
    ? "Module 1 — Fondements ERP/WMS"
    : "Modules 2–5 — Simulation opérationnelle intégrée";
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("fr-CA", {
    year: "numeric", month: "long", day: "numeric",
  });
}

function buildLinkedInUrl(cert: { certType: CertType; credentialId: string; verificationUrl: string; issuedAt: Date | string }) {
  const params = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: getCertTitle(cert.certType),
    organizationName: "Collège de la Concorde",
    issueYear: String(new Date(cert.issuedAt).getFullYear()),
    issueMonth: String(new Date(cert.issuedAt).getMonth() + 1),
    certId: cert.credentialId,
    certUrl: cert.verificationUrl,
  });
  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}

// QR code canvas renderer (pure canvas, no library needed on frontend)
function QRCanvas({ url }: { url: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Simple visual placeholder — actual QR is in the PDF
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 120;
    canvas.height = 120;

    // Draw a simple QR-like placeholder
    ctx.fillStyle = "#f0f4f9";
    ctx.fillRect(0, 0, 120, 120);
    ctx.fillStyle = "#0C3269";
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "center";
    ctx.fillText("QR CODE", 60, 55);
    ctx.font = "7px monospace";
    ctx.fillText("(dans le PDF)", 60, 68);
    ctx.strokeStyle = "#0C3269";
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 4, 112, 112);
    // Corner squares
    [[4,4],[88,4],[4,88]].forEach(([x,y]) => {
      ctx.fillStyle = "#0C3269";
      ctx.fillRect(x, y, 28, 28);
      ctx.fillStyle = "#f0f4f9";
      ctx.fillRect(x+5, y+5, 18, 18);
      ctx.fillStyle = "#0C3269";
      ctx.fillRect(x+9, y+9, 10, 10);
    });
  }, [url]);

  return <canvas ref={canvasRef} className="rounded-lg" style={{ width: 80, height: 80 }} />;
}

export default function CredentialVerify() {
  const params = useParams<{ credentialId: string }>();
  const credentialId = params.credentialId || "";

  const { data: cert, isLoading, error } = trpc.certification.getByCredentialId.useQuery(
    { credentialId },
    { enabled: !!credentialId }
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f0f4f9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#0C3269] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[#0C3269] font-medium text-sm">Vérification en cours...</p>
        </div>
      </div>
    );
  }

  // Not found
  if (!cert) {
    return (
      <div className="min-h-screen bg-[#f0f4f9] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">✗</span>
          </div>
          <h1 className="text-[#0C3269] text-xl font-bold mb-2">Certification introuvable</h1>
          <p className="text-slate-500 text-sm mb-4">
            L'identifiant <code className="bg-slate-100 px-1 rounded text-xs">{credentialId}</code> ne correspond à aucune certification valide dans notre système.
          </p>
          <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-400">
            Collège de la Concorde · Département Techniques de la logistique
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f9] flex flex-col items-center justify-center px-4 py-10">

      {/* SEO meta hint (og:title etc handled by server ideally) */}
      <div className="w-full max-w-2xl">

        {/* Verification status banner */}
        <div className={`flex items-center gap-3 px-5 py-3 rounded-xl mb-5 shadow-sm ${cert.isValid ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${cert.isValid ? "bg-emerald-500" : "bg-red-500"}`}>
            {cert.isValid ? "✓" : "✗"}
          </div>
          <div>
            <div className={`font-bold text-sm ${cert.isValid ? "text-emerald-700" : "text-red-700"}`}>
              {cert.isValid ? "Certification vérifiée et valide" : "Certification révoquée ou invalide"}
            </div>
            <div className="text-xs text-slate-500">
              Vérification automatique · Collège de la Concorde · TEC.LOG
            </div>
          </div>
        </div>

        {/* Main verification card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">

          {/* Header */}
          <div className="bg-[#0C3269] px-6 py-5 relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#C9A227]" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[#C9A227] text-[10px] font-bold tracking-widest uppercase mb-1">
                  Collège de la Concorde · Département Techniques de la logistique
                </p>
                <h1 className="text-white text-xl font-bold leading-tight">
                  {getCertTitle(cert.certType)}
                </h1>
                <p className="text-slate-300 text-sm mt-0.5">{getCertSubtitle(cert.certType)}</p>
              </div>
              <div className="bg-[#0078D7] text-white px-3 py-2 rounded-lg text-center shrink-0">
                <div className="text-base font-black">TEC.LOG</div>
                <div className="text-[9px] tracking-widest font-semibold text-blue-200">CERTIFICATION</div>
              </div>
            </div>
          </div>

          {/* Gold accent */}
          <div className="h-1 bg-gradient-to-r from-[#C9A227] via-[#E8C84A] to-[#C9A227]" />

          {/* Body */}
          <div className="px-6 py-6">
            <p className="text-slate-500 text-xs mb-1">Ce certificat a été décerné à</p>
            <h2 className="text-[#0C3269] text-2xl font-black mb-4">{cert.studentName}</h2>

            {/* Stats row */}
            <div className="flex flex-wrap gap-3 mb-5">
              <div className="flex items-center gap-2 bg-[#f0f4f9] border border-slate-200 rounded-lg px-3 py-2">
                <div className="w-1.5 h-7 bg-[#0078D7] rounded-full" />
                <div>
                  <div className="text-[9px] text-slate-500 font-semibold uppercase tracking-wide">Score</div>
                  <div className="text-[#0C3269] text-base font-black">{cert.finalScore}<span className="text-xs font-normal text-slate-400">/100</span></div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-[#f0f4f9] border border-slate-200 rounded-lg px-3 py-2">
                <div className="w-1.5 h-7 bg-emerald-500 rounded-full" />
                <div>
                  <div className="text-[9px] text-slate-500 font-semibold uppercase tracking-wide">Émis le</div>
                  <div className="text-[#0C3269] text-sm font-bold">{formatDate(cert.issuedAt)}</div>
                </div>
              </div>
            </div>

            {/* Competencies */}
            <div className="mb-5">
              <p className="text-[9px] text-[#0078D7] font-bold uppercase tracking-widest mb-2">Compétences validées</p>
              <div className="space-y-1.5">
                {(cert.competencies as string[]).map((comp, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="text-[#C9A227] font-bold mt-0.5 shrink-0">✓</span>
                    <span>{comp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Credential ID + QR */}
            <div className="flex flex-wrap gap-4 items-start justify-between border-t border-slate-100 pt-4">
              <div>
                <div className="bg-[#0C3269] text-white px-4 py-2 rounded-lg inline-block mb-2">
                  <div className="text-[8px] text-slate-300 font-semibold uppercase tracking-widest mb-0.5">Identifiant de certification</div>
                  <div className="text-sm font-mono font-bold">{cert.credentialId}</div>
                </div>
                <div className="text-[10px] text-slate-400">
                  Hash : <span className="font-mono">{cert.verificationHash.substring(0, 16)}...</span>
                </div>
                <div className="mt-2 text-[10px] text-slate-500">
                  URL : <a href={cert.verificationUrl} className="text-[#0078D7] hover:underline break-all">{cert.verificationUrl}</a>
                </div>
              </div>
              <div className="text-center">
                <QRCanvas url={cert.verificationUrl} />
                <div className="text-[9px] text-slate-400 mt-1">Scanner pour vérifier</div>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="bg-[#f8f9fc] border-t border-slate-100 px-6 py-4">
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <a
                href={buildLinkedInUrl(cert as any)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Ajouter à LinkedIn
              </a>
              <button
                onClick={() => navigator.clipboard.writeText(cert.verificationUrl)}
                className="text-[#0078D7] hover:text-[#0C3269] text-xs font-semibold border border-[#0078D7] hover:border-[#0C3269] px-3 py-1.5 rounded-md transition-colors"
              >
                🔗 Copier le lien
              </button>
            </div>
          </div>
        </div>

        {/* Institutional footer */}
        <div className="mt-5 text-center text-[10px] text-slate-400">
          <p>Collège de la Concorde · 570 rue Saint-Vallier Ouest, Québec, G1K 1K1</p>
          <p>Département Techniques de la logistique · TEC.LOG · <a href="https://www.collegelaconcorde.com" target="_blank" rel="noopener noreferrer" className="hover:underline">www.collegelaconcorde.com</a></p>
        </div>
      </div>
    </div>
  );
}
