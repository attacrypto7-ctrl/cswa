import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/dashboard/shell";
import { StatusPill, toneForLicense } from "@/components/dashboard/status-pill";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { daysLeft, formatDate, formatNumber, getLicenses, getTenants } from "@/mock/api";

export const Route = createFileRoute("/admin/licenses")({
  head: () => ({
    meta: [
      { title: "Lisensi — Balasin Admin" },
      {
        name: "description",
        content: "Buat, tinjau, dan cabut kode lisensi tenant beserta masa berlaku dan kuotanya.",
      },
      { property: "og:title", content: "Lisensi — Balasin Admin" },
      { property: "og:description", content: "Buat dan kelola kode lisensi tenant." },
    ],
  }),
  component: LicensesPage,
});

function LicensesPage() {
  const { data: licenses = [] } = useQuery({ queryKey: ["licenses"], queryFn: getLicenses });
  const { data: tenants = [] } = useQuery({ queryKey: ["tenants"], queryFn: getTenants });
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Lisensi"
        description="Kode lisensi mengikat tenant, masa berlaku, dan kuota chat per bulan."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="size-4" /> Buat lisensi
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Buat lisensi baru</DialogTitle>
                <DialogDescription>
                  Kode akan dibuat otomatis dan bisa langsung dibagikan ke tenant.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Tenant</Label>
                  <Select defaultValue={tenants[0]?.id ?? ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tenant" />
                    </SelectTrigger>
                    <SelectContent>
                      {tenants.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>Paket</Label>
                    <Select defaultValue="Growth">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Starter">Starter</SelectItem>
                        <SelectItem value="Growth">Growth</SelectItem>
                        <SelectItem value="Scale">Scale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="kuota">Kuota chat / bulan</Label>
                    <Input id="kuota" type="number" defaultValue={10000} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="berakhir">Berlaku sampai</Label>
                  <Input id="berakhir" type="date" defaultValue="2027-03-31" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Batal
                </Button>
                <Button
                  onClick={() => {
                    setOpen(false);
                    toast.success("Lisensi dibuat (contoh)", {
                      description: "BARU-7HQ2-2027-AZ55 siap dibagikan ke tenant.",
                    });
                  }}
                >
                  Buat lisensi
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="panel overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Paket</TableHead>
              <TableHead>Kuota</TableHead>
              <TableHead>Berakhir</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {licenses.map((l) => {
              const sisa = daysLeft(l.berakhir);
              return (
                <TableRow key={l.id}>
                  <TableCell className="font-mono text-xs">{l.kode}</TableCell>
                  <TableCell className="font-medium">{l.tenantNama}</TableCell>
                  <TableCell>{l.plan}</TableCell>
                  <TableCell>{formatNumber(l.kuotaChat)}/bln</TableCell>
                  <TableCell>
                    {formatDate(l.berakhir)}
                    <span className="block text-xs text-muted-foreground">
                      {sisa < 0 ? `lewat ${Math.abs(sisa)} hari` : `sisa ${sisa} hari`}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusPill label={l.status} tone={toneForLicense(l.status)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast.success("Kode lisensi disalin")}
                    >
                      <Copy className="size-3.5" /> Salin
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {licenses.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                  Belum ada lisensi yang dibuat. Klik "Buat lisensi" di atas untuk menambahkan
                  lisensi baru.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
