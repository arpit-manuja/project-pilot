"use client";

import { useEffect, useRef } from "react";

export function AnimatedGridBg() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      container.style.setProperty("--mouse-x", `${x}px`);
      container.style.setProperty("--mouse-y", `${y}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 bg-black overflow-hidden"
      style={{
        background: `
          linear-gradient(0deg,transparent 24%,rgba(239, 68, 68, 0.03) 25%,rgba(239, 68, 68, 0.03) 26%,transparent 27%,transparent 74%,rgba(239, 68, 68, 0.03) 75%,rgba(239, 68, 68, 0.03) 76%,transparent 77%,transparent),
          linear-gradient(90deg,transparent 24%,rgba(239, 68, 68, 0.03) 25%,rgba(239, 68, 68, 0.03) 26%,transparent 27%,transparent 74%,rgba(239, 68, 68, 0.03) 75%,rgba(239, 68, 68, 0.03) 76%,transparent 77%,transparent),
          radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(239, 68, 68, 0.08) 0%, transparent 40%)
        `,
        backgroundSize: "50px 50px, 50px 50px, 100% 100%",
      } as React.CSSProperties}
    />
  );
}
