import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, History, Plus, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/dashboard/shell";
import { StatusPill } from "@/components/dashboard/status-pill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, getFaqItems, getKnowledgeDocs } from "@/mock/api";

export const Route = createFileRoute("/app/pengetahuan")({
  head: () => ({
    meta: [
      { title: "Basis Pengetahuan — Dashboard Balasin" },
      {
        name: "description",
        content: "Unggah dokumen dan tulis FAQ yang jadi sumber jawaban bot WhatsApp Anda.",
      },
      { property: "og:title", content: "Basis Pengetahuan — Dashboard Balasin" },
      { property: "og:description", content: "Unggah dokumen dan tulis FAQ sumber jawaban bot." },
    ],
  }),
  component: KnowledgePage,
});

// Ganti istilah teknis status dokumen jadi bahasa yang mudah dipahami tenant
function labelStatusDokumen(status: string) {
  if (status === "terindeks" || status === "siap_dipakai") return "Siap dipakai";
  if (status === "memproses" || status === "sedang_diproses") return "Sedang diproses";
  return "Gagal diproses";
}

function KnowledgePage() {
  const { data: docs = [] } = useQuery({ queryKey: ["docs"], queryFn: getKnowledgeDocs });
  const { data: faqs = [] } = useQuery({ queryKey: ["faqs"], queryFn: getFaqItems });

  return (
    <>
      <PageHeader
        title="Basis Pengetahuan"
        description="Semakin lengkap isinya, semakin jarang bot menjawab 'tidak tahu'."
      />

      <Tabs defaultValue="dokumen">
        <TabsList>
          <TabsTrigger value="dokumen">Dokumen</TabsTrigger>
          <TabsTrigger value="faq">FAQ Manual</TabsTrigger>
        </TabsList>

        <TabsContent value="dokumen" className="mt-6 space-y-6">
          <div
            className="panel flex flex-col items-center gap-3 border-dashed p-10 text-center"
            onClick={() => toast.info("Unggahan masih simulasi pada tahap ini")}
          >
            <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UploadCloud className="size-6" />
            </span>
            <p className="text-sm font-medium">Tarik berkas ke sini atau klik untuk memilih</p>
            <p className="text-xs text-muted-foreground">
              PDF atau teks, maksimal 20 MB per berkas
            </p>
            <Button variant="outline" size="sm">
              Pilih berkas
            </Button>
          </div>

          <div className="panel overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Ukuran</TableHead>
                  <TableHead>Versi</TableHead>
                  <TableHead>Diperbarui</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {docs.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="flex items-center gap-2 font-medium">
                      <FileText className="size-4 text-muted-foreground" />
                      {d.nama}
                    </TableCell>
                    <TableCell>{d.tipe}</TableCell>
                    <TableCell>{d.ukuran}</TableCell>
                    <TableCell>v{d.versi}</TableCell>
                    <TableCell>{formatDate(d.diperbarui)}</TableCell>
                    <TableCell>
                      <StatusPill
                        label={labelStatusDokumen(d.status)}
                        tone={
                          d.status === "terindeks"
                            ? "success"
                            : d.status === "memproses"
                              ? "info"
                              : "danger"
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toast.info(`Riwayat versi ${d.nama}`)}
                      >
                        <History className="size-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => toast.warning(`${d.nama} dihapus`)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {docs.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      Belum ada dokumen yang diunggah. Unggah file PDF atau berkas teks di atas.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="faq" className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="panel divide-y divide-border">
            {faqs.map((f) => (
              <div key={f.id} className="px-5 py-4">
                <p className="text-sm font-medium">{f.pertanyaan}</p>
                <p className="mt-1 text-sm text-muted-foreground">{f.jawaban}</p>
              </div>
            ))}
            {faqs.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                Belum ada FAQ manual. Tambahkan pertanyaan dan jawaban umum lewat form di samping.
              </div>
            )}
          </div>

          <form
            className="panel h-fit space-y-4 p-5"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("FAQ ditambahkan (contoh)");
            }}
          >
            <h2 className="text-sm font-semibold">Tambah FAQ</h2>
            <div className="grid gap-2">
              <Label htmlFor="tanya">Pertanyaan</Label>
              <Input id="tanya" placeholder="Contoh: Apakah bisa kirim hari ini?" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="jawab">Jawaban</Label>
              <Textarea id="jawab" rows={4} placeholder="Tulis jawaban yang ingin bot sampaikan" />
            </div>
            <Button type="submit" className="w-full">
              <Plus className="size-4" /> Simpan FAQ
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </>
  );
}
