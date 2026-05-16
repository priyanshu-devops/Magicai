"use client";

import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Code,
  ImageDown,
  ImageIcon,
  ImagePlay,
  MessageSquare,
  Mic,
  ScanEye,
  Sparkles,
  Speech,
  VideoIcon,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MAX_FREE_COUNTS } from "@/constants";
import { cn } from "@/lib/utils";

type Feature = {
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  href: string;
};

const features: Feature[] = [
  {
    label: "Conversation",
    description: "Chat with Gemini-powered AI",
    icon: MessageSquare,
    color: "text-violet-400",
    bg: "bg-violet-500/15",
    href: "/conversation",
  },
  {
    label: "Image Generation",
    description: "Text to image with ClipDrop",
    icon: ImageIcon,
    color: "text-pink-400",
    bg: "bg-pink-500/15",
    href: "/image",
  },
  {
    label: "SmartSense",
    description: "Analyze images with AI vision",
    icon: ScanEye,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    href: "/smart",
  },
  {
    label: "Remove Background",
    description: "Clean cutouts in one click",
    icon: ImageDown,
    color: "text-sky-400",
    bg: "bg-sky-500/15",
    href: "/bgremove",
  },
  {
    label: "Image to Video",
    description: "Animate still images",
    icon: ImagePlay,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    href: "/i2v",
  },
  {
    label: "Video Generation",
    description: "Create clips from prompts",
    icon: VideoIcon,
    color: "text-orange-400",
    bg: "bg-orange-500/15",
    href: "/video",
  },
  {
    label: "Code Generation",
    description: "Build faster with AI code",
    icon: Code,
    color: "text-green-400",
    bg: "bg-green-500/15",
    href: "/code",
  },
  {
    label: "Text to Speech",
    description: "Natural voice from text",
    icon: Speech,
    color: "text-purple-400",
    bg: "bg-purple-500/15",
    href: "/t2s",
  },
  {
    label: "Speech to Text",
    description: "Live transcription",
    icon: Mic,
    color: "text-cyan-400",
    bg: "bg-cyan-500/15",
    href: "/s2t",
  },
];

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={feature.href}
        className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-violet-500/40 hover:bg-white/[0.06]"
      >
        <motion.div
          className={cn("mb-4 inline-flex rounded-xl p-3", feature.bg)}
          whileHover={{ scale: 1.05 }}
        >
          <Icon className={cn("h-6 w-6", feature.color)} />
        </motion.div>
        <h3 className="font-semibold text-white group-hover:text-violet-200">
          {feature.label}
        </h3>
        <p className="mt-1 text-sm text-zinc-500">{feature.description}</p>
      </Link>
    </motion.div>
  );
}

export function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-violet-600/30 blur-[120px]"
        animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.5, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-pink-600/20 blur-[100px]"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <motion.div className="relative h-9 w-9" whileHover={{ rotate: 8 }}>
            <Image src="/logo.png" alt="MagicAI" fill className="object-contain" />
          </motion.div>
          <span className="text-xl font-bold tracking-tight">Magic-AI</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
          <a href="#features" className="transition-colors hover:text-white">
            Features
          </a>
          <a href="#pricing" className="transition-colors hover:text-white">
            Pricing
          </a>
        </nav>
        <motion.div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" className="text-zinc-300 hover:text-white">
                Sign in
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="bg-violet-600 text-white hover:bg-violet-500">
                Get started
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Button asChild className="bg-violet-600 hover:bg-violet-500">
              <Link href="/dashboard">
                Open dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </SignedIn>
        </motion.div>
      </header>

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-10 text-center md:pt-16">
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-zinc-300"
        >
          <Sparkles className="h-4 w-4 text-violet-400" />
          All-in-one AI workspace
        </motion.div>
        <motion.h1
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl"
        >
          Create with{" "}
          <span className="bg-gradient-to-r from-pink-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
            MagicAI
          </span>
        </motion.h1>
        <motion.p
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 md:text-xl"
        >
          Images, video, code, voice, and chat in one dashboard. Sign in and start
          creating.
        </motion.p>
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <SignedOut>
            <SignUpButton mode="modal">
              <Button
                size="lg"
                className="h-12 border-0 bg-gradient-to-r from-violet-600 to-pink-600 px-8 text-white hover:from-violet-500 hover:to-pink-500"
              >
                Start free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </SignUpButton>
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-white/20 bg-white/5"
              asChild
            >
              <a href="#features">See features</a>
            </Button>
          </SignedOut>
          <SignedIn>
            <Button
              size="lg"
              className="h-12 bg-gradient-to-r from-violet-600 to-pink-600 px-8"
              asChild
            >
              <Link href="/dashboard">
                Go to dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </SignedIn>
        </motion.div>
      </section>

      <section id="features" className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-4 text-center text-3xl font-bold">Everything you need</h2>
        <p className="mb-12 text-center text-zinc-400">
          Nine AI tools, one place. Same routes as your app sidebar.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard key={feature.href} feature={feature} index={i} />
          ))}
        </div>
      </section>

      <section id="pricing" className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-950/80 to-pink-950/40 p-10 text-center md:p-14"
        >
          <Zap className="mx-auto mb-4 h-10 w-10 text-violet-400" />
          <h2 className="text-3xl font-bold">
            Start with {MAX_FREE_COUNTS} free generations
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-zinc-400">
            Sign up, open the dashboard, and try every tool.
          </p>
          <SignedOut>
            <SignUpButton mode="modal">
              <Button size="lg" className="mt-8 bg-white text-violet-950 hover:bg-zinc-100">
                Create free account
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Button size="lg" className="mt-8 bg-white text-violet-950" asChild>
              <Link href="/dashboard">Open dashboard</Link>
            </Button>
          </SignedIn>
        </motion.div>
      </section>

      <footer className="relative z-10 border-t border-white/10 py-10 text-center text-sm text-zinc-500">
        <p>&copy; {new Date().getFullYear()} MagicAI. Built for creators.</p>
        <div className="mt-4 flex justify-center gap-6">
          <Link href="/sign-in" className="transition-colors hover:text-white">
            Sign in
          </Link>
          <Link href="/sign-up" className="transition-colors hover:text-white">
            Sign up
          </Link>
        </div>
      </footer>
    </div>
  );
}
