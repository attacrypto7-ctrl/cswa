import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { CalendarClock, MessagesSquare, ShieldQuestion, Smartphone } from "lucide-react";

import { PageHeader } from "@/components/dashboard/shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusPill, toneForWa } from "@/components/dashboard/status-pill";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatNumber, getChatLogs, getWaNumbers } from "@/mock/api";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Ringkasan Bot — Dashboard Balasin" },
      { name: "description", content: "Status bot WhatsApp, sisa lisensi, dan chat yang perlu ditangani manusia." },
      { property: "og:title", content: "Ringkasan Bot — Dashboard Balasin" },
      { property: "og:description", content: "Status bot WhatsApp dan chat yang perlu ditangani." },
    ],
  }),
  component: TenantOverview,
});

function TenantOverview() {
  const { data: numbers = [] } = useQuery({ queryKey: ["wa"], queryFn: getWaNumbers });
  const { data: logs = [] } = useQuery({ queryKey: ["chats"], queryFn: getChatLogs });

  const perluManusia = logs.filter((l) => l.status === "perlu manusia").length;

  return (
    <>
      <PageHeader
        title="Ringkasan"
        description="Kondisi bot WhatsApp Anda hari ini."
        action={
          <Button asChild variant="outline">
            <Link to="/app/uji-coba">Uji coba bot</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Nomor tersambung"
          value={`${numbers.filter((n) => n.status === "tersambung").length} / ${numbers.length}`}
          icon={Smartphone}
          tone="success"
        />
        <StatCard label="Chat hari ini" value={formatNumber(412)} icon={MessagesSquare} hint="+18% vs kemarin" />
        <StatCard
          label="Perlu ditangani manusia"
          value={String(perluManusia)}
          icon={ShieldQuestion}
          tone="warning"
        />
        <StatCard label="Sisa lisensi" value={`${sisa} hari`} icon={CalendarClock} hint="Berakhir 01 Okt 2026" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="panel p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold">Status nomor WhatsApp</h2>
          <ul className="mt-4 space-y-3">
            {numbers.map((n) => (
              <li
                key={n.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-secondary/40 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{n.label}</p>
                  <p className="font-mono text-xs text-muted-foreground">{n.nomor}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{n.terakhirAktif}</span>
                  <StatusPill label={n.status} tone={toneForWa(n.status)} />
                </div>
              </li>
            ))}
          </ul>
          <Button asChild variant="ghost" size="sm" className="mt-4">
            <Link to="/app/whatsapp">Kelola koneksi →</Link>
          </Button>
        </section>

        <section className="panel p-5">
          <h2 className="text-sm font-semibold">Kuota chat bulan ini</h2>
          <p className="mt-4 text-3xl font-semibold">4.820</p>
          <p className="text-xs text-muted-foreground">dari kuota 10.000 chat</p>
          <Progress value={48} className="mt-4 h-2" />
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Balas Chat Otomatis</span>
              <span>3.140</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Balas Iklan Otomatis</span>
              <span>1.680</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Token terpakai</span>
              <span>1,24 jt</span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
