import { Link, createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  FlaskConical,
  KeyRound,
  LayoutDashboard,
  Library,
  MessageSquare,
  MessagesSquare,
  Megaphone,
  Smartphone,
} from "lucide-react";

import { DashboardShell, type NavItem } from "@/components/dashboard/shell";

const items: NavItem[] = [
  { to: "/app", label: "Ringkasan", icon: LayoutDashboard },
  { to: "/app/whatsapp", label: "Koneksi WhatsApp", icon: Smartphone },
  { to: "/app/pengetahuan", label: "Basis Pengetahuan", icon: Library },
  { to: "/app/balas-chat", label: "Balas Chat Otomatis", icon: MessageSquare },
  { to: "/app/balas-iklan", label: "Balas Iklan Otomatis", icon: Megaphone },
  { to: "/app/percakapan", label: "Riwayat Chat", icon: MessagesSquare },
  { to: "/app/uji-coba", label: "Uji Coba Bot", icon: FlaskConical },
  { to: "/app/analitik", label: "Analitik", icon: BarChart3 },
  { to: "/app/lisensi", label: "Lisensi", icon: KeyRound },
];

export const Route = createFileRoute("/app")({
  component: TenantLayout,
});

function TenantLayout() {
  return (
    <DashboardShell
      title="Toko Bunga Melati"
      subtitle="Dashboard tenant"
      items={items}
      footer={
        <Link to="/admin" className="text-xs text-muted-foreground hover:text-foreground">
          Beralih ke dashboard admin →
        </Link>
      }
    />
  );
}
