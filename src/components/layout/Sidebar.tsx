import { Link, useLocation } from "@tanstack/react-router";
import { Ticket, Megaphone, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

const items = [
  { to: "/", label: "售票總覽", icon: Ticket },
  { to: "/marketing", label: "行銷總覽", icon: Megaphone },
] as const;

export function Sidebar({ collapsed, onToggleCollapsed, mobileOpen, onCloseMobile }: Props) {
  const { pathname } = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 md:hidden"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={cn(
          "fixed z-50 md:sticky md:top-0 md:h-screen inset-y-0 left-0 flex flex-col bg-sidebar border-r border-border transition-all duration-200",
          collapsed ? "md:w-16" : "md:w-56",
          "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="h-14 flex items-center justify-between px-3 border-b border-border">
          {!collapsed && (
            <span className="text-sm font-semibold tracking-tight">OTOTIX</span>
          )}
          <button
            onClick={onCloseMobile}
            className="md:hidden ml-auto p-1.5 rounded hover:bg-sidebar-accent"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            onClick={onToggleCollapsed}
            className="hidden md:inline-flex p-1.5 rounded hover:bg-sidebar-accent text-muted-foreground"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {items.map((it) => {
            const active = pathname === it.to;
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
                title={collapsed ? it.label : undefined}
              >
                <Icon className={cn("h-4 w-4 shrink-0", active && "text-accent")} />
                {!collapsed && <span>{it.label}</span>}
              </Link>
            );
          })}
        </nav>
        {!collapsed && (
          <div className="p-3 text-xs text-muted-foreground border-t border-border">
            v0.1 · Demo
          </div>
        )}
      </aside>
    </>
  );
}
