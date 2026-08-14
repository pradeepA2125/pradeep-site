import { useEffect, useRef, useState } from "react";

/**
 * Marks the one item a visitor should notice as it arrives in the lower half
 * of the viewport. Unlike a scroll-progress value, this stays true once it
 * has fired: attention is guided forward, never taken away again.
 */
export function useFocusArrival<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      setFocused(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFocused(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -30% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, focused };
}
