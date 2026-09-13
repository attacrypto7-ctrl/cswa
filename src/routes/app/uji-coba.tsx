import { createFileRoute } from "@tanstack/react-router";
import { Bot, RotateCcw, Send, Sparkles, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/dashboard/shell";
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
import { aiEngines, faqItems, adTemplates } from "@/mock/data";

export const Route = createFileRoute("/app/uji-coba")({
  head: () => ({
    meta: [
      { title: "Uji Coba Bot — Dashboard Balasin" },
      { name: "description", content: "Simulasi percakapan dengan bot AI Anda sebelum dihubungkan ke WhatsApp pelanggan asli." },
      { property: "og:title", content: "Uji Coba Bot — Dashboard Balasin" },
      { property: "og:description", content: "Simulasi percakapan bot AI." },
    ],
  }),
  component: UjiCobaPage,
});

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  source?: string;
  confidence?: number;
  time: string;
}

const initialMessages: Message[] = [
  {
    id: "m-1",
    sender: "bot",
    text: "Halo Kak! Terima kasih sudah menghubungi Toko Bunga Melati. Ada yang bisa kami bantu hari ini? 😊",
    time: "10:00",
  },
];

export function UjiCobaPage() {
  const [engine, setEngine] = useState("deepseek-v4-flash");
  const [kanal, setKanal] = useState<"chat" | "iklan">("chat");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input.trim();
    const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: userText,
      time: now,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      let botResponse = "Maaf Kak, informasi mengenai hal tersebut belum tercatat di data kami. Segera saya hubungkan dengan admin ya!";
      let source = "Fallback / Eskalasi CS";
      let confidence = 0.45;

      const lower = userText.toLowerCase();

      if (kanal === "iklan") {
        const matchedAd = adTemplates.find((t) =>
          t.mode === "exact"
            ? lower === t.pertanyaan.toLowerCase()
            : lower.includes(t.pertanyaan.toLowerCase()) || t.pertanyaan.toLowerCase().includes(lower),
        );

        if (matchedAd) {
          botResponse = matchedAd.jawaban;
          source = `Template Iklan: "${matchedAd.pertanyaan}"`;
          confidence = 0.98;
        }
      } else {
        const matchedFaq = faqItems.find((f) =>
          lower.includes("ongkir") || lower.includes("kirim") || lower.includes("pengiriman")
            ? f.pertanyaan.includes("pengiriman")
            : lower.includes("cod") || lower.includes("tempat") || lower.includes("bayar")
              ? f.pertanyaan.includes("tempat")
              : lower.includes("jam") || lower.includes("buka") || lower.includes("operasional")
                ? f.pertanyaan.includes("operasional")
                : false,
        );

        if (matchedFaq) {
          botResponse = matchedFaq.jawaban;
          source = `Basis Pengetahuan FAQ: "${matchedFaq.pertanyaan}"`;
          confidence = 0.94;
        } else if (lower.includes("halo") || lower.includes("hai") || lower.includes("pagi") || lower.includes("siang") || lower.includes("sore") || lower.includes("malam")) {
          botResponse = "Halo Kak! Ada buket bunga atau pesanan khusus yang bisa kami bantu hari ini? 🌸";
          source = "Instruksi Sapaan Pembuka";
          confidence = 0.99;
        }
      }

      const botMsg: Message = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: botResponse,
        source,
        confidence,
        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setLoading(false);
    }, 600);
  };

  const resetChat = () => {
    setMessages(initialMessages);
    toast.info("Percakapan uji coba direset.");
  };

  return (
    <>
      <PageHeader
        title="Uji Coba Bot"
        description="Simulasikan percakapan pelanggan untuk memastikan respons AI dan template jawaban sudah akurat."
        action={
          <Button variant="outline" size="sm" onClick={resetChat}>
            <RotateCcw className="size-3.5" /> Reset Obrolan
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <div className="panel space-y-5 p-5">
          <h2 className="text-sm font-semibold">Pengaturan Simulasi</h2>

          <div className="grid gap-2">
            <Label>Mesin AI (Backend)</Label>
            <Select value={engine} onValueChange={setEngine}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {aiEngines.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {aiEngines.find((e) => e.id === engine)?.catatan}
            </p>
          </div>

          <div className="grid gap-2">
            <Label>Skenario Masuk</Label>
            <Select value={kanal} onValueChange={(v: "chat" | "iklan") => setKanal(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chat">Chat Pelanggan (FAQ & RAG)</SelectItem>
                <SelectItem value="iklan">Chat dari Iklan (Template Terikat)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border border-border bg-secondary/30 p-3 text-xs text-muted-foreground space-y-2">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <Sparkles className="size-3.5 text-primary" /> Info Pengetahuan Aktif
            </div>
            <p>• 4 Dokumen terindeks</p>
            <p>• 3 FAQ Manual siap pakai</p>
            <p>• 4 Template Balas Iklan</p>
          </div>
        </div>

        <div className="panel flex h-[580px] flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-border bg-secondary/20 px-5 py-3">
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Bot className="size-4" />
              </span>
              <div>
                <p className="text-xs font-semibold">Mela (Bot Toko Bunga Melati)</p>
                <p className="text-[10px] text-muted-foreground">Status: Online · Simulasi Aktif</p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "bot" && (
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Bot className="size-3.5" />
                  </span>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-secondary text-foreground rounded-tl-none border border-border"
                  }`}
                >
                  <p>{m.text}</p>
                  <div className="mt-1 flex items-center justify-between gap-3 text-[10px] opacity-70">
                    <span>{m.time}</span>
                    {m.confidence !== undefined && (
                      <span>Keyakinan: {Math.round(m.confidence * 100)}%</span>
                    )}
                  </div>
                  {m.source && (
                    <div className="mt-1.5 border-t border-border/40 pt-1 text-[10px] text-primary">
                      Sumber: {m.source}
                    </div>
                  )}
                </div>

                {m.sender === "user" && (
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground">
                    <User className="size-3.5" />
                  </span>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Bot className="size-3.5 animate-spin text-primary" />
                <span>Mela sedang mengetik jawaban...</span>
              </div>
            )}
          </div>

          <div className="border-t border-border bg-card p-3">
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ketik pesan simulasi (contoh: Apakah bisa bayar COD?)..."
                disabled={loading}
              />
              <Button type="submit" disabled={loading || !input.trim()}>
                <Send className="size-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
