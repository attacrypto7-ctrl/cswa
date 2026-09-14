import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Building2, KeyRound, MessagesSquare, TriangleAlert } from "lucide-react";

import { PageHeader } from "@/components/dashboard/shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusPill, toneForLicense } from "@/components/dashboard/status-pill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { daysLeft, formatDate, formatNumber, getLicenses, getTenants } from "@/mock/api";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Ringkasan Platform — Balasin Admin" },
      { name: "description", content: "Pantau tenant, lisensi, dan volume chat seluruh platform." },
      { property: "og:title", content: "Ringkasan Platform — Balasin Admin" },
      { property: "og:description", content: "Pantau tenant, lisensi, dan volume chat platform." },
    ],
  }),
  component: AdminOverview,
});

function AdminOverview() {
  const { data: tenants = [] } = useQuery({ queryKey: ["tenants"], queryFn: getTenants });
  const { data: licenses = [] } = useQuery({ queryKey: ["licenses"], queryFn: getLicenses });

  const aktif = licenses.filter((l) => l.status === "aktif");
  const segera = aktif.filter((l) => daysLeft(l.berakhir) <= 30);
  const totalChat = tenants.reduce((a, t) => a + t.chatBulanIni, 0);
  const suspendedCount = tenants.filter((t) => t.status === "suspend").length;

  return (
    <>
      <PageHeader
        title="Ringkasan Platform"
        description="Kondisi seluruh tenant, lisensi, dan pemakaian bulan ini."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total tenant"
          value={String(tenants.length)}
          icon={Building2}
          hint={suspendedCount > 0 ? `${suspendedCount} tenant ditangguhkan` : "Semua aktif"}
        />
        <StatCard
          label="Lisensi aktif"
          value={String(aktif.length)}
          icon={KeyRound}
          tone="success"
        />
        <StatCard
          label="Segera kedaluwarsa"
          value={String(segera.length)}
          icon={TriangleAlert}
          tone="warning"
          hint="Dalam 30 hari ke depan"
        />
        <StatCard
          label="Chat bulan ini"
          value={formatNumber(totalChat)}
          icon={MessagesSquare}
          hint="Seluruh tenant"
        />
      </div>

      <section className="panel mt-8 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-sm font-semibold">Lisensi yang perlu diperhatikan</h2>
          <Link to="/admin/licenses" className="text-xs text-primary hover:underline">
            Lihat semua
          </Link>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant</TableHead>
              <TableHead>Kode</TableHead>
              <TableHead>Berakhir</TableHead>
              <TableHead>Sisa</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {licenses
              .slice()
              .sort((a, b) => daysLeft(a.berakhir) - daysLeft(b.berakhir))
              .slice(0, 5)
              .map((l) => {
                const sisa = daysLeft(l.berakhir);
                return (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.tenantNama}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {l.kode}
                    </TableCell>
                    <TableCell>{formatDate(l.berakhir)}</TableCell>
                    <TableCell
                      className={sisa < 0 ? "text-destructive" : sisa <= 30 ? "text-warning" : ""}
                    >
                      {sisa < 0 ? `${Math.abs(sisa)} hari lewat` : `${sisa} hari`}
                    </TableCell>
                    <TableCell>
                      <StatusPill label={l.status} tone={toneForLicense(l.status)} />
                    </TableCell>
                  </TableRow>
                );
              })}
            {licenses.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                  Belum ada data lisensi.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
    </>
  );
}
