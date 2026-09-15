import { useEffect, useRef, useState, type TouchEvent } from "react";
import { ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react";
import { AVERAGE_RATING, testimonials } from "../../mocks/testimonials";
import { content } from "../../i18n/content";
import { useLanguageStore } from "../../store/languageStore";

/** "Cards" por segundo — a este ritmo cada tarjeta tarda ~11s en pasar: lento y continuo, no un salto cada tanto. */
const AUTO_SCROLL_SPEED = 0.09;
const MANUAL_TRANSITION_MS = 500;
const RESUME_AUTO_SCROLL_DELAY_MS = 3000;
const SWIPE_THRESHOLD_PX = 40;

const VISIBLE_BREAKPOINTS = [
  { minWidth: 1024, count: 3 },
  { minWidth: 640, count: 2 },
  { minWidth: 0, count: 1 },
] as const;

function getItemsPerView() {
  if (typeof window === "undefined") return 1;
  const width = window.innerWidth;
  return VISIBLE_BREAKPOINTS.find((breakpoint) => width >= breakpoint.minWidth)?.count ?? 1;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={16}
          strokeWidth={1.5}
          fill={index < rating ? "currentColor" : "none"}
          className={index < rating ? "text-brand-orange" : "text-gray-300"}
        />
      ))}
    </div>
  );
}

/**
 * Carrusel de testimonios con desplazamiento automático continuo y lento (no saltos discretos):
 * la posición vive en un ref y se escribe directamente en el `transform` del track vía
 * requestAnimationFrame, sin pasar por React, para que la animación no dispare 60 re-renders
 * por segundo. El loop infinito usa una copia triple del array: al cruzar el límite de la copia
 * central se resta/suma el largo real sin transición — matemáticamente idéntico, invisible al ojo.
 */
export function TestimonialsCarousel() {
  const language = useLanguageStore((state) => state.language);
  const t = content[language].testimonialsCarousel;
  const length = testimonials.length;
  const loopedTestimonials = [...testimonials, ...testimonials, ...testimonials];
  const baseIndex = length;

  const [itemsPerView, setItemsPerView] = useState(getItemsPerView);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const trackRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(baseIndex);
  const itemsPerViewRef = useRef(itemsPerView);
  const prefersReducedMotionRef = useRef(prefersReducedMotion);
  const isHoveredRef = useRef(false);
  const isManualMoveRef = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const lastFrameTimeRef = useRef<number | undefined>(undefined);
  const resumeTimeoutRef = useRef<number | undefined>(undefined);

  function setTrackTransform(useTransition: boolean) {
    const el = trackRef.current;
    if (!el) return;
    el.style.transition = useTransition ? `transform ${MANUAL_TRANSITION_MS}ms ease` : "none";
    el.style.transform = `translateX(-${positionRef.current * (100 / itemsPerViewRef.current)}%)`;
  }

  useEffect(() => {
    itemsPerViewRef.current = itemsPerView;
    setTrackTransform(false);
  }, [itemsPerView]);

  useEffect(() => {
    prefersReducedMotionRef.current = prefersReducedMotion;
  }, [prefersReducedMotion]);

  useEffect(() => {
    function handleResize() {
      setItemsPerView(getItemsPerView());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    function handleChange(event: MediaQueryListEvent) {
      setPrefersReducedMotion(event.matches);
    }
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Loop persistente de autoplay continuo — no se reinicia por hover/reduced-motion, solo lee refs.
  useEffect(() => {
    function tick(timestamp: number) {
      const last = lastFrameTimeRef.current ?? timestamp;
      const deltaSeconds = (timestamp - last) / 1000;
      lastFrameTimeRef.current = timestamp;

      if (!isHoveredRef.current && !isManualMoveRef.current && !prefersReducedMotionRef.current) {
        positionRef.current += AUTO_SCROLL_SPEED * deltaSeconds;
        if (positionRef.current >= baseIndex + length) positionRef.current -= length;
        setTrackTransform(false);
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
      lastFrameTimeRef.current = undefined;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- el tick solo lee refs, no hace falta reiniciarlo por estado
  }, []);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current !== undefined) window.clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  function handleManualTransitionEnd() {
    if (positionRef.current >= baseIndex + length) {
      positionRef.current -= length;
      setTrackTransform(false);
    } else if (positionRef.current < baseIndex) {
      positionRef.current += length;
      setTrackTransform(false);
    }
    if (resumeTimeoutRef.current !== undefined) window.clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = window.setTimeout(() => {
      isManualMoveRef.current = false;
    }, RESUME_AUTO_SCROLL_DELAY_MS);
  }

  function manualMove(direction: 1 | -1) {
    isManualMoveRef.current = true;
    if (resumeTimeoutRef.current !== undefined) window.clearTimeout(resumeTimeoutRef.current);
    positionRef.current += direction;
    setTrackTransform(true);
  }

  function handleTouchStart(event: TouchEvent) {
    touchStartX.current = event.touches[0].clientX;
  }

  function handleTouchEnd(event: TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (delta > SWIPE_THRESHOLD_PX) manualMove(-1);
    else if (delta < -SWIPE_THRESHOLD_PX) manualMove(1);
    touchStartX.current = null;
  }

  return (
    <section className="bg-white px-6 pb-20 pt-8 sm:pb-24 sm:pt-10">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-brand-dark-blue sm:text-4xl">{t.title}</h2>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Stars rating={5} />
            <span className="font-display text-xl font-bold text-brand-dark-blue">{AVERAGE_RATING}/5</span>
          </div>
        </div>

        <div
          className="group relative mt-12"
          onMouseEnter={() => {
            isHoveredRef.current = true;
          }}
          onMouseLeave={() => {
            isHoveredRef.current = false;
          }}
          onFocus={() => {
            isHoveredRef.current = true;
          }}
          onBlur={() => {
            isHoveredRef.current = false;
          }}
        >
          <div
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            role="region"
            aria-label={t.regionAria}
          >
            <div
              ref={trackRef}
              onTransitionEnd={handleManualTransitionEnd}
              className="flex"
              style={{ transform: `translateX(-${positionRef.current * (100 / itemsPerView)}%)`, transition: "none" }}
            >
              {loopedTestimonials.map((testimonial, index) => {
                const testimonialText = t.items[testimonial.id];
                return (
                  <div key={`${testimonial.id}-${index}`} className="shrink-0 px-3" style={{ width: `${100 / itemsPerView}%` }}>
                    <div className="flex h-full flex-col gap-3 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                      <Stars rating={testimonial.rating} />
                      <p className="line-clamp-4 text-sm leading-relaxed text-gray-600">{testimonialText.text}</p>
                      <p className="mt-auto flex items-center gap-1.5 pt-2 text-xs font-bold uppercase tracking-wide text-brand-dark-blue/50">
                        <MapPin aria-hidden="true" size={13} strokeWidth={2} />
                        {testimonialText.location}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => manualMove(-1)}
            aria-label={t.prevAria}
            className="absolute left-0 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-brand-dark-blue opacity-0 shadow-md transition-opacity hover:bg-white group-hover:opacity-100"
          >
            <ChevronLeft aria-hidden="true" size={20} strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => manualMove(1)}
            aria-label={t.nextAria}
            className="absolute right-0 top-1/2 flex h-10 w-10 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-white/80 text-brand-dark-blue opacity-0 shadow-md transition-opacity hover:bg-white group-hover:opacity-100"
          >
            <ChevronRight aria-hidden="true" size={20} strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  );
}
