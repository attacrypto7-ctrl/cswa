import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/dashboard/shell";
import { StatusPill } from "@/components/dashboard/status-pill";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatNumber, getTenants } from "@/mock/api";

export const Route = createFileRoute("/admin/tenants/")({
  head: () => ({
    meta: [
      { title: "Daftar Tenant — Balasin Admin" },
      { name: "description", content: "Kelola seluruh bisnis yang memakai platform CS AI." },
      { property: "og:title", content: "Daftar Tenant — Balasin Admin" },
      { property: "og:description", content: "Kelola seluruh bisnis yang memakai platform CS AI." },
    ],
  }),
  component: TenantsPage,
});

function TenantsPage() {
  const { data: tenants = [] } = useQuery({ queryKey: ["tenants"], queryFn: getTenants });
  const [q, setQ] = useState("");

  const hasil = tenants.filter((t) =>
    `${t.nama} ${t.industri} ${t.email}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <>
      <PageHeader
        title="Tenant"
        description="Semua bisnis yang terdaftar beserta pemakaian dan masa lisensinya."
        action={
          <div className="relative w-full max-w-xs">
            <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari nama atau industri..."
              className="pl-9"
            />
          </div>
        }
      />

      <div className="panel overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bisnis</TableHead>
              <TableHead>Paket</TableHead>
              <TableHead>Nomor WA</TableHead>
              <TableHead className="min-w-44">Pemakaian chat</TableHead>
              <TableHead>Lisensi berakhir</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hasil.map((t) => (
              <TableRow key={t.id}>
                <TableCell>
                  <Link
                    to="/admin/tenants/$tenantId"
                    params={{ tenantId: t.id }}
                    className="font-medium hover:text-primary"
                  >
                    {t.nama}
                  </Link>
                  <p className="text-xs text-muted-foreground">{t.industri} · {t.email}</p>
                </TableCell>
                <TableCell>{t.plan}</TableCell>
                <TableCell>{t.nomorWa}</TableCell>
                <TableCell>
                  <Progress value={(t.chatBulanIni / t.kuotaChat) * 100} className="h-1.5" />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatNumber(t.chatBulanIni)} / {formatNumber(t.kuotaChat)}
                  </p>
                </TableCell>
                <TableCell>{formatDate(t.lisensiBerakhir)}</TableCell>
                <TableCell>
                  <StatusPill
                    label={t.status}
                    tone={t.status === "aktif" ? "success" : "danger"}
                  />
                </TableCell>
              </TableRow>
            ))}
            {hasil.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  Tidak ada tenant yang cocok.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
