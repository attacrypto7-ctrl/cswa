import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Bot, Coins, MessagesSquare, ShieldQuestion } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader } from "@/components/dashboard/shell";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatNumber, getAnalytics } from "@/mock/api";

export const Route = createFileRoute("/app/analitik")({
  head: () => ({
    meta: [
      { title: "Analitik — Dashboard Balasin" },
      { name: "description", content: "Volume chat harian, pemakaian token, dan pertanyaan pelanggan teratas untuk melengkapi FAQ." },
      { property: "og:title", content: "Analitik — Dashboard Balasin" },
      { property: "og:description", content: "Volume chat, pemakaian token, dan pertanyaan teratas." },
    ],
  }),
  component: AnalyticsPage,
});

const chatConfig = {
  chat: { label: "Chat masuk", color: "var(--chart-1)" },
  gagal: { label: "Tidak terjawab", color: "var(--chart-5)" },
} satisfies ChartConfig;

const tokenConfig = {
  token: { label: "Token (juta)", color: "var(--chart-2)" },
} satisfies ChartConfig;

function AnalyticsPage() {
  const { data } = useQuery({ queryKey: ["analytics"], queryFn: getAnalytics });
  const chatHarian = data?.chatHarian ?? [];
  const pemakaianToken = data?.pemakaianToken ?? [];
  const pertanyaanTeratas = data?.pertanyaanTeratas ?? [];

  const totalChat = chatHarian.reduce((a, d) => a + d.chat, 0);
  const totalGagal = chatHarian.reduce((a, d) => a + d.gagal, 0);
  const tingkatJawab = totalChat ? Math.round(((totalChat - totalGagal) / totalChat) * 100) : 0;
  const tokenBulanIni = pemakaianToken.at(-1)?.token ?? 0;
  const maxPertanyaan = Math.max(1, ...pertanyaanTeratas.map((p) => p.jumlah));

  return (
    <>
      <PageHeader
        title="Analitik"
        description="Pahami beban chat dan celah pengetahuan agar bot makin jarang salah jawab."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Chat 7 hari" value={formatNumber(totalChat)} icon={MessagesSquare} hint="Chat + Iklan" />
        <StatCard label="Tingkat terjawab" value={`${tingkatJawab}%`} icon={Bot} tone="success" />
        <StatCard
          label="Tidak terjawab"
          value={formatNumber(totalGagal)}
          icon={ShieldQuestion}
          tone="warning"
          hint="Perlu dilengkapi FAQ"
        />
        <StatCard label="Token bulan ini" value={`${tokenBulanIni} jt`} icon={Coins} hint="Estimasi pemakaian" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="panel p-5">
          <h2 className="text-sm font-semibold">Chat masuk per hari</h2>
          <p className="text-xs text-muted-foreground">Minggu ini, dipisah antara terjawab dan tidak.</p>
          <ChartContainer config={chatConfig} className="mt-4 h-64 w-full">
            <BarChart data={chatHarian} accessibilityLayer>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="hari" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="chat" fill="var(--color-chat)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="gagal" fill="var(--color-gagal)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </section>

        <section className="panel p-5">
          <h2 className="text-sm font-semibold">Pemakaian token</h2>
          <p className="text-xs text-muted-foreground">Dalam juta token, 6 bulan terakhir.</p>
          <ChartContainer config={tokenConfig} className="mt-4 h-64 w-full">
            <AreaChart data={pemakaianToken} accessibilityLayer>
              <defs>
                <linearGradient id="fillToken" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-token)" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="var(--color-token)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="bulan" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} width={32} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                dataKey="token"
                type="monotone"
                stroke="var(--color-token)"
                fill="url(#fillToken)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </section>
      </div>

      <section className="panel mt-6 p-5">
        <h2 className="text-sm font-semibold">Pertanyaan pelanggan teratas</h2>
        <p className="text-xs text-muted-foreground">
          Pastikan pertanyaan ini punya jawaban yang jelas di basis pengetahuan.
        </p>
        <ul className="mt-4 space-y-3">
          {pertanyaanTeratas.map((p, i) => (
            <li key={p.pertanyaan} className="flex items-center gap-4">
              <span className="w-5 text-sm font-semibold text-muted-foreground">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm">{p.pertanyaan}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatNumber(p.jumlah)}x
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(p.jumlah / maxPertanyaan) * 100}%` }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
