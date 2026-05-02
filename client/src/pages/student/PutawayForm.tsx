import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  Info,
  ArrowRight,
  Layers,
  Clock,
} from "lucide-react";

interface PutawayFormProps {
  runId: number;
}

export default function PutawayForm({ runId }: PutawayFormProps) {
  const [, navigate] = useLocation();
  const [sku, setSku] = useState("");
  const [fromBin, setFromBin] = useState("REC-01");
  const [toBin, setToBin] = useState("");
  const [qty, setQty] = useState<number>(0);
  const [lotNumber, setLotNumber] = useState("");
  const [receivedAt, setReceivedAt] = useState(new Date().toISOString().slice(0, 10));
  const [fifoWarning, setFifoWarning] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: binCaps } = trpc.warehouse.binCapacities.useQuery();
  const { data: putawayList } = trpc.warehouse.putawayList.useQuery({ runId });
  const { data: state } = trpc.runs.state.useQuery({ runId });
  const { data: txList } = trpc.transactions.list.useQuery({ runId });
  const { data: skus } = trpc.master.skus.useQuery();

  const submitMutation = trpc.warehouse.submitPutaway.useMutation({
    onSuccess: (result) => {
      if (result.demoWarning) {
        setFifoWarning(result.demoWarning);
      } else {
        setSuccessMsg("Rangement enregistré avec succès !");
        setFifoWarning(null);
        setErrorMsg(null);
        setQty(0);
        setLotNumber("");
      }
    },
    onError: (err) => {
      setErrorMsg(err.message);
      setFifoWarning(null);
    },
  });

  // Calculate current load for selected toBin
  const currentLoad = useMemo(() => {
    if (!txList || !toBin) return 0;
    return txList
      .filter((t) => t.bin === toBin && t.posted && (t.docType === "GR" || t.docType === "PUTAWAY"))
      .reduce((sum: number, t) => sum + Number(t.qty), 0);
  }, [txList, toBin]);

  const selectedBinCap = binCaps?.find((b) => b.binCode === toBin);
  const maxCap = selectedBinCap?.maxCapacity ?? 500;
  const loadPct = Math.min(100, Math.round((currentLoad / maxCap) * 100));
  const wouldExceed = qty > 0 && currentLoad + qty > maxCap;

  // FIFO check: warn if lot being placed is older than existing lots
  const existingLots = useMemo(() => {
    return (putawayList ?? [])
      .filter((p) => p.sku === sku)
      .map((p) => ({ lotNumber: p.lotNumber ?? "", receivedAt: new Date(p.receivedAt) }))
      .sort((a, b) => a.receivedAt.getTime() - b.receivedAt.getTime());
  }, [putawayList, sku]);

  const fifoAlert = useMemo(() => {
    if (!receivedAt || existingLots.length === 0) return null;
    const newDate = new Date(receivedAt);
    const oldestExisting = existingLots[0].receivedAt;
    if (newDate < oldestExisting) {
      return `⚠️ FIFO : Ce lot (${receivedAt}) est plus ancien que le lot existant le plus récent (${oldestExisting.toISOString().slice(0, 10)}). Rangez les lots plus anciens en premier.`;
    }
    return null;
  }, [receivedAt, existingLots]);

  const isDemo = state?.isDemo ?? false;

  const handleSubmit = () => {
    if (!sku || !toBin || !lotNumber || qty <= 0) {
      setErrorMsg("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    submitMutation.mutate({ runId, sku, fromBin, toBin, qty, lotNumber, receivedAt: new Date(receivedAt).toISOString() });
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
      {/* Demo banner */}
      {isDemo && (
        <Alert className="border-blue-300 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 font-medium">
            🔵 MODE DÉMONSTRATION ACTIF — Aucun score enregistré · Progression libre activée
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
          <Package className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Rangement (Putaway) — LT01</h1>
          <p className="text-sm text-muted-foreground">Déplacez la marchandise du quai de réception vers l'emplacement de stockage</p>
        </div>
      </div>

      {/* Pedagogical explanation (demo mode) */}
      {isDemo && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-blue-800 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Explication pédagogique approfondie
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-900 space-y-2">
            <p><strong>Pourquoi ce mouvement existe :</strong> Le putaway (LT01 dans SAP WM) est le transfert physique d'une marchandise depuis la zone de réception vers son emplacement de stockage définitif. Sans cette étape, le stock reste en zone de transit et ne peut pas être prélevé.</p>
            <p><strong>Dans SAP S/4HANA :</strong> Le mouvement LT01 crée un ordre de transfert (Transfer Order) qui met à jour le stock de l'entrepôt (WM stock) en temps réel. La capacité du bin est contrôlée par la gestion des emplacements (Storage Type).</p>
            <p><strong>Dépendance :</strong> Le putaway ne peut s'effectuer qu'après une GR postée (mouvement 101). Sans GR, le stock n'existe pas dans le système.</p>
            <p><strong>Erreur en production :</strong> Un putaway dans un bin plein crée un dépassement de capacité (capacity overflow) qui bloque les mouvements suivants et génère une alerte dans le WM cockpit.</p>
          </CardContent>
        </Card>
      )}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Saisie du rangement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* SKU */}
          <div className="space-y-1.5">
            <Label>Article (SKU) *</Label>
            <Select value={sku} onValueChange={setSku}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un article..." />
              </SelectTrigger>
              <SelectContent>
                {(skus ?? []).map((s: { sku: string; descriptionFr: string }) => (
                  <SelectItem key={s.sku} value={s.sku}>
                    {s.sku} — {s.descriptionFr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* From / To Bin */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Bin source *</Label>
              <Select value={fromBin} onValueChange={setFromBin}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(binCaps ?? []).map((b) => (
                    <SelectItem key={b.binCode} value={b.binCode}>{b.binCode}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Bin destination *</Label>
              <Select value={toBin} onValueChange={setToBin}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent>
                  {(binCaps ?? []).map((b) => (
                    <SelectItem key={b.binCode} value={b.binCode}>{b.binCode} (max {b.maxCapacity})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Capacity Indicator */}
          {toBin && (
            <div className="p-3 rounded-lg border bg-slate-50 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Capacité : {toBin}</span>
                <span className={`font-mono text-xs ${wouldExceed ? "text-red-600 font-bold" : "text-slate-600"}`}>
                  {currentLoad} + {qty || 0} / {maxCap}
                </span>
              </div>
              <Progress
                value={Math.min(100, Math.round(((currentLoad + (qty || 0)) / maxCap) * 100))}
                className={`h-2 ${wouldExceed ? "[&>div]:bg-red-500" : loadPct > 80 ? "[&>div]:bg-amber-500" : "[&>div]:bg-emerald-500"}`}
              />
              {wouldExceed && (
                <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Dépassement de capacité — pénalité -10 pts en mode évaluation
                </p>
              )}
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-1.5">
            <Label>Quantité *</Label>
            <Input
              type="number"
              min={1}
              value={qty || ""}
              onChange={(e) => setQty(Number(e.target.value))}
              placeholder="Ex: 100"
            />
          </div>

          {/* Lot / Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Numéro de lot *</Label>
              <Input value={lotNumber} onChange={(e) => setLotNumber(e.target.value)} placeholder="LOT-2025-001" />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Date de réception *
              </Label>
              <Input type="date" value={receivedAt} onChange={(e) => setReceivedAt(e.target.value)} />
            </div>
          </div>

          {/* FIFO Warning */}
          {fifoAlert && (
            <Alert className="border-amber-300 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 text-sm">{fifoAlert}</AlertDescription>
            </Alert>
          )}

          {/* Existing lots for FIFO context */}
          {existingLots.length > 0 && (
            <div className="p-3 rounded-lg border bg-slate-50">
              <p className="text-xs font-medium text-slate-600 mb-2 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Lots existants pour {sku} (ordre FIFO)
              </p>
              <div className="space-y-1">
                {existingLots.map((lot, i) => (
                  <div key={lot.lotNumber} className="flex items-center justify-between text-xs">
                    <span className="font-mono">{lot.lotNumber}</span>
                    <Badge variant="outline" className={`text-xs ${i === 0 ? "border-emerald-400 text-emerald-700" : "border-slate-300"}`}>
                      {i === 0 ? "Premier (FIFO)" : `#${i + 1}`} · {lot.receivedAt.toISOString().slice(0, 10)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {errorMsg && (
            <Alert className="border-red-300 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 text-sm">{errorMsg}</AlertDescription>
            </Alert>
          )}
          {fifoWarning && (
            <Alert className="border-amber-300 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 text-sm">
                <strong>Mode démonstration :</strong> {fifoWarning}
              </AlertDescription>
            </Alert>
          )}
          {successMsg && (
            <Alert className="border-emerald-300 bg-emerald-50">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <AlertDescription className="text-emerald-800 text-sm">{successMsg}</AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" onClick={() => navigate(`/student/run/${runId}`)}>
              ← Retour à Mission Control
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitMutation.isPending || !sku || !toBin || !lotNumber || qty <= 0}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {submitMutation.isPending ? "Traitement..." : "Valider le rangement"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Putaway history */}
      {(putawayList ?? []).length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Historique des rangements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {putawayList!.map((p, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span className="font-mono">{p.sku}</span>
                    <span className="text-muted-foreground">{p.fromBin} → {p.toBin}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span>{p.qty} unités</span>
                    <span className="font-mono">{p.lotNumber}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
