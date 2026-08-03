"use client";

import { useEffect, useRef } from "react";
import Bend, { supportsHtmlInCanvas } from "./CanvasBend";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function lerp(current, target, amount) {
  return current + (target - current) * amount;
}

export default function BendViewport({ children }) {
  const scopeRef = useRef(null);

  useEffect(() => {
    const scope = scopeRef.current;
    const frame = scope?.querySelector(".bend-scroll-frame");
    if (!frame) return undefined;

    if (supportsHtmlInCanvas()) {
      frame.dataset.bendMode = "native";
      return undefined;
    }

    const scroller = Array.from(frame.children).find(
      (child) => child.tagName === "DIV",
    );
    if (!scroller) return undefined;

    frame.dataset.bendMode = "fallback";
    frame.classList.add("bend-fallback-ready");

    let panels = Array.from(scroller.querySelectorAll(".bend-memory-panel"));
    const state = new WeakMap();
    let raf = 0;
    let active = true;

    function measurePanels() {
      panels = Array.from(scroller.querySelectorAll(".bend-memory-panel"));
      schedule();
    }

    function computeTarget(panel, scrollerRect, height) {
      const rect = panel.getBoundingClientRect();
      const center = rect.top - scrollerRect.top + rect.height / 2;
      const normalized = center / Math.max(height, 1) * 2 - 1;
      const distance = Math.abs(normalized);
      const edge = smoothstep(0.4, 1.08, distance);
      const fade = smoothstep(0.62, 1.24, distance);
      const sign = normalized < 0 ? -1 : 1;

      return {
        rotate: -sign * edge * 17,
        y: sign * edge * 46,
        scale: 1 - edge * 0.045,
        opacity: 1 - fade * 0.58,
      };
    }

    function applyFrame() {
      if (!active) return;

      const scrollerRect = scroller.getBoundingClientRect();
      const height = scroller.clientHeight;
      let settling = false;

      for (const panel of panels) {
        const target = computeTarget(panel, scrollerRect, height);
        const current =
          state.get(panel) ||
          {
            rotate: target.rotate,
            y: target.y,
            scale: target.scale,
            opacity: target.opacity,
          };

        current.rotate = lerp(current.rotate, target.rotate, 0.22);
        current.y = lerp(current.y, target.y, 0.22);
        current.scale = lerp(current.scale, target.scale, 0.22);
        current.opacity = lerp(current.opacity, target.opacity, 0.2);

        const delta =
          Math.abs(current.rotate - target.rotate) +
          Math.abs(current.y - target.y) +
          Math.abs(current.scale - target.scale) * 100 +
          Math.abs(current.opacity - target.opacity) * 100;
        settling = settling || delta > 0.08;

        panel.style.transform = `translate3d(0, ${current.y.toFixed(
          2,
        )}px, 0) rotateX(${current.rotate.toFixed(2)}deg) scale(${current.scale.toFixed(
          4,
        )})`;
        panel.style.opacity = current.opacity.toFixed(3);
        state.set(panel, current);
      }

      if (settling) {
        raf = requestAnimationFrame(applyFrame);
      } else {
        raf = 0;
      }
    }

    function schedule() {
      if (!raf) raf = requestAnimationFrame(applyFrame);
    }

    const resizeObserver = new ResizeObserver(measurePanels);
    resizeObserver.observe(scroller);
    panels.forEach((panel) => resizeObserver.observe(panel));
    scroller.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measurePanels);

    schedule();

    return () => {
      active = false;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      scroller.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measurePanels);
      frame.classList.remove("bend-fallback-ready");
      delete frame.dataset.bendMode;
      panels.forEach((panel) => {
        panel.style.transform = "";
        panel.style.opacity = "";
      });
    };
  }, []);

  return (
    <div ref={scopeRef} className="bend-viewport-scope">
      <Bend
        className="bend-scroll-frame bend-scroll-frame--native"
        zone={220}
        angle={78}
        rounding={170}
        perspective={820}
        direction="in"
        ease={280}
        smoothing={0.16}
        tumble={0.35}
        tilt={0.25}
      >
        {children}
      </Bend>
    </div>
  );
}
