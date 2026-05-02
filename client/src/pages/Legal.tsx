import { useLocation } from "wouter";
import { ArrowLeft, Shield, BookOpen, Lock, AlertTriangle, Mail } from "lucide-react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029779635/KgVchfh3nwnwCSCPgkNzAq/concorde-logo_73f38483.png";

export default function Legal() {
  const [, navigate] = useLocation();

  const sections = [
    {
      icon: Shield,
      title: "Propriété intellectuelle",
      content: `Le simulateur Mini-WMS, incluant son interface utilisateur, ses scénarios pédagogiques, sa logique métier, ses algorithmes de scoring, ses documents de formation et l'ensemble de ses composants logiciels, constitue une œuvre originale protégée par les lois canadiennes et québécoises sur le droit d'auteur.

Toute reproduction, adaptation, distribution, transmission ou utilisation de tout ou partie de ce simulateur, sous quelque forme ou par quelque moyen que ce soit, sans l'autorisation écrite préalable du Collège de la Concorde, est strictement interdite.

Les noms, logos et marques du Collège de la Concorde sont la propriété exclusive de l'établissement.`,
    },
    {
      icon: BookOpen,
      title: "Usage pédagogique",
      content: `Ce simulateur est conçu exclusivement à des fins pédagogiques, dans le cadre des programmes de formation du Collège de la Concorde — Montréal.

Il est destiné aux étudiants inscrits aux cours concernés et au personnel enseignant autorisé. L'accès est nominatif et non transférable.

Les résultats générés par le simulateur (scores, rapports de conformité, progression) sont des indicateurs pédagogiques et ne constituent pas une évaluation de compétences professionnelles réelles. Ce simulateur n'est pas un logiciel ERP de production et ne représente pas les opérations réelles d'une entreprise.`,
    },
    {
      icon: Lock,
      title: "Données et confidentialité",
      content: `Les comptes utilisateurs sont utilisés uniquement à des fins de contrôle d'accès et de suivi pédagogique. Les données collectées se limitent à :

• Informations d'identification (nom, courriel via authentification OAuth)
• Données de progression pédagogique (étapes complétées, scores, statut de conformité)
• Horodatage des sessions de simulation

Aucune donnée sensible (financière, médicale, personnelle au sens de la Loi 25) n'est collectée ou stockée. Les données de progression sont conservées pour la durée du cours concerné et peuvent être supprimées sur demande auprès de l'administration.

Conformément à la Loi modernisant des dispositions législatives en matière de protection des renseignements personnels (Loi 25, Québec), les utilisateurs disposent d'un droit d'accès et de rectification de leurs données.`,
    },
    {
      icon: AlertTriangle,
      title: "Limitation de responsabilité",
      content: `Ce simulateur est un outil pédagogique. Les scénarios, données, entreprises et situations présentés sont entièrement fictifs et créés à des fins d'apprentissage uniquement.

Le Collège de la Concorde ne saurait être tenu responsable de toute décision prise sur la base des résultats de ce simulateur. Les processus simulés sont une représentation simplifiée et pédagogique de systèmes ERP/WMS réels (notamment SAP S/4HANA) et ne reflètent pas nécessairement les pratiques exactes de ces systèmes en environnement de production.

L'établissement se réserve le droit de modifier, suspendre ou interrompre l'accès au simulateur à tout moment, sans préavis.`,
    },
    {
      icon: Mail,
      title: "Contact",
      content: `Pour toute question relative aux présentes mentions légales, à la protection des données ou à l'utilisation du simulateur, veuillez contacter :

Administration — Collège de la Concorde
Montréal, Québec, Canada

Courriel : admin@college-concorde.ca
(Adresse à confirmer auprès de l'administration)

Site institutionnel : www.collegedelaconcorde.ca`,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f7]">
      {/* Minimal header */}
      <header className="bg-[#0f2a44] px-6 py-3 flex items-center gap-4">
        <img src={LOGO_URL} alt="Collège de la Concorde" className="h-7 object-contain brightness-0 invert" />
        <div className="border-l border-white/20 pl-3">
          <p className="text-xs font-semibold text-white">Collège de la Concorde — Montréal</p>
          <p className="text-[10px] text-white/60">Simulateur pédagogique ERP/WMS</p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10">
        <button
          onClick={() => navigate(-1 as any)}
          className="flex items-center gap-2 text-xs text-[#0070f2] hover:underline mb-8"
        >
          <ArrowLeft size={13} /> Retour
        </button>

        <div className="mb-8">
          <h1 className="text-xl font-bold text-[#0f2a44] mb-1">Mentions légales</h1>
          <p className="text-sm text-gray-500">Collège de la Concorde — Mini-WMS ERP/WMS Simulator · v1.0</p>
          <p className="text-xs text-gray-400 mt-1">Dernière mise à jour : janvier 2026</p>
        </div>

        <div className="space-y-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="bg-white border border-[#d9d9d9] rounded-md p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-[#e8f0fe] rounded flex items-center justify-center">
                    <Icon size={14} className="text-[#0070f2]" />
                  </div>
                  <h2 className="text-sm font-semibold text-[#0f2a44]">{section.title}</h2>
                </div>
                <div className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e0e0e0] bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between gap-2">
          <p className="text-[10px] text-gray-400">
            © 2026 Collège de la Concorde — Montréal. Tous droits réservés.
          </p>
          <span className="text-[10px] text-gray-400 font-mono">v1.0 — Mini-WMS ERP/WMS Simulator</span>
        </div>
      </footer>
    </div>
  );
}
