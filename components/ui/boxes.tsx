"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

const colors = [
  "#1e3a8a", // primary-900
  "#1e40af", // primary-800
  "#1d4ed8", // primary-700
  "#2563eb", // primary-600
  "#3b82f6", // primary-500
  "#1e3a8a",
  "#1e40af",
  "#2563eb",
  "#1d4ed8",
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

interface Walker {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

function createWalker(maxX: number, maxY: number): Walker {
  return {
    x: Math.random() * maxX,
    y: Math.random() * maxY,
    dx: (Math.random() - 0.5) * 1.5,
    dy: (Math.random() - 0.5) * 1.5,
  };
}

function stepWalker(w: Walker, maxX: number, maxY: number): void {
  // Gradually shift direction for organic movement
  w.dx += (Math.random() - 0.5) * 0.5;
  w.dy += (Math.random() - 0.5) * 0.5;
  const maxSpeed = 1.2;
  w.dx = Math.max(-maxSpeed, Math.min(maxSpeed, w.dx));
  w.dy = Math.max(-maxSpeed, Math.min(maxSpeed, w.dy));
  w.x += w.dx;
  w.y += w.dy;
  // Wrap around edges
  if (w.x < 0) w.x += maxX;
  if (w.x >= maxX) w.x -= maxX;
  if (w.y < 0) w.y += maxY;
  if (w.y >= maxY) w.y -= maxY;
}

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const [isMobile, setIsMobile] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const numRows = isMobile ? 40 : 150;
  const numCols = isMobile ? 25 : 100;

  const lightUpCell = useCallback((i: number, j: number) => {
    const el = containerRef.current?.children[i]?.children[j] as
      | HTMLElement
      | undefined;
    if (!el) return;
    const key = `${i}-${j}`;
    const old = timeoutsRef.current.get(key);
    if (old) clearTimeout(old);
    el.style.backgroundColor = getRandomColor();
    el.style.transition = "background-color 0s";
    timeoutsRef.current.set(
      key,
      setTimeout(() => {
        el.style.transition = "background-color 1.5s ease-out";
        el.style.backgroundColor = "";
        timeoutsRef.current.delete(key);
      }, 200)
    );
  }, []);

  useEffect(() => {
    const numWalkers = isMobile ? 2 : 3;
    const walkers = Array.from({ length: numWalkers }, () =>
      createWalker(numRows, numCols)
    );

    const interval = setInterval(() => {
      for (const w of walkers) {
        stepWalker(w, numRows, numCols);
        const ci = Math.floor(w.x);
        const cj = Math.floor(w.y);
        if (ci >= 0 && ci < numRows && cj >= 0 && cj < numCols) {
          lightUpCell(ci, cj);
        }
      }
    }, 120);

    return () => {
      clearInterval(interval);
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current.clear();
    };
  }, [numRows, numCols, isMobile, lightUpCell]);

  return (
    <div
      ref={containerRef}
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "absolute -top-1/4 left-1/4 z-0 flex h-full w-full -translate-x-1/2 -translate-y-1/2 p-4",
        className
      )}
      {...rest}
    >
      {Array.from({ length: numRows }, (_, i) => (
        <div
          key={`row${i}`}
          className="relative h-8 w-16 border-l border-slate-300"
        >
          {Array.from({ length: numCols }, (_, j) => (
            <div
              key={`col${j}`}
              onMouseEnter={(e) => {
                const key = `${i}-${j}`;
                const existing = timeoutsRef.current.get(key);
                if (existing) clearTimeout(existing);
                e.currentTarget.style.backgroundColor = getRandomColor();
                e.currentTarget.style.transition = "background-color 0s";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transition =
                  "background-color 1.5s ease-out";
                e.currentTarget.style.backgroundColor = "";
              }}
              className="relative h-8 w-16 border-t border-r border-slate-300"
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="pointer-events-none absolute -top-[14px] -left-[22px] h-6 w-10 stroke-[1px] text-slate-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);
