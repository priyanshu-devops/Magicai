"use client";

import Link from "next/link";
import Image from "next/image";
import { Montserrat } from "next/font/google";

import {
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  VideoIcon,
  Music,
  Code,
  Settings,
  ImagePlay,
  Speech,
  Mic,
  ImageDown,
  ImagePlus,
  ScanEye,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { FreeCounter } from "./magicui/free-count";

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    color: "text-sky-500",
    href: "/dashboard",
  },
  {
    label: "Conversation",
    icon: MessageSquare,
    color: "text-violet-500",
    href: "/conversation",
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    color: "text-pink-700",
    href: "/image",
  },
  {
    label: "SmartSense",
    icon: ScanEye,
    color: "text-blue-700",
    bgColor: "bg-blue-700/10",
    href: "/smart",
  },
  {
    label: "Remove Background",
    icon: ImageDown,
    color: "text-blue-700",
    bgColor: "bg-blue-700/10",
    href: "/bgremove",
  },
  {
    label: "Upscale Image",
    icon: ImagePlus,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    href: "/upscale",
  },
  {
    label: "Image2Video Generation",
    icon: ImagePlay,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    href: "/i2v",
  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    color: "text-orange-400",
    href: "/video",
  },
  {
    label: "Music Generation",
    icon: Music,
    color: "text-emerald-500",
    href: "/music",
  },
  {
    label: "Code Generation",
    icon: Code,
    color: "text-green-400",
    href: "/code",
  },
  {
    label: "Text2Speech Generation",
    icon: Speech,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    href: "/t2s",
  },
  {
    label: "Speech2Text Generation",
    icon: Mic,
    color: "text-blue-700",
    bgColor: "bg-blue-700/10",
    href: "/s2t",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
  
];

interface SidebarProps {
  apiLimitCount: number;
  isPro: boolean;
}

const Sidebar = ({ apiLimitCount = 0, isPro = false }: SidebarProps) => {
  const pathname = usePathname();
  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1 overflow-hidden">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative h-8 w-8 mr-4">
            <Image fill alt="Logo" src="/logo.png" />
          </div>
          <h1 className={cn("text-2xl font-bold", montserrat.className)}>
            Magic-AI
          </h1>
        </Link>
        <div className="space-y-1 h-full overflow-y-auto scrollbar-hide">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href
                  ? "text-white bg-white/10"
                  : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default Sidebar;
