import { Link, createFileRoute } from "@tanstack/react-router";
import { Building2, KeyRound, LayoutDashboard, ScrollText } from "lucide-react";
import { logout } from "@/lib/api-client";

import { DashboardShell, type NavItem } from "@/components/dashboard/shell";

const items: NavItem[] = [
  { to: "/admin", label: "Ringkasan", icon: LayoutDashboard },
  { to: "/admin/tenants", label: "Tenant", icon: Building2 },
  { to: "/admin/licenses", label: "Lisensi", icon: KeyRound },
  { to: "/admin/audit", label: "Catatan Aktivitas", icon: ScrollText },
];

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <DashboardShell
      title="Balasin Admin"
      subtitle="Panel platform"
      items={items}
      footer={
        <button onClick={() => logout()} className="text-xs text-muted-foreground hover:text-foreground">
          Keluar →
        </button>
      }
    />
  );
}
