// components/magicui/confetti.tsx

import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import React from "react";

interface ConfettiButtonProps {
  options?: confetti.ConfettiParams;
  children: React.ReactNode;
}

export function ConfettiButton({ options, children }: ConfettiButtonProps) {
  const handleClick = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      angle: options?.angle ?? 90,
      ...options,
    });
  };

  return (
    <Button onClick={handleClick}>
      {children}
    </Button>
  );
}
