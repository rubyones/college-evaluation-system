import React, { useEffect, useState } from 'react';
import { useAnimatedCounter, usePrefersReducedMotion } from '@/hooks';

interface AnimatedCounterProps {
  endValue: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

export function AnimatedCounter({
  endValue,
  duration = 1000,
  suffix = '',
  prefix = '',
  decimals = 0,
}: AnimatedCounterProps) {
  const shouldReduce = usePrefersReducedMotion();
  const count = useAnimatedCounter(endValue, duration, shouldReduce);

  const formattedCount = count.toFixed(decimals);

  return (
    <span>
      {prefix}
      {formattedCount}
      {suffix}
    </span>
  );
}
