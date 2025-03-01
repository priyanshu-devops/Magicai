"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, Code, ImageDown, ImageIcon, ImagePlay,  ImagePlus,  MessageSquare, Mic, Music, Speech, VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const tools = [
  {
    label: "Conversation",
    icon: MessageSquare,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    href: "/conversation",
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    href: "/image",
  },
  {
    label: "Remove Background",
    icon: ImageDown,
    color: "text-blue-700",
    bgColor: "bg-blue-700/10",
    href: "/bgremove",
  },
  
  
  {
    label: "Video Generation",
    icon: VideoIcon,
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    href: "/video",
  },
  {
    label: "Code Generation",
    icon: Code,
    color: "text-green-400",
    bgColor: "bg-green-400/10",
    href: "/code",
  },
  {
    label: "Image2Video Generation",
    icon: ImagePlay,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    href: "/i2v",
  },
  {
    label: " Text2Speech Generation",
    icon: Speech,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    href: "/t2s",
  },
  {
    label: " Speech2Text Generation",
    icon: Mic,
    color: "text-blue-700",
    bgColor: "bg-blue-700/10",
    href: "/s2t",
  },
  
];

const DashboardPage = () => {
  const router = useRouter();
  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Expore the power of AI
        </h2>
        <p className="text-muted-foregroun font-light text-sm md:text-lg text-center">
          Chat with the smartest AI -Experience the power of AI
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {tools.map((tool) => (
          <Card
            onClick={() => router.push(tool.href)}
            key={tool.href}
            className="p-4 border-black.5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center gap-x-4">
              <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                <tool.icon className={cn("w-8 h-8", tool.color)} />
              </div>
              <div className="font-semibold">{tool.label}</div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;