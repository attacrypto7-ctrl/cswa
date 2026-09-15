import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { Home } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { getGoogleUser, GoogleUser } from "@/lib/google-auth";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

interface ShellProps {
  title: string;
  subtitle: string;
  items: NavItem[];
  footer?: ReactNode;
  onLogout?: () => void;
  onBackToHome?: () => void;
}

export function DashboardShell({
  title,
  subtitle,
  items,
  footer,
  onLogout,
  onBackToHome,
}: ShellProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);

  useEffect(() => {
    const user = getGoogleUser();
    if (user) setGoogleUser(user);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 md:flex">
        {googleUser ? (
          <div className="mb-8 flex cursor-pointer items-center gap-3 px-2 transition-opacity hover:opacity-80">
            <div className="relative">
              <img
                src={googleUser.picture}
                alt="Google Profile"
                className="size-9 rounded-xl object-cover border border-emerald-500/30"
              />
              <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 border-2 border-background" />
            </div>
            <span className="leading-tight">
              <span className="block text-sm font-semibold text-sidebar-foreground">{googleUser.name}</span>
              <span className="block text-xs text-muted-foreground truncate max-w-[130px]">
                {googleUser.email}
              </span>
            </span>
          </div>
        ) : (
          <div className="mb-8 h-[52px]" />
        )}

        <nav className="flex flex-1 flex-col gap-1">
          {items.map((item) => {
            const active =
              pathname === item.to ||
              (item.to !== "/admin" && item.to !== "/app" && pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className={cn("size-4", active && "text-primary")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-2.5 pt-4">
          <Link
            to="/"
            onClick={onBackToHome}
            className="group flex w-full items-center justify-between rounded-xl border border-sky-500/30 bg-sky-950/30 px-3 py-2.5 text-xs font-semibold text-sky-200 transition-all duration-300 hover:translate-y-[-2px] hover:border-sky-400/80 hover:bg-sky-900/40 hover:shadow-[0_0_18px_rgba(56,189,248,0.35)]"
          >
            <span className="flex items-center gap-2.5">
              <Home className="size-4 text-sky-400 transition-transform duration-300 ease-out group-hover:-translate-x-1" />
              <span>Kembali ke beranda</span>
            </span>
            <span className="text-sky-400/60 transition-transform duration-300 ease-out group-hover:-translate-x-1">
              ←
            </span>
          </Link>

          {footer ? <div className="border-t border-sidebar-border pt-2.5">{footer}</div> : null}
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="flex gap-1 overflow-x-auto border-b border-border bg-sidebar px-3 py-2 md:hidden">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground"
              activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
            >
              <item.icon className="size-3.5" />
              {item.label}
            </Link>
          ))}
        </div>
        <main className="surface-grid min-h-screen px-5 py-8 md:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-foreground md:text-3xl">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </header>
  );
}
