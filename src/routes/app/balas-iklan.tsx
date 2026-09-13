import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/dashboard/shell";
import { StatusPill } from "@/components/dashboard/status-pill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { formatNumber, getAdTemplates } from "@/mock/api";

export const Route = createFileRoute("/app/balas-iklan")({
  head: () => ({
    meta: [
      { title: "Balas Iklan Otomatis — Dashboard Balasin" },
      { name: "description", content: "Kelola pasangan pertanyaan dan jawaban template presisi untuk chat dari iklan." },
      { property: "og:title", content: "Balas Iklan Otomatis — Dashboard Balasin" },
      { property: "og:description", content: "Jawaban template presisi untuk chat dari iklan." },
    ],
  }),
  component: AutoAdsPage,
});

function AutoAdsPage() {
  const { data: templates = [] } = useQuery({ queryKey: ["ads"], queryFn: getAdTemplates });
  const [aktif, setAktif] = useState(true);

  return (
    <>
      <PageHeader
        title="Balas Iklan Otomatis"
        description="Untuk chat dari iklan, jawaban harus 100% konsisten. Sistem mencocokkan pertanyaan ke jawaban pasti, bukan mengarang."
        action={
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-2">
            <span className="text-sm">{aktif ? "Menyala" : "Mati"}</span>
            <Switch
              checked={aktif}
              onCheckedChange={(v) => {
                setAktif(v);
                toast.success(`Balas Iklan Otomatis ${v ? "dinyalakan" : "dimatikan"}`);
              }}
            />
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="text-sm font-semibold">Daftar jawaban template</h2>
            <span className="text-xs text-muted-foreground">{templates.length} template</span>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pertanyaan & jawaban</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Dipakai</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="max-w-sm">
                    <p className="font-medium">{t.pertanyaan}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{t.jawaban}</p>
                    {!t.aktif ? (
                      <span className="mt-2 inline-block">
                        <StatusPill label="nonaktif" tone="muted" />
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <StatusPill label={t.mode} tone={t.mode === "exact" ? "info" : "warning"} />
                  </TableCell>
                  <TableCell>{formatNumber(t.dipakai)}x</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => toast.warning("Template dihapus (contoh)")}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="space-y-6">
          <form
            className="panel space-y-4 p-5"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Template ditambahkan (contoh)");
            }}
          >
            <h2 className="text-sm font-semibold">Tambah template</h2>
            <div className="grid gap-2">
              <Label htmlFor="t-tanya">Pertanyaan pelanggan</Label>
              <Input id="t-tanya" placeholder="Contoh: Harga berapa?" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="t-jawab">Jawaban pasti</Label>
              <Textarea id="t-jawab" rows={4} placeholder="Jawaban yang dikirim persis seperti ini" />
            </div>
            <div className="grid gap-2">
              <Label>Mode pencocokan</Label>
              <Select defaultValue="fuzzy">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exact">Exact — harus persis sama</SelectItem>
                  <SelectItem value="fuzzy">Fuzzy — mirip pun dicocokkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              <Plus className="size-4" /> Simpan template
            </Button>
          </form>

          <div className="panel space-y-3 p-5 text-sm">
            <h2 className="font-semibold">Bila tidak ada yang cocok</h2>
            <label className="flex items-center justify-between gap-3">
              Pakai AI dengan jawaban terbatas
              <Switch defaultChecked />
            </label>
            <p className="text-xs text-muted-foreground">
              AI hanya boleh memilih dari daftar jawaban di atas dan dilarang mengarang. Jika tetap
              tidak cocok, chat dialihkan ke admin.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
