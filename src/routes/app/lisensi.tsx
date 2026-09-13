import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, CheckCircle2, KeyRound, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/dashboard/shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusPill, toneForLicense } from "@/components/dashboard/status-pill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { daysLeft, formatDate, formatNumber, getLicensesByTenant } from "@/mock/api";

const TENANT_ID = "t-001";
const KUOTA_TERPAKAI = 4820;

export const Route = createFileRoute("/app/lisensi")({
  head: () => ({
    meta: [
      { title: "Lisensi — Dashboard Balasin" },
      { name: "description", content: "Lihat masa berlaku lisensi, kuota chat, dan aktifkan kode lisensi baru dari admin." },
      { property: "og:title", content: "Lisensi — Dashboard Balasin" },
      { property: "og:description", content: "Lihat masa berlaku lisensi dan aktifkan kode baru." },
    ],
  }),
  component: TenantLicensePage,
});

function TenantLicensePage() {
  const { data: licenses = [] } = useQuery({
    queryKey: ["licenses", TENANT_ID],
    queryFn: () => getLicensesByTenant(TENANT_ID),
  });
  const [kode, setKode] = useState("");

  const aktif = licenses.find((l) => l.status === "aktif") ?? licenses[0];
  const sisa = aktif ? daysLeft(aktif.berakhir) : 0;
  const persenKuota = aktif ? Math.min(100, Math.round((KUOTA_TERPAKAI / aktif.kuotaChat) * 100)) : 0;

  return (
    <>
      <PageHeader
        title="Lisensi"
        description="Bot hanya aktif selama lisensi berlaku. Perpanjang sebelum kedaluwarsa agar layanan tidak terputus."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Status lisensi"
          value={aktif ? aktif.status : "—"}
          icon={aktif?.status === "aktif" ? CheckCircle2 : TriangleAlert}
          tone={aktif?.status === "aktif" ? "success" : "warning"}
        />
        <StatCard
          label="Sisa masa aktif"
          value={`${sisa} hari`}
          icon={CalendarClock}
          tone={sisa <= 14 ? "warning" : "default"}
          hint={aktif ? `Berakhir ${formatDate(aktif.berakhir)}` : undefined}
        />
        <StatCard label="Paket" value={aktif?.plan ?? "—"} icon={KeyRound} />
      </div>

      {sisa <= 30 && sisa >= 0 ? (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" />
          <p>
            Lisensi Anda berakhir dalam <span className="font-semibold">{sisa} hari</span>. Hubungi
            admin untuk memperpanjang agar bot tetap menyala.
          </p>
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="panel p-5">
          <h2 className="text-sm font-semibold">Pemakaian kuota chat</h2>
          <p className="text-xs text-muted-foreground">Reset setiap awal bulan.</p>
          <div className="mt-4 flex items-end justify-between">
            <p className="text-3xl font-semibold">{formatNumber(KUOTA_TERPAKAI)}</p>
            <p className="text-sm text-muted-foreground">
              dari {aktif ? formatNumber(aktif.kuotaChat) : 0} chat
            </p>
          </div>
          <Progress value={persenKuota} className="mt-3 h-2" />
          <p className="mt-2 text-xs text-muted-foreground">{persenKuota}% kuota terpakai</p>

          <div className="mt-6 overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Paket</TableHead>
                  <TableHead>Berakhir</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {licenses.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-mono text-xs">{l.kode}</TableCell>
                    <TableCell>{l.plan}</TableCell>
                    <TableCell>{formatDate(l.berakhir)}</TableCell>
                    <TableCell>
                      <StatusPill label={l.status} tone={toneForLicense(l.status)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <aside className="space-y-6">
          <form
            className="panel space-y-4 p-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (!kode.trim()) {
                toast.error("Masukkan kode lisensi terlebih dahulu");
                return;
              }
              toast.success("Lisensi diaktifkan (contoh)", {
                description: `Kode ${kode.trim().toUpperCase()} berhasil divalidasi.`,
              });
              setKode("");
            }}
          >
            <h2 className="text-sm font-semibold">Aktifkan kode lisensi</h2>
            <p className="text-xs text-muted-foreground">
              Dapatkan kode dari admin platform, lalu masukkan di sini untuk memperpanjang layanan.
            </p>
            <div className="grid gap-2">
              <Label htmlFor="kode">Kode lisensi</Label>
              <Input
                id="kode"
                placeholder="XXXX-0000-2027-XXXX"
                className="font-mono"
                value={kode}
                onChange={(e) => setKode(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              <KeyRound className="size-4" /> Aktifkan
            </Button>
          </form>

          <div className="panel space-y-2 p-5 text-sm text-muted-foreground">
            <h2 className="font-semibold text-foreground">Butuh perpanjangan?</h2>
            <p>
              Sistem otomatis menonaktifkan bot saat lisensi kedaluwarsa. Anda akan diingatkan
              beberapa hari sebelumnya lewat email dan WhatsApp.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-1"
              onClick={() => toast.info("Permintaan perpanjangan dikirim ke admin (contoh)")}
            >
              Minta perpanjangan
            </Button>
          </div>
        </aside>
      </div>
    </>
  );
}
