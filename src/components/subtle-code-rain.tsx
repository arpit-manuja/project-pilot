"use client";

import { useEffect, useRef } from "react";

interface CodeChar {
  x: number;
  y: number;
  char: string;
  opacity: number;
  speed: number;
  duration: number;
  elapsed: number;
}

const CODE_CHARS = ["<", ">", "/", "=", "{", "}", "[", "]", "(", ")", "0", "1", ";", ":", ".", ","];

export function SubtleCodeRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const charsRef = useRef<CodeChar[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const spawnChar = () => {
      const char: CodeChar = {
        x: Math.random() * canvas.width,
        y: -20,
        char: CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)],
        opacity: Math.random() * 0.3 + 0.05,
        speed: Math.random() * 0.5 + 0.3,
        duration: Math.random() * 8000 + 8000,
        elapsed: 0,
      };
      charsRef.current.push(char);
    };

    let lastSpawnTime = 0;

    const animate = (currentTime: number) => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Spawn new characters occasionally
      if (currentTime - lastSpawnTime > 300) {
        if (Math.random() > 0.6) {
          spawnChar();
        }
        lastSpawnTime = currentTime;
      }

      // Update and draw characters
      charsRef.current = charsRef.current.filter((char) => {
        char.elapsed += 16;
        char.y += char.speed;

        const progress = char.elapsed / char.duration;
        const currentOpacity = char.opacity * Math.max(0, 1 - progress);

        ctx.font = "16px monospace";
        ctx.fillStyle = `rgba(239, 68, 68, ${currentOpacity})`;
        ctx.globalAlpha = currentOpacity;
        ctx.fillText(char.char, char.x, char.y);
        ctx.globalAlpha = 1;

        return char.elapsed < char.duration && char.y < canvas.height;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
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
