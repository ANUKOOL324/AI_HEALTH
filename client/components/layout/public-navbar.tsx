"use client";

import { useEffect, useState } from "react";
import { HeartPulse, LayoutDashboard, LogOut, Menu, Stethoscope, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks";
import { EmergencyLauncher } from "@/components/emergency/emergency-launcher";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { GlobalSearch } from "@/components/search/global-search";

interface NavLink { href: string; label: string }

const publicLinks: NavLink[] = [
  { href: "#platform-overview", label: "Platform" },
  { href: "/hospitals", label: "Hospitals" },
  { href: "/map", label: "Map" },
];

const guestLinks: NavLink[] = [
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
];

const patientAuthLinks: NavLink[] = [
  { href: "/patient/feed", label: "My Feed" },
];

const hospitalAuthLinks: NavLink[] = [
  { href: "/hospital", label: "Dashboard" },
];

export function PublicNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, isHydrated, logout, user } = useAuth();

  const authLinks = user?.role === "patient" ? patientAuthLinks : hospitalAuthLinks;
  const navLinks = [...publicLinks, ...(isHydrated && isAuthenticated ? authLinks : guestLinks)];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 18);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
      <div
        className={cn(
          "mx-auto max-w-7xl rounded-[28px] border transition-all duration-300",
          isScrolled
            ? "border-[rgba(16,35,27,0.08)] bg-[rgba(255,255,255,0.96)] shadow-[0_18px_40px_rgba(16,35,27,0.08)] backdrop-blur-xl"
            : "border-transparent bg-white/72 backdrop-blur-md",
        )}
      >
        <div className="flex flex-wrap items-center gap-4 px-6 py-4 sm:px-8 lg:px-10">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--foreground)] text-white shadow-lg">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight text-[var(--foreground)]">CareBridge AI</p>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Hospital coordination</p>
            </div>
          </a>

          <div className="order-3 w-full lg:order-none lg:flex-1 lg:px-4">
            <GlobalSearch />
          </div>

          <nav className="hidden items-center gap-7 xl:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <EmergencyLauncher compact />
            <NotificationBell />

            {isHydrated && isAuthenticated ? (
              <div className="hidden items-center gap-2 md:flex">
                <a
                  href={user?.role === "patient" ? "/patient/feed" : "/hospital"}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--primary)]"
                >
                  <LayoutDashboard className="h-4 w-4 text-[var(--primary)]" />
                  {user?.role === "patient" ? "My Feed" : "Dashboard"}
                </a>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-red-400 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <a
                href="/login"
                className="hidden items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--primary)] md:inline-flex"
              >
                <Stethoscope className="h-4 w-4 text-[var(--primary)]" />
                Sign in
              </a>
            )}

            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className="inline-flex rounded-2xl border border-[var(--border)] bg-white p-2 text-[var(--foreground)] md:hidden"
              aria-label="Toggle navigation"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen ? (
          <div className="border-t border-[var(--border)] px-6 py-4 md:hidden">
            <div className="mb-4">
              <GlobalSearch compact />
            </div>
            <div className="mb-4">
              <EmergencyLauncher compact />
            </div>
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-2xl px-3 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-[rgba(16,35,27,0.04)] hover:text-[var(--foreground)]"
                >
                  {link.label}
                </a>
              ))}
              {isHydrated && isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => { setIsMenuOpen(false); logout(); }}
                  className="rounded-2xl px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-[rgba(16,35,27,0.04)]"
                >
                  Logout
                </button>
              ) : null}
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
