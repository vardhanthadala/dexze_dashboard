"use client";

import { Briefcase, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  onLogout: () => void;
}

export default function Sidebar({
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-black border-r border-zinc-900 flex flex-col justify-between px-6 py-8">

      {/* Top */}
      <div>

        {/* Logo */}
        <div className="mb-14 flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Dexze Logo"
            width={140}
            height={50}
            priority
            className="object-contain"
            style={{ height: "auto" }}
          />
        </div>

        {/* Navigation */}
        <nav>
          <Link
            href="/admin/dashboard"
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-300 ${
              pathname === "/admin/dashboard"
                ? "bg-white text-black border-white"
                : "bg-zinc-950 border-zinc-900 text-zinc-400 hover:bg-zinc-900 hover:text-white"
            }`}
          >
            <Briefcase className="w-5 h-5" />

            <span className="font-medium text-[15px]">
              Works
            </span>
          </Link>
        </nav>

      </div>

      {/* Bottom */}
      <div className="border-t border-zinc-900 pt-6">

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-zinc-950 border border-zinc-900 text-zinc-400 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />

          <span className="font-medium text-[15px]">
            Logout
          </span>
        </button>

      </div>
    </aside>
  );
}