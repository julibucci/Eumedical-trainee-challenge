import { useEffect, useRef, useState, type TouchEvent } from "react";
import { ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react";
import { AVERAGE_RATING, testimonials } from "../../mocks/testimonials";
import { content } from "../../i18n/content";
import { useLanguageStore } from "../../store/languageStore";

const AUTOPLAY_MS = 4500;
const TRANSITION_MS = 500;
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
 * Carrusel de testimonios con autoplay en loop infinito (técnica de triple copia del
 * array: se translada libremente y, al cruzar el límite de la copia central, se hace
 * un salto instantáneo sin transición para volver a esa copia — así el loop es
 * indistinguible de uno "real" sin necesidad de una librería externa).
 */
export function TestimonialsCarousel() {
  const language = useLanguageStore((state) => state.language);
  const t = content[language].testimonialsCarousel;
  const length = testimonials.length;
  const loopedTestimonials = [...testimonials, ...testimonials, ...testimonials];
  const baseIndex = length;

  const [itemsPerView, setItemsPerView] = useState(getItemsPerView);
  const [position, setPosition] = useState(baseIndex);
  const [isInstant, setIsInstant] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const touchStartX = useRef<number | null>(null);

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

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;
    const intervalId = window.setInterval(() => setPosition((current) => current + 1), AUTOPLAY_MS);
    return () => window.clearInterval(intervalId);
  }, [isPaused, prefersReducedMotion]);

  useEffect(() => {
    if (!isInstant) return;
    const raf = requestAnimationFrame(() => setIsInstant(false));
    return () => cancelAnimationFrame(raf);
  }, [isInstant]);

  function handleTransitionEnd() {
    if (position >= baseIndex + length) {
      setIsInstant(true);
      setPosition(position - length);
    } else if (position < baseIndex) {
      setIsInstant(true);
      setPosition(position + length);
    }
  }

  function goNext() {
    setPosition((current) => current + 1);
  }

  function goPrev() {
    setPosition((current) => current - 1);
  }

  function handleTouchStart(event: TouchEvent) {
    touchStartX.current = event.touches[0].clientX;
  }

  function handleTouchEnd(event: TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (delta > SWIPE_THRESHOLD_PX) goPrev();
    else if (delta < -SWIPE_THRESHOLD_PX) goNext();
    touchStartX.current = null;
  }

  return (
    <section className="bg-white px-6 py-20 sm:py-24">
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
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          <div
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            role="region"
            aria-label={t.regionAria}
          >
            <div
              onTransitionEnd={handleTransitionEnd}
              className="flex"
              style={{
                transform: `translateX(-${position * (100 / itemsPerView)}%)`,
                transition: isInstant ? "none" : `transform ${TRANSITION_MS}ms ease`,
              }}
            >
              {loopedTestimonials.map((testimonial, index) => {
                const testimonialText = t.items[testimonial.id];
                return (
                  <div
                    key={`${testimonial.id}-${index}`}
                    className="shrink-0 px-3"
                    style={{ width: `${100 / itemsPerView}%` }}
                    aria-hidden={index < position || index >= position + itemsPerView}
                  >
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
            onClick={goPrev}
            aria-label={t.prevAria}
            className="absolute left-0 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-brand-dark-blue opacity-0 shadow-md transition-opacity hover:bg-white group-hover:opacity-100"
          >
            <ChevronLeft aria-hidden="true" size={20} strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={goNext}
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
