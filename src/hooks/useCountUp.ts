import { useEffect, useRef, useState } from "react";

const DEFAULT_DURATION_MS = 1800;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

type UseCountUpOptions = {
  /** The animation only starts once this becomes `true` (e.g. scroll-into-view). */
  startWhen?: boolean;
  duration?: number;
};

/** Counts from 0 to `target` with ease-out easing, once per instance — respects prefers-reduced-motion. */
export function useCountUp(target: number, options?: UseCountUpOptions) {
  const { startWhen = true, duration = DEFAULT_DURATION_MS } = options ?? {};
  const [value, setValue] = useState(0);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (!startWhen || hasRunRef.current) return;
    hasRunRef.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }

    let rafId: number;
    const startTime = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      setValue(Math.round(easeOutCubic(progress) * target));
      if (progress < 1) rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [startWhen, target, duration]);

  return value;
}
