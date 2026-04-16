"use client";

import { useAuth } from "@/hooks";
import { EmergencyLauncher } from "@/components/emergency/emergency-launcher";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { GlobalSearch } from "@/components/search/global-search";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function PatientTopbar() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
          {getGreeting()}, {firstName}
        </p>
        <h1 className="mt-0.5 text-xl font-bold text-[var(--foreground)]">Your Health Feed</h1>
        <p className="mt-0.5 text-sm text-[var(--muted)]">
          Stay updated with health issues, hospital alerts, and community requests.
        </p>
      </div>

      <div className="flex flex-shrink-0 items-center gap-2">
        <div className="w-56 hidden sm:block">
          <GlobalSearch compact />
        </div>
        <EmergencyLauncher compact />
        <NotificationBell />
      </div>
    </div>
  );
}
