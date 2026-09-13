import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, QrCode, RefreshCw, Unplug } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/dashboard/shell";
import { StatusPill, toneForWa } from "@/components/dashboard/status-pill";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { getWaNumbers } from "@/mock/api";

export const Route = createFileRoute("/app/whatsapp")({
  head: () => ({
    meta: [
      { title: "Koneksi WhatsApp — Dashboard Balasin" },
      { name: "description", content: "Sambungkan nomor WhatsApp lewat QR code dan pantau statusnya secara langsung." },
      { property: "og:title", content: "Koneksi WhatsApp — Dashboard Balasin" },
      { property: "og:description", content: "Sambungkan nomor WhatsApp lewat QR code dan pantau statusnya." },
    ],
  }),
  component: WhatsappPage,
});

function QrPlaceholder() {
  return (
    <div className="mx-auto grid size-52 grid-cols-11 gap-0.5 rounded-xl bg-foreground p-3">
      {Array.from({ length: 121 }).map((_, i) => (
        <span
          key={i}
          className={(i * 7 + (i % 5) * 13) % 3 === 0 ? "rounded-[1px] bg-background" : ""}
        />
      ))}
    </div>
  );
}

function WhatsappPage() {
  const { data: numbers = [] } = useQuery({ queryKey: ["wa"], queryFn: getWaNumbers });
  const [qrOpen, setQrOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Koneksi WhatsApp"
        description="Satu tenant bisa punya beberapa nomor CS. Pindai QR dari ponsel yang memegang nomor tersebut."
        action={
          <Button onClick={() => setQrOpen(true)}>
            <Plus className="size-4" /> Tambah nomor
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {numbers.map((n) => (
          <article key={n.id} className="panel p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">{n.label}</h2>
                <p className="font-mono text-xs text-muted-foreground">{n.nomor}</p>
              </div>
              <StatusPill label={n.status} tone={toneForWa(n.status)} />
            </div>

            <p className="mt-3 text-xs text-muted-foreground">Terakhir aktif: {n.terakhirAktif}</p>

            <div className="mt-4 space-y-3 rounded-lg border border-border bg-secondary/40 p-4">
              <label className="flex items-center justify-between gap-3 text-sm">
                Balas Chat Otomatis
                <Switch
                  defaultChecked={n.autoChat}
                  onCheckedChange={(v) =>
                    toast.success(`Balas Chat Otomatis ${v ? "dinyalakan" : "dimatikan"} untuk ${n.label}`)
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3 text-sm">
                Balas Iklan Otomatis
                <Switch
                  defaultChecked={n.autoIklan}
                  onCheckedChange={(v) =>
                    toast.success(`Balas Iklan Otomatis ${v ? "dinyalakan" : "dimatikan"} untuk ${n.label}`)
                  }
                />
              </label>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => setQrOpen(true)}>
                <QrCode className="size-3.5" /> Pindai ulang
              </Button>
              <Button size="sm" variant="ghost" onClick={() => toast.info("Menyambungkan ulang sesi...")}>
                <RefreshCw className="size-3.5" /> Sambung ulang
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive"
                onClick={() => toast.warning(`${n.label} diputuskan (contoh)`)}
              >
                <Unplug className="size-3.5" /> Putuskan
              </Button>
            </div>
          </article>
        ))}
      </div>

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pindai QR untuk menyambungkan</DialogTitle>
            <DialogDescription>
              Buka WhatsApp → Perangkat Tertaut → Tautkan Perangkat, lalu arahkan kamera ke kode di
              bawah. QR contoh ini menyegar otomatis tiap 30 detik saat sistem sudah tersambung.
            </DialogDescription>
          </DialogHeader>
          <QrPlaceholder />
          <p className="text-center text-xs text-muted-foreground">
            Menunggu pemindaian... status akan berubah otomatis.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
