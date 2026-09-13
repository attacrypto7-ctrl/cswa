import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Bot, RotateCcw, Send, User } from "lucide-react";
import { useRef, useState } from "react";
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
import { cn } from "@/lib/utils";
import { getAdTemplates, getFaqItems } from "@/mock/api";

export const Route = createFileRoute("/app/uji-coba")({
  head: () => ({
    meta: [
      { title: "Uji Coba Bot — Dashboard Balasin" },
      { name: "description", content: "Uji balasan bot di sandbox sebelum go-live, tanpa perlu lewat WhatsApp asli." },
      { property: "og:title", content: "Uji Coba Bot — Dashboard Balasin" },
      { property: "og:description", content: "Uji balasan bot di sandbox sebelum go-live." },
    ],
  }),
  component: SandboxPage,
});

interface Turn {
  id: number;
  peran: "user" | "bot";
  teks: string;
  sumber?: string;
  keyakinan?: number;
}

let nextId = 1;

function SandboxPage() {
  const { data: faqs = [] } = useQuery({ queryKey: ["faqs"], queryFn: getFaqItems });
  const { data: templates = [] } = useQuery({ queryKey: ["ads"], queryFn: getAdTemplates });
  const [mode, setMode] = useState<"chat" | "iklan">("chat");
  const [input, setInput] = useState("");
  const [turns, setTurns] = useState<Turn[]>([
    {
      id: 0,
      peran: "bot",
      teks: "Halo Kak! Ini mode uji coba. Ketik pertanyaan pelanggan untuk melihat bagaimana bot menjawab.",
    },
  ]);
  const [thinking, setThinking] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const jawab = (pertanyaan: string): Turn => {
    const teksL = pertanyaan.toLowerCase();
    const kata = teksL.split(/\s+/).filter((w) => w.length > 3);

    if (mode === "iklan") {
      const cocok = templates
        .filter((t) => t.aktif)
        .find((t) => {
          const target = t.pertanyaan.toLowerCase();
          if (t.mode === "exact") return target === teksL;
          return kata.some((w) => target.includes(w));
        });
      if (cocok) {
        return {
          id: nextId++,
          peran: "bot",
          teks: cocok.jawaban,
          sumber: `Template iklan (${cocok.mode})`,
          keyakinan: cocok.mode === "exact" ? 1 : 0.88,
        };
      }
      return {
        id: nextId++,
        peran: "bot",
        teks: "Belum ada template yang cocok. Chat ini akan dialihkan ke admin agar tidak salah jawab.",
        sumber: "Tidak ada match",
        keyakinan: 0.2,
      };
    }

    const cocok = faqs.find((f) => {
      const target = `${f.pertanyaan} ${f.jawaban}`.toLowerCase();
      return kata.some((w) => target.includes(w));
    });
    if (cocok) {
      return {
        id: nextId++,
        peran: "bot",
        teks: cocok.jawaban,
        sumber: `FAQ: ${cocok.pertanyaan}`,
        keyakinan: 0.9,
      };
    }
    return {
      id: nextId++,
      peran: "bot",
      teks: "Maaf, saya belum menemukan informasi itu di basis pengetahuan. Saya sambungkan ke admin ya, Kak.",
      sumber: "Di luar FAQ",
      keyakinan: 0.28,
    };
  };

  const kirim = () => {
    const teks = input.trim();
    if (!teks || thinking) return;
    const userTurn: Turn = { id: nextId++, peran: "user", teks };
    setTurns((t) => [...t, userTurn]);
    setInput("");
    setThinking(true);
    timer.current = setTimeout(() => {
      setTurns((t) => [...t, jawab(teks)]);
      setThinking(false);
    }, 650);
  };

  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    setThinking(false);
    setTurns([
      {
        id: nextId++,
        peran: "bot",
        teks: "Sandbox dibersihkan. Silakan mulai percakapan uji coba baru.",
      },
    ]);
    toast.success("Percakapan uji coba direset");
  };

  const contoh =
    mode === "iklan"
      ? ["Masih ada stok?", "Berapa harga promo?", "Lokasi toko di mana?"]
      : ["Bisa COD?", "Pengiriman ke Surabaya berapa hari?", "Jam buka toko?"];

  return (
    <>
      <PageHeader
        title="Uji Coba Bot"
        description="Coba jawaban bot langsung di sini sebelum go-live. Tidak ada pesan yang benar-benar dikirim ke WhatsApp."
        action={
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="size-4" /> Reset
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="panel flex h-[560px] flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Bot className="size-4" />
              </span>
              <span className="text-sm font-medium">Mela — Asisten Uji Coba</span>
            </div>
            <Select value={mode} onValueChange={(v) => setMode(v as "chat" | "iklan")}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chat">Mode Chat (FAQ)</SelectItem>
                <SelectItem value="iklan">Mode Iklan (template)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {turns.map((t) => (
              <div
                key={t.id}
                className={cn("flex gap-3", t.peran === "user" && "flex-row-reverse")}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg",
                    t.peran === "bot" ? "bg-primary/10 text-primary" : "bg-secondary text-foreground",
                  )}
                >
                  {t.peran === "bot" ? <Bot className="size-4" /> : <User className="size-4" />}
                </span>
                <div className={cn("max-w-[78%]", t.peran === "user" && "text-right")}>
                  <div
                    className={cn(
                      "inline-block rounded-2xl px-4 py-2 text-sm",
                      t.peran === "bot"
                        ? "rounded-tl-sm bg-secondary/60 text-foreground"
                        : "rounded-tr-sm bg-primary text-primary-foreground",
                    )}
                  >
                    {t.teks}
                  </div>
                  {t.sumber ? (
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{t.sumber}</span>
                      {typeof t.keyakinan === "number" ? (
                        <StatusPill
                          label={`keyakinan ${Math.round(t.keyakinan * 100)}%`}
                          tone={t.keyakinan >= 0.7 ? "success" : t.keyakinan >= 0.5 ? "warning" : "danger"}
                        />
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
            {thinking ? (
              <div className="flex gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Bot className="size-4" />
                </span>
                <div className="inline-flex items-center gap-1 rounded-2xl rounded-tl-sm bg-secondary/60 px-4 py-3">
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.2s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.1s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
                </div>
              </div>
            ) : null}
          </div>

          <form
            className="flex items-center gap-2 border-t border-border px-4 py-3"
            onSubmit={(e) => {
              e.preventDefault();
              kirim();
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis pesan seperti pelanggan..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                  e.preventDefault();
                  kirim();
                }
              }}
            />
            <Button type="submit" disabled={!input.trim() || thinking}>
              <Send className="size-4" /> Kirim
            </Button>
          </form>
        </div>

        <aside className="space-y-6">
          <div className="panel p-5">
            <h2 className="text-sm font-semibold">Coba pertanyaan ini</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {mode === "iklan"
                ? "Dicocokkan ke template jawaban pasti."
                : "Dijawab dari dokumen & FAQ Anda."}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              {contoh.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setInput(c)}
                  className="rounded-lg border border-border bg-secondary/40 px-3 py-2 text-left text-sm transition-colors hover:border-primary/40 hover:bg-secondary"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="panel space-y-2 p-5 text-sm text-muted-foreground">
            <h2 className="font-semibold text-foreground">Catatan</h2>
            <p>
              Ini simulasi. Balasan nyata nanti dibuat oleh mesin AI terpilih menggunakan konteks
              dokumen tenant yang sesungguhnya.
            </p>
            <p>
              Jika bot sering menjawab &quot;tidak tahu&quot;, lengkapi{" "}
              <span className="text-foreground">Basis Pengetahuan</span> atau tambah{" "}
              <span className="text-foreground">template iklan</span>.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
