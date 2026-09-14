import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Coins, MessagesSquare, Smartphone } from "lucide-react";

import { PageHeader } from "@/components/dashboard/shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusPill, toneForLicense, toneForWa } from "@/components/dashboard/status-pill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatNumber, getLicensesByTenant, getTenant, getWaNumbers } from "@/mock/api";

export const Route = createFileRoute("/admin/tenants/$tenantId")({
  head: () => ({
    meta: [
      { title: "Detail Tenant — Balasin Admin" },
      {
        name: "description",
        content: "Rincian nomor WhatsApp, pemakaian token, dan riwayat lisensi tenant.",
      },
      { property: "og:title", content: "Detail Tenant — Balasin Admin" },
      {
        property: "og:description",
        content: "Rincian nomor WhatsApp, pemakaian, dan lisensi tenant.",
      },
    ],
  }),
  component: TenantDetail,
});

function TenantDetail() {
  const { tenantId } = Route.useParams();
  const { data: tenant } = useQuery({
    queryKey: ["tenant", tenantId],
    queryFn: () => getTenant(tenantId),
  });
  const { data: licenses = [] } = useQuery({
    queryKey: ["licenses", tenantId],
    queryFn: () => getLicensesByTenant(tenantId),
  });
  const { data: numbers = [] } = useQuery({ queryKey: ["wa"], queryFn: getWaNumbers });

  if (!tenant) {
    return <p className="text-sm text-muted-foreground">Memuat data tenant...</p>;
  }

  return (
    <>
      <Link
        to="/admin/tenants"
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Kembali ke daftar tenant
      </Link>

      <PageHeader
        title={tenant.nama}
        description={`${tenant.industri} · ${tenant.email} · bergabung ${formatDate(tenant.bergabung)}`}
        action={
          <StatusPill
            label={tenant.status}
            tone={tenant.status === "aktif" ? "success" : "danger"}
          />
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Nomor WhatsApp" value={String(tenant.nomorWa)} icon={Smartphone} />
        <StatCard
          label="Chat bulan ini"
          value={formatNumber(tenant.chatBulanIni)}
          icon={MessagesSquare}
          hint={`Kuota ${formatNumber(tenant.kuotaChat)}`}
        />
        <StatCard
          label="Token terpakai"
          value={`${(tenant.tokenBulanIni / 1_000_000).toFixed(2)} jt`}
          icon={Coins}
          tone="warning"
        />
      </div>

      <section className="panel mt-8 overflow-hidden">
        <h2 className="px-5 py-4 text-sm font-semibold">Nomor WhatsApp terhubung</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>Nomor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Terakhir aktif</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {numbers.slice(0, tenant.nomorWa).map((n) => (
              <TableRow key={n.id}>
                <TableCell className="font-medium">{n.label}</TableCell>
                <TableCell className="font-mono text-xs">{n.nomor}</TableCell>
                <TableCell>
                  <StatusPill label={n.status} tone={toneForWa(n.status)} />
                </TableCell>
                <TableCell className="text-muted-foreground">{n.terakhirAktif}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section className="panel mt-6 overflow-hidden">
        <h2 className="px-5 py-4 text-sm font-semibold">Riwayat lisensi</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode</TableHead>
              <TableHead>Paket</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead>Berakhir</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {licenses.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-mono text-xs">{l.kode}</TableCell>
                <TableCell>{l.plan}</TableCell>
                <TableCell>{formatDate(l.dibuat)}</TableCell>
                <TableCell>{formatDate(l.berakhir)}</TableCell>
                <TableCell>
                  <StatusPill label={l.status} tone={toneForLicense(l.status)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </>
  );
}
