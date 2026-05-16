import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MagicAI — AI tools for creators",
  description:
    "Generate images, video, code, speech, and more with one AI-powered workspace.",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="landing-root min-h-screen bg-[#080c14] text-white">
      {children}
    </div>
  );
}
