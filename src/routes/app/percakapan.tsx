import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Search, UserRoundCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/dashboard/shell";
import { StatusPill } from "@/components/dashboard/status-pill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { getChatLogs } from "@/mock/api";
import type { ChatLog } from "@/mock/data";

export const Route = createFileRoute("/app/percakapan")({
  head: () => ({
    meta: [
      { title: "Riwayat Chat — Dashboard Balasin" },
      { name: "description", content: "Tinjau percakapan pelanggan, keyakinan jawaban bot, dan chat yang perlu ditangani manusia." },
      { property: "og:title", content: "Riwayat Chat — Dashboard Balasin" },
      { property: "og:description", content: "Tinjau percakapan pelanggan dan keyakinan jawaban bot." },
    ],
  }),
  component: ConversationsPage,
});

function toneForChat(status: ChatLog["status"]) {
  if (status === "terjawab") return "success" as const;
  if (status === "perlu manusia") return "warning" as const;
  return "info" as const;
}

function ConversationsPage() {
  const { data: logs = [] } = useQuery({ queryKey: ["chats"], queryFn: getChatLogs });
  const [q, setQ] = useState("");
  const [kanal, setKanal] = useState("semua");
  const [status, setStatus] = useState("semua");

  const filtered = useMemo(
    () =>
      logs.filter((l) => {
        const cocokKanal = kanal === "semua" || l.kanal === kanal;
        const cocokStatus = status === "semua" || l.status === status;
        const cocokQ =
          q.trim() === "" ||
          l.kontak.toLowerCase().includes(q.toLowerCase()) ||
          l.pesanTerakhir.toLowerCase().includes(q.toLowerCase());
        return cocokKanal && cocokStatus && cocokQ;
      }),
    [logs, q, kanal, status],
  );

  const perluManusia = logs.filter((l) => l.status === "perlu manusia").length;

  return (
    <>
      <PageHeader
        title="Riwayat Chat"
        description="Semua percakapan tersimpan untuk ditinjau dan dijadikan bahan melengkapi FAQ."
        action={
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm">
            <UserRoundCheck className="size-4 text-warning" />
            <span>{perluManusia} perlu manusia</span>
          </div>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Cari nama atau isi pesan..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Select value={kanal} onValueChange={setKanal}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua kanal</SelectItem>
            <SelectItem value="Chat">Chat</SelectItem>
            <SelectItem value="Iklan">Iklan</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua status</SelectItem>
            <SelectItem value="terjawab">Terjawab</SelectItem>
            <SelectItem value="perlu manusia">Perlu manusia</SelectItem>
            <SelectItem value="diambil alih">Diambil alih</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="panel overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kontak</TableHead>
              <TableHead>Kanal</TableHead>
              <TableHead className="min-w-64">Percakapan</TableHead>
              <TableHead>Keyakinan</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((l) => (
              <TableRow key={l.id}>
                <TableCell>
                  <p className="font-medium">{l.kontak}</p>
                  <p className="font-mono text-xs text-muted-foreground">{l.nomor}</p>
                </TableCell>
                <TableCell>
                  <StatusPill label={l.kanal} tone={l.kanal === "Iklan" ? "warning" : "info"} />
                </TableCell>
                <TableCell className="max-w-md">
                  <p className="text-sm">{l.pesanTerakhir}</p>
                  <p className="mt-1 text-xs text-muted-foreground">↳ {l.balasan}</p>
                </TableCell>
                <TableCell>
                  <span
                    className={
                      l.keyakinan >= 0.7
                        ? "text-success"
                        : l.keyakinan >= 0.5
                          ? "text-warning"
                          : "text-destructive"
                    }
                  >
                    {Math.round(l.keyakinan * 100)}%
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{l.waktu}</TableCell>
                <TableCell>
                  <StatusPill label={l.status} tone={toneForChat(l.status)} />
                </TableCell>
                <TableCell className="text-right">
                  {l.status === "perlu manusia" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.success(`Anda mengambil alih chat ${l.kontak} (contoh)`)}
                    >
                      Ambil alih
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toast.info(`Membuka transkrip ${l.kontak} (contoh)`)}
                    >
                      Lihat
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                  Tidak ada percakapan yang cocok dengan filter.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
