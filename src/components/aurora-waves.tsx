"use client";

import { useEffect, useRef } from "react";

interface Wave {
  y: number;
  amplitude: number;
  frequency: number;
  phase: number;
  speed: number;
  opacity: number;
}

export function AuroraWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waveRef = useRef<Wave[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize waves
    waveRef.current = [
      { y: canvas.height * 0.3, amplitude: 40, frequency: 0.005, phase: 0, speed: 0.05, opacity: 0.6 },
      { y: canvas.height * 0.5, amplitude: 60, frequency: 0.003, phase: Math.PI / 2, speed: 0.03, opacity: 0.4 },
      { y: canvas.height * 0.7, amplitude: 50, frequency: 0.004, phase: Math.PI, speed: 0.04, opacity: 0.3 },
    ];

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      timeRef.current += 1;

      waveRef.current.forEach((wave, index) => {
        ctx.beginPath();
        ctx.moveTo(0, wave.y);

        for (let x = 0; x < canvas.width; x += 10) {
          const y = wave.y + Math.sin(x * wave.frequency + timeRef.current * wave.speed + wave.phase) * wave.amplitude;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        // Red gradient
        const gradient = ctx.createLinearGradient(0, wave.y - wave.amplitude, 0, wave.y + wave.amplitude);
        gradient.addColorStop(0, `rgba(239, 68, 68, 0)`);
        gradient.addColorStop(0.5, `rgba(239, 68, 68, ${wave.opacity * 0.15})`);
        gradient.addColorStop(1, `rgba(239, 68, 68, 0)`);

        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.strokeStyle = `rgba(239, 68, 68, ${wave.opacity * 0.12})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current !== null) {
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
