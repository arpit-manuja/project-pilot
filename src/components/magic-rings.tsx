"use client";

import { useEffect, useRef } from "react";

interface Ring {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  maxRadius: number;
}

export function MagicRings() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringsRef = useRef<Ring[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Create new ring at cursor position
      if (Math.random() > 0.7) {
        ringsRef.current.push({
          x: e.clientX,
          y: e.clientY,
          radius: 0,
          opacity: 1,
          maxRadius: 100,
        });
      }
    };

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw rings
      ringsRef.current = ringsRef.current.filter((ring) => {
        ring.radius += 2;
        ring.opacity = 1 - ring.radius / ring.maxRadius;

        if (ring.opacity > 0) {
          ctx.strokeStyle = `rgba(239, 68, 68, ${ring.opacity * 0.15})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
          ctx.stroke();

          return true;
        }
        return false;
      });

      // Draw a permanent ring at cursor
      ctx.strokeStyle = "rgba(239, 68, 68, 0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(mouseRef.current.x, mouseRef.current.y, 30, 0, Math.PI * 2);
      ctx.stroke();

      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
