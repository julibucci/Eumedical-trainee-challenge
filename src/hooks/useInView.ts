import { useEffect, useRef, useState } from "react";

/** Detects when an element enters the viewport, only once (stays `true` forever). */
export function useInView<T extends Element>(threshold = 0.35) {
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (isInView) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isInView, threshold]);

  return { ref, isInView } as const;
}
