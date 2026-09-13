import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarClock,
  CheckCircle2,
  Copy,
  KeyRound,
  MessageSquare,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/dashboard/shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusPill } from "@/components/dashboard/status-pill";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { daysLeft, formatDate, formatNumber, getLicensesByTenant, getTenant } from "@/mock/api";

export const Route = createFileRoute("/app/lisensi")({
  head: () => ({
    meta: [
      { title: "Lisensi Tenant — Dashboard Balasin" },
      { name: "description", content: "Informasi masa berlaku paket, kuota chat, dan status aktivasi lisensi Anda." },
      { property: "og:title", content: "Lisensi Tenant — Dashboard Balasin" },
      { property: "og:description", content: "Informasi lisensi dan kuota bot WhatsApp." },
    ],
  }),
  component: LisensiPage,
});

export function LisensiPage() {
  const tenantId = "t-001"; // Toko Bunga Melati
  const { data: tenant } = useQuery({
    queryKey: ["tenant", tenantId],
    queryFn: () => getTenant(tenantId),
  });
  const { data: licenses = [] } = useQuery({
    queryKey: ["licenses", tenantId],
    queryFn: () => getLicensesByTenant(tenantId),
  });

  const [inputKode, setInputKode] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const activeLicense = licenses[0] ?? {
    kode: "MLTI-4KD9-2026-XQ7A",
    plan: "Growth",
    status: "aktif",
    dibuat: "2026-04-01",
    berakhir: "2026-10-01",
    kuotaChat: 10000,
  };

  const sisaHari = daysLeft(activeLicense.berakhir);
  const chatTerpakai = tenant?.chatBulanIni ?? 4820;
  const kuotaChat = activeLicense.kuotaChat ?? 10000;
  const persenKuota = Math.round((chatTerpakai / kuotaChat) * 100);

  const copyLicense = () => {
    navigator.clipboard?.writeText(activeLicense.kode);
    toast.success("Kode lisensi berhasil disalin!");
  };

  const handleActivate = () => {
    if (!inputKode.trim()) {
      toast.error("Silakan masukkan kode lisensi.");
      return;
    }
    setDialogOpen(false);
    setInputKode("");
    toast.success("Lisensi berhasil diperbarui!", {
      description: "Masa berlaku dan kuota chat Anda telah diperpanjang.",
    });
  };

  return (
    <>
      <PageHeader
        title="Lisensi & Paket"
        description="Informasi masa aktif lisensi bisnis Anda, penggunaan kuota pesan, dan aktivasi kode perpanjangan."
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <KeyRound className="size-4" /> Masukkan Kode Lisensi
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Aktivasi / Perpanjang Lisensi</DialogTitle>
                <DialogDescription>
                  Masukkan kode lisensi resmi yang Anda dapatkan dari tim Balasin atau penyedia layanan.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 py-2">
                <Label htmlFor="kode-baru">Kode Lisensi</Label>
                <Input
                  id="kode-baru"
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  value={inputKode}
                  onChange={(e) => setInputKode(e.target.value)}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Format: 4 segmen alfanumerik. Kuota otomatis diperbarui setelah aktivasi.
                </p>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleActivate}>Aktivasi Sekarang</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Status Lisensi"
          value="Aktif"
          icon={ShieldCheck}
          tone="success"
          hint={`Paket ${activeLicense.plan}`}
        />
        <StatCard
          label="Sisa Masa Aktif"
          value={`${sisaHari} Hari`}
          icon={CalendarClock}
          hint={`Hingga ${formatDate(activeLicense.berakhir)}`}
        />
        <StatCard
          label="Kuota Chat Terpakai"
          value={`${persenKuota}%`}
          icon={MessageSquare}
          hint={`${formatNumber(chatTerpakai)} / ${formatNumber(kuotaChat)}`}
        />
        <StatCard
          label="Batas Nomor WA"
          value="2 / 3"
          icon={Smartphone}
          hint="Maksimal 3 nomor CS"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="panel p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Detail Lisensi Aktif</h2>
            <StatusPill label={activeLicense.status} tone="success" />
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-muted-foreground">Kode Lisensi:</span>
              <div className="flex items-center gap-2">
                <code className="rounded bg-secondary px-2.5 py-1 font-mono text-xs text-foreground font-semibold">
                  {activeLicense.kode}
                </code>
                <Button size="sm" variant="ghost" onClick={copyLicense} title="Salin kode">
                  <Copy className="size-3.5" />
                </Button>
              </div>
            </div>

            <div className="flex justify-between border-b border-border pb-3">
              <span className="text-muted-foreground">Paket Langganan:</span>
              <span className="font-medium text-foreground">{activeLicense.plan}</span>
            </div>

            <div className="flex justify-between border-b border-border pb-3">
              <span className="text-muted-foreground">Tanggal Aktivasi:</span>
              <span className="font-medium text-foreground">{formatDate(activeLicense.dibuat)}</span>
            </div>

            <div className="flex justify-between border-b border-border pb-3">
              <span className="text-muted-foreground">Berlaku Sampai:</span>
              <span className="font-medium text-foreground">{formatDate(activeLicense.berakhir)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Maksimal Pesan per Bulan:</span>
              <span className="font-medium text-foreground">{formatNumber(kuotaChat)} pesan</span>
            </div>
          </div>
        </div>

        <div className="panel p-6 space-y-6">
          <h2 className="text-base font-semibold">Pemakaian Kuota Bulan Ini</h2>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Chat Masuk & Dibalas:</span>
              <span className="font-medium">
                {formatNumber(chatTerpakai)} / {formatNumber(kuotaChat)}
              </span>
            </div>
            <Progress value={persenKuota} className="h-3" />
            <p className="text-xs text-muted-foreground">
              Kuota akan direset otomatis pada tanggal 01 setiap bulannya.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Fitur Paket {activeLicense.plan} Termasuk:
            </h3>
            <ul className="space-y-2 text-xs text-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                Balas Chat Otomatis tak terbatas dalam kuota
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                Template Balas Iklan multi-langkah (teks & gambar)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                Dukungan hingga 3 nomor WhatsApp aktif
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                Integrasi dokumen PDF & FAQ tanpa batas entri
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
