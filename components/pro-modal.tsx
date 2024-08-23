import { Code, ImageIcon, VideoIcon, Music, MessageSquare, ImageDown, ImagePlus, ImagePlay, Speech, Mic, Check, Zap } from "lucide-react";
import { useProModal } from "@/hooks/use-pro-modal";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";

const tools = [
  { label: "Conversation", icon: MessageSquare, color: "text-violet-500", href: "/conversation" },
  { label: "Image Generation", icon: ImageIcon, color: "text-pink-700", href: "/image" },
  { label: "Remove Background", icon: ImageDown, color: "text-blue-700", bgColor: "bg-blue-700/10", href: "/bgremove" },
  { label: "Upscale Image", icon: ImagePlus, color: "text-red-500", bgColor: "bg-red-500/10", href: "/upscale" },
  { label: "Image2Video Generation", icon: ImagePlay, color: "text-emerald-400", bgColor: "bg-emerald-400/10", href: "/i2v" },
  { label: "Video Generation", icon: VideoIcon, color: "text-orange-400", href: "/video" },
  { label: "Music Generation", icon: Music, color: "text-emerald-500", href: "/music" },
  { label: "Code Generation", icon: Code, color: "text-green-400", href: "/code" },
  { label: "Text2Speech Generation", icon: Speech, color: "text-purple-500", bgColor: "bg-purple-500/10", href: "/t2s" },
  { label: "Speech2Text Generation", icon: Mic, color: "text-blue-700", bgColor: "bg-blue-700/10", href: "/s2t" },
];

export const ProModal = () => {
  const proModal = useProModal();
  const [loading, setLoading] = useState(false);

  const onSubscribe = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/checkout");
      window.location.href = response.data.url;
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
            <div className="flex items-center gap-x-2 font-bold text-xl">
              Upgrade to MagicAI
              <Badge variant="premium" className="uppercase text-sm py-1">pro</Badge>
            </div>
          </DialogTitle>
          <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium h-64 overflow-y-auto scrollbar-hide">
            {tools.map((tool) => (
              <Card key={tool.label} className="p-3 border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-x-4">
                  <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                    <tool.icon className={cn("w-6 h-6", tool.color)} />
                  </div>
                  <div className="font-semibold text-sm">{tool.label}</div>
                </div>
                <Check className="text-primary w-5 h-5" />
              </Card>
            ))}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button disabled={loading} onClick={onSubscribe} size="lg" variant="premium" className="w-full">
            Upgrade
            <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
