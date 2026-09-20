import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { geoDistance, geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import worldTopology from "world-atlas/countries-110m.json";
import type { GlobeMarker } from "../../types/globeMarker";

const topology = worldTopology as unknown as Topology<{ countries: GeometryCollection; land: GeometryCollection }>;
/** Computed once on module load, not per instance nor per render. */
const countries = feature(topology, topology.objects.countries).features;

const INITIAL_ROTATION: [number, number, number] = [-15, -25, 0];
const AUTO_ROTATE_DEG_PER_SEC = 6;
const RESUME_AUTO_ROTATE_DELAY_MS = 3000;
const DRAG_SENSITIVITY = 0.28;
const MAX_PITCH = 80;

type InteractiveGlobeProps = {
  markers: GlobeMarker[];
  /** Diameter in px. */
  size?: number;
  /** false = static view, no drag/autorotate/pulse (useful for validating the palette). */
  interactive?: boolean;
  className?: string;
};

/**
 * Orthographic-projection globe, pure SVG, with real borders (Natural Earth 110m
 * via world-atlas + topojson-client). Rewrites each country's `d` directly in the DOM on
 * every frame (bypassing React's re-render) so that drag and autorotate do not
 * recompute the ~177 countries as JSX elements on every frame — only their path strings
 * are recomputed, written by hand into the already-mounted nodes.
 */
export function InteractiveGlobe({ markers, size = 320, interactive = true, className = "" }: InteractiveGlobeProps) {
  const [hoveredCountryId, setHoveredCountryId] = useState<string | null>(null);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const pathRefs = useRef(new Map<string, SVGPathElement>());
  const markerRefs = useRef(new Map<string, SVGGElement>());
  const rotationRef = useRef<[number, number, number]>(INITIAL_ROTATION);
  const dragStartRef = useRef<{ x: number; y: number; rotation: [number, number, number] } | null>(null);
  const autoRotateEnabledRef = useRef(true);
  const resumeTimeoutRef = useRef<number | undefined>(undefined);
  const rafRef = useRef<number | undefined>(undefined);
  const lastFrameTimeRef = useRef<number | undefined>(undefined);

  const { projection, pathGenerator, sphereD } = useMemo(() => {
    const projection = geoOrthographic()
      .scale(size / 2 - 6)
      .translate([size / 2, size / 2])
      .clipAngle(90)
      .rotate(INITIAL_ROTATION);
    const pathGenerator = geoPath(projection);
    return { projection, pathGenerator, sphereD: pathGenerator({ type: "Sphere" }) ?? "" };
  }, [size]);

  function projectMarker(marker: GlobeMarker) {
    const coord: [number, number] = [marker.lon, marker.lat];
    const center: [number, number] = [-rotationRef.current[0], -rotationRef.current[1]];
    const isVisible = geoDistance(coord, center) < Math.PI / 2;
    const projected = projection(coord);
    return { isVisible, x: projected?.[0] ?? 0, y: projected?.[1] ?? 0 };
  }

  function applyRotation(nextRotation: [number, number, number]) {
    rotationRef.current = nextRotation;
    projection.rotate(nextRotation);

    for (const countryFeature of countries) {
      const el = pathRefs.current.get(String(countryFeature.id));
      if (el) el.setAttribute("d", pathGenerator(countryFeature) ?? "");
    }

    for (const marker of markers) {
      const el = markerRefs.current.get(marker.id);
      if (!el) continue;
      const { isVisible, x, y } = projectMarker(marker);
      el.setAttribute("transform", `translate(${x}, ${y})`);
      el.style.opacity = isVisible ? "1" : "0";
      el.style.pointerEvents = isVisible ? "auto" : "none";
    }
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    function handleChange(event: MediaQueryListEvent) {
      setPrefersReducedMotion(event.matches);
    }
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Autorotate: requestAnimationFrame, not setInterval — it only stops while dragging or with reduced-motion.
  useEffect(() => {
    if (!interactive || prefersReducedMotion) return;

    function tick(timestamp: number) {
      if (autoRotateEnabledRef.current && !dragStartRef.current) {
        const last = lastFrameTimeRef.current ?? timestamp;
        const deltaSeconds = (timestamp - last) / 1000;
        const [yaw, pitch, roll] = rotationRef.current;
        applyRotation([yaw + AUTO_ROTATE_DEG_PER_SEC * deltaSeconds, pitch, roll]);
      }
      lastFrameTimeRef.current = timestamp;
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
      lastFrameTimeRef.current = undefined;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- applyRotation closes over projection/pathGenerator (stable) and markers (does not change in real use)
  }, [interactive, prefersReducedMotion, projection, pathGenerator]);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current !== undefined) window.clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  function handlePointerDown(event: ReactPointerEvent<SVGSVGElement>) {
    if (!interactive) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = { x: event.clientX, y: event.clientY, rotation: rotationRef.current };
    autoRotateEnabledRef.current = false;
    if (resumeTimeoutRef.current !== undefined) window.clearTimeout(resumeTimeoutRef.current);
  }

  function handlePointerMove(event: ReactPointerEvent<SVGSVGElement>) {
    const start = dragStartRef.current;
    if (!start) return;
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    const nextYaw = start.rotation[0] + deltaX * DRAG_SENSITIVITY;
    const nextPitch = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, start.rotation[1] - deltaY * DRAG_SENSITIVITY));
    applyRotation([nextYaw, nextPitch, start.rotation[2]]);
  }

  function handlePointerUp(event: ReactPointerEvent<SVGSVGElement>) {
    if (!dragStartRef.current) return;
    dragStartRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    if (!prefersReducedMotion) {
      resumeTimeoutRef.current = window.setTimeout(() => {
        autoRotateEnabledRef.current = true;
      }, RESUME_AUTO_ROTATE_DELAY_MS);
    }
  }

  const hoveredMarker = hoveredMarkerId ? markers.find((marker) => marker.id === hoveredMarkerId) : undefined;
  const hoveredMarkerPosition = hoveredMarker ? projectMarker(hoveredMarker) : null;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute rounded-full"
        style={{
          inset: "-12%",
          background: "radial-gradient(circle, rgba(217,228,222,0) 60%, rgba(217,228,222,0.35) 78%, rgba(217,228,222,0) 92%)",
        }}
      />

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="Mapa interactivo de cobertura global de eumedical"
        className={interactive ? "touch-none cursor-grab active:cursor-grabbing" : ""}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <defs>
          <radialGradient id="globe-ocean" cx="35%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#1e4865" />
            <stop offset="100%" stopColor="#122f42" />
          </radialGradient>
        </defs>

        <path d={sphereD} fill="url(#globe-ocean)" />

        {countries.map((countryFeature) => {
          const id = String(countryFeature.id);
          return (
            <path
              key={id}
              ref={(el) => {
                if (el) pathRefs.current.set(id, el);
                else pathRefs.current.delete(id);
              }}
              d={pathGenerator(countryFeature) ?? undefined}
              fill={hoveredCountryId === id ? "#e79f1a" : "#79b19c"}
              stroke="#163a52"
              strokeWidth={0.4}
              className="transition-colors duration-150"
              onMouseEnter={() => setHoveredCountryId(id)}
              onMouseLeave={() => setHoveredCountryId((current) => (current === id ? null : current))}
            >
              <title>{(countryFeature.properties as { name?: string } | null)?.name}</title>
            </path>
          );
        })}

        <path d={sphereD} fill="none" stroke="#d9e4de" strokeWidth={1.5} opacity={0.5} />

        {markers.map((marker) => {
          const { isVisible, x, y } = projectMarker(marker);
          return (
            <g
              key={marker.id}
              ref={(el) => {
                if (el) markerRefs.current.set(marker.id, el);
                else markerRefs.current.delete(marker.id);
              }}
              transform={`translate(${x}, ${y})`}
              style={{ opacity: isVisible ? 1 : 0, pointerEvents: isVisible ? "auto" : "none" }}
              onMouseEnter={() => setHoveredMarkerId(marker.id)}
              onMouseLeave={() => setHoveredMarkerId((current) => (current === marker.id ? null : current))}
            >
              {interactive && !prefersReducedMotion && (
                <circle r={4} fill="#e79f1a" opacity={0.6}>
                  <animate attributeName="r" values="4;10;4" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              <circle r={4} fill="#e79f1a" stroke="#ffffff" strokeWidth={1} />
            </g>
          );
        })}
      </svg>

      {hoveredMarker && hoveredMarkerPosition?.isVisible && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-white px-2.5 py-1.5 text-xs font-bold text-brand-dark-blue shadow-md"
          style={{ left: hoveredMarkerPosition.x, top: hoveredMarkerPosition.y - 10 }}
        >
          {hoveredMarker.label}
        </div>
      )}
    </div>
  );
}
