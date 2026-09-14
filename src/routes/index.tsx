import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
<<<<<<< HEAD
import { Bot, FileText, MessageSquare, QrCode, ShieldCheck, Zap } from "lucide-react";
=======
import { Bot, FileText, MessageSquare, QrCode, ShieldCheck, Zap, ArrowRight, X, Loader2 } from "lucide-react";
>>>>>>> f3af05c (debug error, desain UI, dan alur kerja)
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AmbientBackground } from "@/components/ui/ambient-background";
<<<<<<< HEAD
import { getToken } from "@/lib/api-client";
=======
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
>>>>>>> f3af05c (debug error, desain UI, dan alur kerja)

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
<<<<<<< HEAD
  const navigate = useNavigate();
  const isLoggedIn = getToken() !== null;
=======
  const [activeModal, setActiveModal] = useState<"masuk" | "daftar" | null>(null);
  const navigate = useNavigate();

>>>>>>> f3af05c (debug error, desain UI, dan alur kerja)
  return (
    <>
      <AmbientBackground />
      <div className="surface-grid min-h-screen">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <span className="flex items-center gap-2 text-lg font-bold">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Bot className="size-5" />
            </span>
            Balasin
          </span>
<<<<<<< HEAD
          <div className="flex gap-2">
            <Button asChild variant="ghost" size="sm">
              <a href="/admin">Masuk Admin</a>
            </Button>
            <Button asChild size="sm">
              <a href="/masuk">{isLoggedIn ? "Dashboard" : "Masuk Tenant"}</a>
            </Button>
=======
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveModal("masuk")}
              className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-4 py-2 text-sm font-medium text-emerald-300 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-200 hover:shadow-[0_0_15px_rgba(16,185,129,0.35)] active:translate-y-0"
            >
              Masuk
            </button>
            <button
              onClick={() => setActiveModal("daftar")}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 px-5 py-2 text-sm font-bold text-slate-950 shadow-md shadow-emerald-500/20 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(16,185,129,0.65)] active:translate-y-0"
            >
              <span className="relative z-10 flex items-center gap-2">
                Daftar
                <ArrowRight className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 translate-x-[-100%] bg-white/20 transition-transform duration-700 ease-in-out group-hover:translate-x-[100%]" />
            </button>
>>>>>>> f3af05c (debug error, desain UI, dan alur kerja)
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
<<<<<<< HEAD
            <Button asChild size="lg">
              <a href="/masuk">{isLoggedIn ? "Dashboard Tenant" : "Masuk Tenant"}</a>
=======
            <Button asChild size="lg" className="cta-button">
              <Link to="/app">Lihat Dashboard Tenant</Link>
>>>>>>> f3af05c (debug error, desain UI, dan alur kerja)
            </Button>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-24 sm:grid-cols-2 lg:grid-cols-3">
          {fitur.map((f) => (
            <article key={f.judul} className="panel feature-card p-6">
              <span className="feature-icon flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="size-5" />
              </span>
              <h2 className="mt-4 text-base font-semibold">{f.judul}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{f.teks}</p>
            </article>
          ))}
        </section>
      </div>

      {activeModal === "masuk" && <MasukModal onClose={() => setActiveModal(null)} />}
      {activeModal === "daftar" && <DaftarModal onClose={() => setActiveModal(null)} />}
    </>
  );
}

function MasukModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [kode, setKode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMasuk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kode.trim()) {
      setError("Kode tidak boleh kosong");
      return;
    }
    setError("");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onClose();
      navigate({ to: "/app" });
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transform-gpu">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md transform-gpu transition-all duration-150 ease-out">
        <div className="bg-slate-900/90 border border-emerald-500/20 shadow-lg rounded-2xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Masuk ke Dashboard</h2>
                <p className="mt-1 text-xs text-emerald-400/60">Gunakan kode yang diterima dari QR pendaftaran</p>
              </div>
              <button onClick={onClose} className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-emerald-400/60 hover:bg-white/10 hover:text-emerald-400 transition-colors">
                <X className="size-4" />
              </button>
            </div>
            <form onSubmit={handleMasuk} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="kode-login" className="text-xs font-semibold uppercase tracking-wider text-emerald-500/50 ml-1">KODE</Label>
                <Input
                  id="kode-login"
                  value={kode}
                  onChange={(e) => { setKode(e.target.value); setError(""); }}
                  placeholder="Silahkan masukkan kode QR Code anda"
                  className="bg-black/40 border-emerald-500/10 focus-visible:ring-emerald-500 focus-visible:border-emerald-500/50 text-white placeholder:text-white/20 h-11"
                />
                {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full relative overflow-hidden h-11 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 group"
              >
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : (
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Masuk ke Dashboard
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
                {!isLoading && <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />}
              </Button>
            </form>
          </div>
          <div className="bg-emerald-500/5 py-3 px-8 border-t border-emerald-500/10">
            <p className="text-[10px] text-center text-emerald-500/30 uppercase tracking-[0.15em]">Private Access • Encrypted</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DaftarModal({ onClose }: { onClose: () => void }) {
  const [stage, setStage] = useState<"form" | "qr">("form");
  const [nama, setNama] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [kode, setKode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDaftar = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const generated = "BLS-" + Math.random().toString(36).slice(2, 6).toUpperCase();
      setKode(generated);
      setStage("qr");
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transform-gpu">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md transform-gpu transition-all duration-150 ease-out">
        <div className="bg-slate-900/90 border border-emerald-500/20 shadow-lg rounded-2xl overflow-hidden">
          {stage === "form" ? (
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Daftar Akun Baru</h2>
                  <p className="mt-1 text-xs text-emerald-400/60">Buat akses tenant Anda dalam hitungan detik</p>
                </div>
                <button onClick={onClose} className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-emerald-400/60 hover:bg-white/10 hover:text-emerald-400 transition-colors">
                  <X className="size-4" />
                </button>
              </div>
              <form onSubmit={handleDaftar} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="nama-daftar" className="text-xs font-semibold uppercase tracking-wider text-emerald-500/50 ml-1">Nama Lengkap / Bisnis</Label>
                  <Input
                    id="nama-daftar"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Mis: Toko Berkah Jaya"
                    className="bg-black/40 border-emerald-500/10 focus-visible:ring-emerald-500 text-white placeholder:text-white/20 h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wa-daftar" className="text-xs font-semibold uppercase tracking-wider text-emerald-500/50 ml-1">Nomor WhatsApp</Label>
                  <Input
                    id="wa-daftar"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="bg-black/40 border-emerald-500/10 focus-visible:ring-emerald-500 text-white placeholder:text-white/20 h-11"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 group relative overflow-hidden"
                >
                  {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Lanjutkan"}
                  {!isLoading && <div className="absolute inset-0 translate-x-[-100%] bg-white/20 group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />}
                </Button>
              </form>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-bold text-white">Verifikasi QR Code</h3>
                <button onClick={onClose} className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-emerald-400/60 hover:bg-white/10 transition-colors">
                  <X className="size-4" />
                </button>
              </div>
              <div className="mx-auto flex size-48 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-950/30 backdrop-blur-sm p-4 mb-6">
                <QrCode className="size-32 text-emerald-400/80" />
              </div>
              <p className="text-sm text-emerald-200/70 mb-1">Scan QR Code ini dengan WhatsApp Anda</p>
              <p className="text-xs text-emerald-500/40 mb-6">Kami akan mengirimkan <span className="text-emerald-400 font-semibold">Kode Akses Tenant</span> setelah berhasil scan</p>
              {kode && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-4 py-3 flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-wider text-emerald-500/50">Kode Akses</p>
                    <p className="text-base font-mono font-bold text-white tracking-widest">{kode}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-lg border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/10 hover:text-white"
                    onClick={() => { navigator.clipboard.writeText(kode); }}
                  >
                    Salin
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
