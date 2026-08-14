import { useEffect, useRef, useState } from "react";
import type { DuskSceneHandle } from "../scene/duskScene";
import { subscribeScroll } from "../lib/scrollDriver";

/**
 * Mounts the WebGL dusk scene behind the hero copy.
 *
 * Loading discipline:
 * - The shader module is dynamically imported after first paint (idle
 *   callback), so it can never block LCP — the CSS/SVG poster below paints
 *   immediately and the canvas cross-fades in over it.
 * - prefers-reduced-motion: the module still loads but renders exactly one
 *   static frame — a poster, not an animation.
 * - The loop pauses when the hero scrolls offscreen and when the tab hides.
 * - No WebGL (or a shader compile failure) leaves the poster in place; the
 *   page never depends on the scene existing.
 *
 * The whole element is decorative (aria-hidden); everything meaningful in
 * the hero is real text on top of it.
 */
export default function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<DuskSceneHandle | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let visible = true;
    let reduced = false;
    let observer: IntersectionObserver | undefined;
    let unsubscribeScroll: (() => void) | undefined;

    const onVisibility = () => {
      const scene = sceneRef.current;
      if (!scene || reduced) return;
      if (document.hidden || !visible) scene.stop();
      else scene.start();
    };

    const boot = async () => {
      const { createDuskScene } = await import("../scene/duskScene");
      if (cancelled) return;

      // Coarse quality gate: few cores or a phone-sized viewport gets the
      // reduced-octave, reduced-resolution variant.
      const lowPower =
        (navigator.hardwareConcurrency ?? 8) <= 4 ||
        window.matchMedia("(max-width: 640px)").matches;

      const scene = createDuskScene(canvas, {
        quality: lowPower ? "low" : "high",
      });
      if (!scene) return; // poster stays
      if (cancelled) {
        scene.destroy();
        return;
      }
      sceneRef.current = scene;

      reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        scene.renderStill();
        setLive(true);
        return;
      }

      scene.start();
      setLive(true);

      // Scroll-linked descent: 0 with the hero fully in view → 1 once it has
      // scrolled past. The hero starts at the top of the page, so scrollY
      // over the hero height is the whole computation — one clientHeight
      // read against a clean layout (all scroll-frame writes on this page
      // are transforms/uniforms, so nothing dirties it mid-frame).
      // Skipped under reduced motion (the scene renders one still above).
      unsubscribeScroll = subscribeScroll((scrollY) => {
        scene.setScroll(scrollY / Math.max(canvas.clientHeight, 1));
      });

      document.addEventListener("visibilitychange", onVisibility);
      if (typeof IntersectionObserver !== "undefined") {
        observer = new IntersectionObserver(
          ([entry]) => {
            visible = entry.isIntersecting;
            onVisibility();
          },
          { threshold: 0.02 },
        );
        observer.observe(canvas);
      }
    };

    // Never compete with first paint for the main thread.
    const idle: number | ReturnType<typeof setTimeout> =
      "requestIdleCallback" in window
        ? window.requestIdleCallback(() => void boot(), { timeout: 1500 })
        : setTimeout(() => void boot(), 350);

    return () => {
      cancelled = true;
      if ("cancelIdleCallback" in window) {
        window.cancelIdleCallback(idle as number);
      } else {
        clearTimeout(idle as ReturnType<typeof setTimeout>);
      }
      document.removeEventListener("visibilitychange", onVisibility);
      observer?.disconnect();
      unsubscribeScroll?.();
      sceneRef.current?.destroy();
      sceneRef.current = null;
    };
  }, []);

  // Pointer parallax — fine pointers only; touch scrolling must never fight it.
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: PointerEvent) => {
      sceneRef.current?.setPointer(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1,
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {/* Poster: paints instantly, remains the reduced-capability fallback. */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="dusk-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#141225" />
            <stop offset="0.42" stopColor="#2a2140" />
            <stop offset="0.56" stopColor="#7a3a4e" />
            <stop offset="0.62" stopColor="#c2543a" />
            <stop offset="0.66" stopColor="#7a3a4e" />
            <stop offset="1" stopColor="#141225" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#dusk-sky)" />
        <path
          d="M0 60 L8 56 L17 59 L28 54 L40 58 L52 53 L65 57 L78 54 L90 58 L100 55 L100 100 L0 100 Z"
          fill="#231b38"
        />
        <path
          d="M0 68 L10 63 L22 67 L34 62 L48 67 L60 63 L74 68 L88 64 L100 67 L100 100 L0 100 Z"
          fill="#171228"
        />
        <path
          d="M0 80 L12 73 L26 79 L42 72 L58 78 L72 73 L86 79 L100 74 L100 100 L0 100 Z"
          fill="#0b0918"
        />
      </svg>
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${
          live ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
