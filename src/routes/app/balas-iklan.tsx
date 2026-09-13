import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { GripVertical, ImagePlus, MessageSquarePlus, Plus, Trash2 } from "lucide-react";
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
      { name: "description", content: "Atur pertanyaan dari iklan Facebook dan rangkaian balasan (teks & gambar) yang dikirim persis sama tiap kali." },
      { property: "og:title", content: "Balas Iklan Otomatis — Dashboard Balasin" },
      { property: "og:description", content: "Rangkaian balasan teks & gambar untuk chat dari iklan." },
    ],
  }),
  component: AutoAdsPage,
});

// -----------------------------------------------------------------------
// CATATAN UNTUK BACKEND / mock/api.ts:
// Satu template sekarang punya beberapa "langkah" balasan (dikirim berurutan),
// bukan cuma satu `jawaban`. Bentuk data yang diharapkan per template:
//
//   {
//     id: string
//     pertanyaan: string
//     caraMencocokkan: "sama_persis" | "boleh_mirip"
//     aktif: boolean
//     dipakai: number
//     langkah: Array<
//       | { id: string; tipe: "teks"; isiTeks: string }
//       | { id: string; tipe: "gambar"; urlGambar: string; namaGambar?: string }
//     >
//   }
//
// Kode di bawah tetap bisa jalan untuk data lama (field `jawaban` & `mode`
// tunggal) lewat fungsi ambilLangkah() di bawah, tapi sebaiknya mock data
// & backend dipindah ke bentuk baru ini.
// -----------------------------------------------------------------------

type Langkah =
  | { id: string; tipe: "teks"; isiTeks: string }
  | { id: string; tipe: "gambar"; urlGambar?: string; namaGambar?: string };

function buatId() {
  return Math.random().toString(36).slice(2, 10);
}

// Ambil daftar langkah dari template, dengan fallback untuk data lama (single jawaban teks)
function ambilLangkah(t: any): Langkah[] {
  if (Array.isArray(t.langkah) && t.langkah.length > 0) return t.langkah;
  if (t.jawaban) return [{ id: "0", tipe: "teks", isiTeks: t.jawaban }];
  return [];
}

function ambilCaraMencocokkan(t: any): "sama_persis" | "boleh_mirip" {
  if (t.caraMencocokkan) return t.caraMencocokkan;
  return t.mode === "exact" ? "sama_persis" : "boleh_mirip";
}

