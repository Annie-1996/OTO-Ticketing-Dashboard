import { Menu } from "lucide-react";
import { useLocation } from "@tanstack/react-router";
import { eventInfo } from "@/lib/mock-data";

export function Header({ onOpenMobile }: { onOpenMobile: () => void }) {
  const { pathname } = useLocation();
  const platformLabel = pathname === "/marketing" ? "Google Analytics 4" : eventInfo.platform;

  const updated = eventInfo.lastUpdated.toLocaleString("zh-TW", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="h-14 flex items-center gap-3 px-4 md:px-6 border-b border-border bg-card">
      <button
        onClick={onOpenMobile}
        className="md:hidden p-1.5 rounded hover:bg-muted"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="h-8 w-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">
        OT
      </div>
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className="text-xs text-muted-foreground hidden sm:inline">{platformLabel}</span>
        <span className="text-muted-foreground hidden sm:inline">·</span>
        <span className="text-sm font-medium truncate">{eventInfo.eventName}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
        </span>
        <span className="hidden sm:inline">即時</span>
        <span className="hidden md:inline">· 更新於 {updated}</span>
      </div>
    </header>
  );
}
