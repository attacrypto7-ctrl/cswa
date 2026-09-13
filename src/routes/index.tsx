import { Link, createFileRoute } from "@tanstack/react-router";
import { Bot, FileText, MessageSquare, QrCode, ShieldCheck, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Balasin — CS AI WhatsApp untuk Banyak Bisnis" },
      {
        name: "description",
        content:
          "Platform multi-tenant untuk membalas chat WhatsApp pelanggan secara otomatis dengan AI dan FAQ bisnis Anda sendiri.",
      },
      { property: "og:title", content: "Balasin — CS AI WhatsApp untuk Banyak Bisnis" },
      {
        property: "og:description",
        content: "Sambungkan WhatsApp lewat QR, unggah FAQ, dan biarkan AI menjawab pelanggan.",
      },
    ],
  }),
  component: Landing,
});

const fitur = [
  {
    icon: MessageSquare,
    judul: "Balas Chat Otomatis",
    teks: "AI menjawab berdasarkan dokumen dan FAQ yang Anda unggah, dengan gaya bahasa sendiri.",
  },
  {
    icon: Zap,
    judul: "Balas Iklan Otomatis",
    teks: "Jawaban template presisi untuk chat dari iklan, konsisten dan aman untuk brand.",
  },
  {
    icon: QrCode,
    judul: "Koneksi WhatsApp via QR",
    teks: "Pindai QR dari dashboard, pantau status sambungan tiap nomor secara langsung.",
  },
  {
    icon: FileText,
    judul: "Basis Pengetahuan",
    teks: "Unggah PDF atau tulis FAQ manual, lengkap dengan riwayat versi.",
  },
  {
    icon: ShieldCheck,
    judul: "Lisensi & Kuota",
    teks: "Kode lisensi per tenant dengan masa berlaku, kuota chat, dan pencabutan instan.",
  },
  {
    icon: Bot,
    judul: "Uji Coba Bot",
    teks: "Coba kualitas jawaban di dashboard sebelum bot dipakai ke pelanggan asli.",
  },
];

function Landing() {
  return (
    <div className="surface-grid min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="flex items-center gap-2 text-lg font-bold">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Bot className="size-5" />
          </span>
          Balasin
        </span>
        <div className="flex gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin">Masuk Admin</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/app">Dashboard Tenant</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pt-14 pb-20 text-center">
        <span className="inline-flex rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          Pratinjau antarmuka — data masih contoh
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
          Customer service <span className="text-gradient-brand">WhatsApp</span> yang membalas
          sendiri
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
          Satu platform untuk banyak bisnis: sambungkan nomor WhatsApp, unggah FAQ, dan AI
          menjawab pelanggan 24 jam dengan jawaban yang Anda kendalikan.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/app">Lihat Dashboard Tenant</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/admin">Lihat Dashboard Admin</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {fitur.map((f) => (
          <article key={f.judul} className="panel p-6">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <f.icon className="size-5" />
            </span>
            <h2 className="mt-4 text-base font-semibold">{f.judul}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{f.teks}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
