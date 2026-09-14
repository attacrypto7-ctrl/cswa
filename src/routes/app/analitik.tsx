import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Coins, HelpCircle, MessagesSquare, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";

import { PageHeader } from "@/components/dashboard/shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { Progress } from "@/components/ui/progress";
import { formatNumber, getAnalytics } from "@/mock/api";

export const Route = createFileRoute("/app/analitik")({
  head: () => ({
    meta: [
      { title: "Analitik — Dashboard Balasin" },
      { name: "description", content: "Statistik pesan, efisiensi AI, dan pertanyaan terpopuler dari pelanggan." },
      { property: "og:title", content: "Analitik — Dashboard Balasin" },
      { property: "og:description", content: "Statistik pesan dan efisiensi AI bot." },
    ],
  }),
  component: AnalitikPage,
});

export function AnalitikPage() {
  const { data } = useQuery({ queryKey: ["analytics"], queryFn: getAnalytics });

  const chatHarian = data?.chatHarian ?? [];
  const pemakaianToken = data?.pemakaianToken ?? [];
  const pertanyaanTeratas = data?.pertanyaanTeratas ?? [];

  const totalChatMingguan = (chatHarian as { chat: number; gagal: number }[]).reduce((a, c) => a + c.chat, 0);
  const totalGagalMingguan = (chatHarian as { chat: number; gagal: number }[]).reduce((a, c) => a + c.gagal, 0);
  const totalToken = (pemakaianToken as { token: number }[]).reduce((a, c) => a + c.token, 0);
  const suksesPersen =
    totalChatMingguan > 0
      ? Math.round(((totalChatMingguan - totalGagalMingguan) / totalChatMingguan) * 100)
      : 0;
  const maxPertanyaan = pertanyaanTeratas[0]?.jumlah || 1;

  return (
    <>
      <PageHeader
        title="Analitik & Performa"
        description="Pantau volume chat masuk, efisiensi balasan otomatis AI, dan topik yang paling sering ditanyakan pelanggan."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Chat Minggu Ini"
          value={formatNumber(totalChatMingguan)}
          icon={MessagesSquare}
          hint="Volume chat masuk"
        />
        <StatCard
          label="Tingkat Balas Otomatis"
          value={totalChatMingguan > 0 ? `${suksesPersen}%` : "-"}
          icon={TrendingUp}
          tone="success"
          hint="Dijawab tuntas oleh bot"
        />
        <StatCard
          label="Pemakaian Token"
          value={totalToken > 0 ? `${totalToken.toFixed(1)} Juta` : "0"}
          icon={Coins}
          hint="Penggunaan model AI"
        />
        <StatCard
          label="Topik Pertanyaan"
          value={String(pertanyaanTeratas.length)}
          icon={HelpCircle}
          hint="Teridentifikasi berulang"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="panel p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold">Volume Chat 7 Hari Terakhir</h2>
            <p className="text-xs text-muted-foreground">Jumlah chat dijawab bot vs dialihkan ke admin</p>
          </div>
          {chatHarian.length > 0 ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chatHarian}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="hari" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="chat" name="Chat Berhasil" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="gagal" name="Perlu Manusia" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
              Belum ada data aktivitas chat.
            </div>
          )}
        </div>

        <div className="panel p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold">Tren Pemakaian Token (Juta Token)</h2>
            <p className="text-xs text-muted-foreground">Akumulasi pemakaian model AI</p>
          </div>
          {pemakaianToken.length > 0 ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pemakaianToken}>
                  <defs>
                    <linearGradient id="colorToken" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="token"
                    name="Token (Juta)"
                    stroke="#0ea5e9"
                    fillOpacity={1}
                    fill="url(#colorToken)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
              Belum ada riwayat penggunaan token.
            </div>
          )}
        </div>
      </div>

      <div className="panel mt-6 p-5">
        <h2 className="text-sm font-semibold">Pertanyaan Paling Sering Diajukan</h2>
        <p className="text-xs text-muted-foreground">
          Bisa digunakan untuk memperkaya data FAQ dan materi promosi.
        </p>

        {pertanyaanTeratas.length > 0 ? (
          <div className="mt-5 space-y-4">
            {pertanyaanTeratas.map((p: { pertanyaan: string; jumlah: number }, index: number) => (
              <div key={p.pertanyaan} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">
                    {index + 1}. {p.pertanyaan}
                  </span>
                  <span className="text-muted-foreground">{formatNumber(p.jumlah)} kali</span>
                </div>
                <Progress value={(p.jumlah / maxPertanyaan) * 100} className="h-2" />
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">
            Belum ada data pertanyaan yang terhimpun.
          </p>
        )}
      </div>
    </>
  );
}
