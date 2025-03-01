'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BorderBeamProps {
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  transition?: any;
  className?: string;
  style?: React.CSSProperties;
  reverse?: boolean;
  initialOffset?: number;
}

export const BorderBeam = ({
  className,
  size = 20, // Made beam thinner
  delay = 0,
  duration = 6,
  colorFrom = '#ffdd55',
  colorTo = '#8855ff',
  transition,
  style,
  reverse = false,
  initialOffset = 20,
}: BorderBeamProps) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full border border-gray-0">
      <motion.div
        className={cn(
          'absolute aspect-square blur-sm', // Added blur effect
          'bg-gradient-to-l from-[var(--color-from)] via-transparent to-[var(--color-to)] opacity-75',
          className
        )}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          '--color-from': colorFrom,
          '--color-to': colorTo,
          filter: 'blur(1px)', // Soft blur for a glow effect
          ...style,
        } as any}
        initial={{ offsetDistance: `${initialOffset}%` }}
        animate={{
          offsetDistance: reverse
            ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
            : [`${initialOffset}%`, `${100 + initialOffset}%`],
        }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration,
          delay: -delay,
          ...transition,
        }}
      />
    </div>
  );
};
