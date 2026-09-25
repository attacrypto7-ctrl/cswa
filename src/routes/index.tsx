import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Bot,
  FileText,
  MessageSquare,
  QrCode,
  ShieldCheck,
  Zap,
  Eye,
  EyeOff,
  ChevronDown,
  LogOut,
  UserPlus,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { AmbientBackground } from "@/components/ui/ambient-background";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_BASE, saveSession } from "@/lib/api-client";
import { getGoogleUser, handleLogout, saveGoogleUser, type GoogleUser } from "@/lib/google-auth";

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
        content:
          "Sambungkan WhatsApp lewat QR, unggah FAQ, dan biarkan AI menjawab pelanggan 24 jam dengan jawaban yang Anda kendalikan.",
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
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(() => {
    try {
      return typeof window !== "undefined" ? sessionStorage.getItem("hasSeenLoading") !== "true" : true;
    } catch {
      return true;
    }
  });
  const [loadingFading, setLoadingFading] = useState(false);
  const [landingReady, setLandingReady] = useState(() => {
    try {
      return typeof window !== "undefined" ? sessionStorage.getItem("hasSeenLoading") === "true" : false;
    } catch {
      return false;
    }
  });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const googleClickLockRef = useRef(false);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  useEffect(() => {
    const fullTitle = "Balasin — CS AI WhatsApp untuk Banyak Bisnis   ";
    const workerScript = `
      const titleText = ${JSON.stringify(fullTitle)};
      const len = titleText.length;
      const speedMs = 220;
      const startTime = Date.now();
      setInterval(() => {
        const elapsed = Date.now() - startTime;
        const charOffset = Math.floor(elapsed / speedMs) % len;
        const currentTitle = titleText.substring(charOffset) + titleText.substring(0, charOffset);
        postMessage(currentTitle);
      }, 100);
    `;
    const blob = new Blob([workerScript], { type: "application/javascript" });
    const blobUrl = URL.createObjectURL(blob);
    const worker = new Worker(blobUrl);
    worker.onmessage = (e) => {
      document.title = e.data;
    };
    return () => {
      worker.terminate();
      URL.revokeObjectURL(blobUrl);
    };
  }, []);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("hasSeenLoading") === "true") return;
    } catch {
      /* ignore storage access error */
    }
    const fadeTimer = window.setTimeout(() => setLoadingFading(true), 2000);
    const hideTimer = window.setTimeout(() => {
      setShowLoading(false);
      setLandingReady(true);
      try {
        sessionStorage.setItem("hasSeenLoading", "true");
      } catch {
        /* ignore storage access error */
      }
    }, 2520);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const sync = () => {
      setGoogleUser(getGoogleUser());
      setAvatarError(false);
    };
    sync();
    window.addEventListener("balasin:auth-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("balasin:auth-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    setAvatarError(false);
  }, [googleUser?.avatarUrl, googleUser?.picture]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      try {
        if (event.data?.type === "GOOGLE_AUTH_SUCCESS") {
          const { token, user } = event.data as {
            token: string;
            user: { name: string; email: string; picture: string; avatarUrl?: string | null };
          };
          setOauthError(null);
          try {
            saveSession(token, "tenant");
            saveGoogleUser({
              ...user,
              avatarUrl: user.avatarUrl ?? user.picture ?? null,
              picture: user.picture || user.avatarUrl || "",
            });
          } catch {
            setOauthError("Gagal menyimpan sesi, coba lagi");
            return;
          }
          toast.success("Berhasil masuk dengan Google");
          setShowLogin(false);
          googleClickLockRef.current = false;
          window.setTimeout(() => {
            navigate({ to: "/" });
          }, 250);
        }
        if (event.data?.type === "GOOGLE_AUTH_ERROR") {
          const msg = (event.data?.message as string) || "Autentikasi Google gagal";
          setOauthError(msg);
          toast.error(msg);
          googleClickLockRef.current = false;
        }
      } catch {
        setOauthError("Terjadi kesalahan saat memproses login Google");
        googleClickLockRef.current = false;
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const handleGoogleClick = () => {
    if (googleClickLockRef.current) return;
    googleClickLockRef.current = true;
    setOauthError(null);
    try {
      const popup = window.open(
        `${API_BASE}/auth/google`,
        "google_oauth",
        "width=500,height=600,left=200,top=100",
      );
      if (!popup) {
        setOauthError("Popup diblokir browser. Izinkan popup untuk login Google.");
        toast.error("Popup diblokir browser");
        googleClickLockRef.current = false;
        return;
      }
      const timer = window.setInterval(() => {
        if (popup.closed) {
          window.clearInterval(timer);
          googleClickLockRef.current = false;
        }
      }, 800);
      window.setTimeout(() => {
        googleClickLockRef.current = false;
        window.clearInterval(timer);
      }, 30000);
    } catch {
      setOauthError("Gagal membuka login Google. Coba lagi.");
      toast.error("Gagal membuka login Google");
      googleClickLockRef.current = false;
    }
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !email.includes("@") || password.length < 6) {
      setIsError(true);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }
    setIsError(false);
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      setIsError(true);
    }, 300);
  };

  const avatarSrc = googleUser?.avatarUrl || googleUser?.picture || null;
  const initials = googleUser
    ? googleUser.name
        .split(" ")
        .map((p) => p.charAt(0).toUpperCase())
        .slice(0, 2)
        .join("") || "?"
    : "?";

  return (
    <>
      <AmbientBackground />
      {showLoading ? (
        <div
          aria-hidden={!showLoading}
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden ${loadingFading ? "pointer-events-none" : ""}`}
          style={{
            backgroundColor: "oklch(0.13 0.012 170)",
            opacity: loadingFading ? 0 : 1,
            transition: "opacity 500ms cubic-bezier(0.4, 0, 0.2, 1)",
            willChange: "opacity",
          }}
        >
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div
              className="absolute inset-0 opacity-[0.9]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(16,185,129,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.055) 1px, transparent 1px)",
                backgroundSize: "42px 42px",
                maskImage: "radial-gradient(ellipse 72% 62% at 50% 50%, black 36%, transparent 74%)",
                WebkitMaskImage: "radial-gradient(ellipse 72% 62% at 50% 50%, black 36%, transparent 74%)",
                willChange: "opacity",
                transform: "translateZ(0)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 620px 420px at 50% 46%, oklch(0.72 0.145 157 / 18%), transparent 68%), radial-gradient(ellipse 900px 680px at 50% 50%, oklch(0.7 0.11 230 / 07%), transparent 75%)",
                willChange: "opacity",
                transform: "translateZ(0)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse at center, transparent 38%, rgba(0,0,0,0.64) 92%)",
                willChange: "opacity",
              }}
            />
            <div className="absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/[0.07] blur-[70px]" style={{ willChange: "opacity", transform: "translate3d(-50%,-50%,0)" }} />
          </div>

          <div className="relative flex flex-col items-center justify-center">
            <div className="relative flex size-28 items-center justify-center sm:size-32">
              <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="loading-quantum-ring-5 absolute size-[198%] rounded-full" style={{ willChange: "transform" }}>
                  <svg viewBox="0 0 100 100" className="size-full overflow-visible" aria-hidden>
                    <circle cx="50" cy="50" r="46.8" fill="none" stroke="rgba(52,211,153,0.32)" strokeWidth="0.55" strokeDasharray="0.7 9" strokeLinecap="butt" opacity={0.9} />
                    <circle cx="50" cy="50" r="46.8" fill="none" stroke="rgba(52,211,153,0.95)" strokeWidth="1.1" strokeDasharray="1.6 18 0.6 18" strokeLinecap="round" />
                    <g fill="rgba(52,211,153,0.9)">
                      <circle cx="50" cy="3.2" r="1.05" />
                      <circle cx="96.8" cy="50" r="1.05" />
                      <circle cx="50" cy="96.8" r="1.05" />
                      <circle cx="3.2" cy="50" r="1.05" />
                    </g>
                    <g fill="rgba(45,212,191,0.75)">
                      <circle cx="75.6" cy="14.4" r="0.7" />
                      <circle cx="85.6" cy="24.4" r="0.7" />
                      <circle cx="75.6" cy="85.6" r="0.7" />
                      <circle cx="24.4" cy="85.6" r="0.7" />
                    </g>
                  </svg>
                </div>
                <div className="loading-quantum-ring-1 absolute size-[152%] rounded-full" style={{ willChange: "transform" }}>
                  <svg viewBox="0 0 100 100" className="size-full overflow-visible" aria-hidden>
                    <circle cx="50" cy="50" r="46.5" fill="none" stroke="rgba(52,211,153,0.95)" strokeWidth="1.25" strokeDasharray="8 5.5" strokeLinecap="round" pathLength={100} />
                    <circle cx="50" cy="50" r="46.5" fill="none" stroke="rgba(167,243,208,0.5)" strokeWidth="0.5" strokeDasharray="0.9 22" strokeLinecap="round" opacity={0.85} />
                  </svg>
                </div>
                <div className="loading-quantum-ring-2 absolute size-[174%] rounded-full" style={{ willChange: "transform" }}>
                  <svg viewBox="0 0 100 100" className="size-full overflow-visible" aria-hidden>
                    <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(45,212,191,0.85)" strokeWidth="1.05" strokeDasharray="0.6 10" strokeLinecap="butt" opacity={0.9} />
                    <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(52,211,153,0.9)" strokeWidth="1.2" strokeDasharray="12 11 1 11" strokeLinecap="round" />
                    <g stroke="rgba(52,211,153,0.88)" strokeWidth="1.2" strokeLinecap="round" fill="none">
                      <path d="M50 1.8 L50 7.2 M50 92.8 L50 98.2 M1.8 50 L7.2 50 M92.8 50 L98.2 50" />
                    </g>
                  </svg>
                </div>
                <div className="loading-quantum-ring-3 absolute size-[130%] rounded-full" style={{ willChange: "transform" }}>
                  <svg viewBox="0 0 100 100" className="size-full overflow-visible" aria-hidden>
                    <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(52,211,153,0.92)" strokeWidth="1" strokeDasharray="0 8.2" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(16,185,129,0.28)" strokeWidth="0.55" strokeDasharray="0.7 8.2" strokeLinecap="round" opacity={0.65} />
                  </svg>
                </div>
                <div className="loading-quantum-ring-4 absolute size-[114%] rounded-full" style={{ willChange: "transform, opacity" }}>
                  <svg viewBox="0 0 100 100" className="size-full overflow-visible" aria-hidden>
                    <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(16,185,129,0.38)" strokeWidth="0.9" />
                    <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(52,211,153,0.55)" strokeWidth="0.5" strokeDasharray="1 14" strokeLinecap="round" opacity={0.5} />
                  </svg>
                </div>
                <div className="absolute size-[90%] rounded-full bg-emerald-500/[0.09] blur-2xl" style={{ willChange: "opacity", transform: "translateZ(0)" }} />
                <div className="absolute size-[58%] rounded-full bg-cyan-400/[0.07] blur-xl" style={{ willChange: "opacity", transform: "translateZ(0)" }} />
              </div>
              <div className="loading-levitate relative flex size-[5.25rem] items-center justify-center overflow-hidden rounded-full border border-emerald-400/20 bg-white/[0.015] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07),0_10px_36px_rgba(0,0,0,0.5)] backdrop-blur-sm sm:size-[5.75rem]" style={{ willChange: "transform" }}>
                <img
                  src="/chatbot_wa.png"
                  alt=""
                  width={92}
                  height={92}
                  className="loading-bot-pulse size-[5.1rem] rounded-full object-contain sm:size-[5.5rem]"
                  style={{ willChange: "transform, opacity" }}
                />
                <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_22px_rgba(16,185,129,0.14)] ring-1 ring-emerald-400/15" />
              </div>
            </div>

            <div className="mt-7 flex flex-col items-center gap-1.5">
              <p className="loading-shimmer-text text-[14px] font-semibold tracking-[0.16em] sm:text-[15px]" style={{ willChange: "opacity", transform: "translateZ(0)" }}>
                Memuat chatbot...
              </p>
              <div className="flex items-center gap-1.5" aria-hidden>
                <span className="loading-dot size-1 rounded-full bg-emerald-400" style={{ animationDelay: "0ms" } as React.CSSProperties} />
                <span className="loading-dot size-1 rounded-full bg-emerald-400" style={{ animationDelay: "220ms" } as React.CSSProperties} />
                <span className="loading-dot size-1 rounded-full bg-cyan-400" style={{ animationDelay: "440ms" } as React.CSSProperties} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <div className="surface-grid min-h-screen">
        <header
          className={`mx-auto flex max-w-6xl items-center justify-between px-6 py-6 ${landingReady ? "landing-entry landing-entry-delay-1" : "opacity-0"}`}
        >
          <Link to="/" className="flex items-center gap-2 text-lg font-bold">
            <img
              src="/chatbot_wa.png"
              alt="Balasin logo"
              className="size-9 rounded-xl object-contain"
            />
            Balasin
          </Link>
          <div className="flex items-center gap-3">
            {googleUser ? (
              <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex cursor-pointer items-center gap-2.5 rounded-full border border-border bg-card/50 p-1 pr-3 transition-colors hover:bg-accent focus-visible:outline-none">
                  <span className="relative flex size-8 shrink-0">
                    {avatarSrc && !avatarError ? (
                      <img
                        src={avatarSrc}
                        alt="Profile"
                        referrerPolicy="no-referrer"
                        onError={() => setAvatarError(true)}
                        className="size-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                        {initials}
                      </span>
                    )}
                  </span>
                  <span className="hidden text-sm font-medium sm:inline-block">
                    {googleUser.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </button>
                {isOpen && (
                  <div className="absolute top-full right-0 pt-2 z-50">
                    <div className="w-56 rounded-md border bg-popover p-1 shadow-md">
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-semibold">{googleUser.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground truncate">
                          {googleUser.email}
                        </p>
                      </div>
                      <div className="-mx-1 my-1 h-px bg-muted" />
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          setShowLogin(true);
                        }}
                        className="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                      >
                        <UserPlus className="mr-2 size-4" />
                        Tambahkan akun lain
                      </button>
                      <button
                        onClick={() => handleLogout()}
                        className="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent text-red-600 focus:text-red-600 hover:text-red-600"
                      >
                        <LogOut className="mr-2 size-4" />
                        Log Out / Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="cursor-pointer rounded-xl bg-emerald-500 hover:bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(16,185,129,0.35)] will-change-transform active:translate-y-0"
              >
                Masuk
              </button>
            )}
          </div>
        </header>

        <Dialog open={showLogin} onOpenChange={setShowLogin}>
          <DialogContent className="sm:max-w-md">
            <style>{`
              @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
              }
              .shake-animation {
                animation: shake 0.5s ease-in-out;
              }
            `}</style>
            <DialogHeader className="items-center">
              <DialogTitle className="text-center text-xl font-medium">
                Masuk dengan Akun Google Anda
              </DialogTitle>
              <DialogDescription className="text-center text-sm">
                Lanjutkan ke Balasin
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleManualLogin}
              className={`space-y-4 pt-2 ${isShaking ? "shake-animation" : ""}`}
            >
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (isError) setIsError(false);
                  }}
                  className={isError ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs text-muted-foreground">
                  Kata Sandi
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan kata sandi"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (isError) setIsError(false);
                    }}
                    className={isError ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {isError && (
                  <p className="text-red-500 text-xs mt-1 leading-tight">
                    Email dan password tidak valid, pastikan akun google anda terdaftar di google
                  </p>
                )}
              </div>

              <div className="relative my-6 flex items-center justify-center">
                <div className="w-full border-t border-border" />
                <span className="absolute bg-background px-2 text-xs text-muted-foreground">
                  ATAU
                </span>
              </div>

              <button
                type="button"
                onClick={handleGoogleClick}
                className="cursor-pointer w-full flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <svg className="size-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Lanjutkan dengan Google</span>
              </button>
              {oauthError && (
                <p className="text-amber-600 dark:text-amber-400 text-xs leading-tight rounded-md border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-3 py-2">
                  {oauthError}
                </p>
              )}

              <Button
                type="submit"
                className="cursor-pointer w-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium"
              >
                Lanjut
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <section className="mx-auto max-w-6xl px-6 pt-8 pb-20 text-center transform-gpu [contain:layout_style_paint]">
          <h1
            className={`mx-auto mt-2 max-w-3xl text-4xl font-extrabold leading-tight text-center md:text-6xl ${landingReady ? "landing-entry landing-entry-delay-2" : "opacity-0"}`}
          >
            <span className="hero-glimmer">Customer service</span>
            <br />
            <span className="hero-glimmer">WhatsApp</span> <span className="text-white">yang membalas</span>
            <br />
            <span className="text-white">sendiri</span>
          </h1>
          <p
            className={`mx-auto mt-5 max-w-xl text-base text-muted-foreground ${landingReady ? "landing-entry landing-entry-delay-3" : "opacity-0"}`}
          >
            Satu platform untuk banyak bisnis: sambungkan nomor WhatsApp, unggah FAQ, dan AI menjawab pelanggan 24 jam dengan jawaban yang Anda kendalikan.
          </p>
          <div
            className={`mt-8 flex justify-center ${landingReady ? "landing-entry landing-entry-delay-4" : "opacity-0"}`}
          >
            <Button
              size="lg"
              className="cta-button"
              onClick={() => window.location.assign("/app")}
              type="button"
            >
              Lihat Dashboard Tenant
            </Button>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl auto-rows-fr gap-4 px-6 pb-24 sm:grid-cols-2 lg:grid-cols-3">
          {fitur.map((f) => (
            <article
              key={f.judul}
              className="flex h-full min-h-[215px] cursor-pointer flex-col panel feature-card p-6"
            >
              <span className="feature-icon flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="size-5" />
              </span>
              <h2 className="mt-4 text-base font-semibold">{f.judul}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{f.teks}</p>
            </article>
          ))}
        </section>
      </div>
    </>
  );
}