function AutoAdsPage() {
  const { data: templatesMentah = [] } = useQuery({ queryKey: ["ads"], queryFn: getAdTemplates });
  const [aktif, setAktif] = useState(true);

  const templates = templatesMentah.map((t: any) => ({
    ...t,
    langkah: ambilLangkah(t),
    caraMencocokkan: ambilCaraMencocokkan(t),
  }));

  // --- state untuk form "Tambah template" ---
  const [pertanyaan, setPertanyaan] = useState("");
  const [caraMencocokkan, setCaraMencocokkan] = useState<"sama_persis" | "boleh_mirip">("boleh_mirip");
  const [langkahBaru, setLangkahBaru] = useState<Langkah[]>([
    { id: buatId(), tipe: "teks", isiTeks: "" },
  ]);

  function tambahLangkahTeks() {
    setLangkahBaru((prev) => [...prev, { id: buatId(), tipe: "teks", isiTeks: "" }]);
  }

  function tambahLangkahGambar() {
    setLangkahBaru((prev) => [...prev, { id: buatId(), tipe: "gambar" }]);
  }

  function hapusLangkah(id: string) {
    setLangkahBaru((prev) => prev.filter((l) => l.id !== id));
  }

  function ubahTeksLangkah(id: string, isiTeks: string) {
    setLangkahBaru((prev) =>
      prev.map((l) => (l.id === id && l.tipe === "teks" ? { ...l, isiTeks } : l)),
    );
  }

  function ubahGambarLangkah(id: string, file: File | undefined) {
    setLangkahBaru((prev) =>
      prev.map((l) => (l.id === id && l.tipe === "gambar" ? { ...l, namaGambar: file?.name } : l)),
    );
  }

  function resetForm() {
    setPertanyaan("");
    setCaraMencocokkan("boleh_mirip");
    setLangkahBaru([{ id: buatId(), tipe: "teks", isiTeks: "" }]);
  }

  return (
    <>
      <PageHeader
        title="Balas Iklan Otomatis"
        description="Untuk chat dari iklan, balasan harus persis sama setiap kali. Anda bisa mengatur beberapa pesan berurutan, misalnya: penjelasan, nomor transfer, lalu foto bukti rekening."
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

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="text-sm font-semibold">Daftar pertanyaan & balasan</h2>
            <span className="text-xs text-muted-foreground">{templates.length} pertanyaan</span>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pertanyaan dari pelanggan</TableHead>
                <TableHead>Balasan (berurutan)</TableHead>
                <TableHead>Cara mencocokkan</TableHead>
                <TableHead>Dipakai</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((t: any) => (
                <TableRow key={t.id}>
                  <TableCell className="max-w-[220px] align-top">
                    <p className="font-medium">{t.pertanyaan}</p>
                    {!t.aktif ? (
                      <span className="mt-2 inline-block">
                        <StatusPill label="nonaktif" tone="muted" />
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCell className="max-w-sm align-top">
                    <ol className="space-y-1.5">
                      {t.langkah.map((l: Langkah, i: number) => (
                        <li key={l.id} className="flex items-start gap-2 text-xs">
                          <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-medium text-muted-foreground">
                            {i + 1}
                          </span>
                          {l.tipe === "teks" ? (
                            <span className="text-muted-foreground">{l.isiTeks}</span>
                          ) : (
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <ImagePlus className="size-3" /> {l.namaGambar ?? "Gambar"}
                            </span>
                          )}
                        </li>
                      ))}
                    </ol>
                  </TableCell>
                  <TableCell className="align-top">
                    <StatusPill
                      label={t.caraMencocokkan === "sama_persis" ? "Sama persis" : "Boleh mirip"}
                      tone={t.caraMencocokkan === "sama_persis" ? "info" : "warning"}
                    />
                  </TableCell>
                  <TableCell className="align-top">{formatNumber(t.dipakai)}x</TableCell>
                  <TableCell className="text-right align-top">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => toast.warning("Pertanyaan dihapus")}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {templates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                    Belum ada template balasan iklan. Buat template baru lewat formulir di samping.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="space-y-6">
          <form
            className="panel space-y-4 p-5"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Pertanyaan & balasan ditambahkan (contoh)");
              resetForm();
            }}
          >
            <h2 className="text-sm font-semibold">Tambah pertanyaan baru</h2>

            <div className="grid gap-2">
              <Label htmlFor="t-tanya">Pertanyaan dari pelanggan</Label>
              <Input
                id="t-tanya"
                placeholder="Contoh: Cara donasi gimana?"
                value={pertanyaan}
                onChange={(e) => setPertanyaan(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Cara mencocokkan pertanyaan</Label>
              <Select value={caraMencocokkan} onValueChange={(v: "sama_persis" | "boleh_mirip") => setCaraMencocokkan(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sama_persis">Harus sama persis</SelectItem>
                  <SelectItem value="boleh_mirip">Boleh mirip-mirip saja</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3">
              <Label>Balasan (dikirim berurutan, boleh lebih dari satu)</Label>

              {langkahBaru.map((l, i) => (
                <div key={l.id} className="flex items-start gap-2 rounded-lg border border-border bg-secondary/40 p-3">
                  <GripVertical className="mt-2 size-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Pesan ke-{i + 1}</p>
                    {l.tipe === "teks" ? (
                      <Textarea
                        rows={2}
                        placeholder="Tulis isi pesan ini"
                        value={l.isiTeks}
                        onChange={(e) => ubahTeksLangkah(l.id, e.target.value)}
                      />
                    ) : (
                      <div className="space-y-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => ubahGambarLangkah(l.id, e.target.files?.[0])}
                        />
                        {l.namaGambar ? (
                          <p className="text-xs text-muted-foreground">Terpilih: {l.namaGambar}</p>
                        ) : null}
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => hapusLangkah(l.id)}
                    disabled={langkahBaru.length === 1}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              ))}

              <div className="flex gap-2">
                <Button type="button" size="sm" variant="outline" onClick={tambahLangkahTeks}>
                  <MessageSquarePlus className="size-3.5" /> Tambah pesan teks
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={tambahLangkahGambar}>
                  <ImagePlus className="size-3.5" /> Tambah gambar
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full">
              <Plus className="size-4" /> Simpan pertanyaan & balasan
            </Button>
          </form>

          <div className="panel space-y-3 p-5 text-sm">
            <h2 className="font-semibold">Bila tidak ada yang cocok</h2>
            <label className="flex items-center justify-between gap-3">
              Biarkan AI menjawab
              <Switch defaultChecked />
            </label>
            <p className="text-xs text-muted-foreground">
              AI hanya boleh memilih dari daftar balasan di atas dan tidak boleh membuat jawaban
              baru sendiri. Jika tetap tidak ada yang cocok, chat dialihkan ke Anda.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
