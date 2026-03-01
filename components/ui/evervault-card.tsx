"use client";

import { useMotionValue, motion, useMotionTemplate, MotionValue } from "framer-motion";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const EvervaultCard = ({
  text,
  className,
}: {
  text?: string;
  className?: string;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const [randomString, setRandomString] = useState("");
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Generate initial random string
    setRandomString(generateRandomString(1500));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRandomString(generateRandomString(1500));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={cn(
        "p-0.5 bg-transparent w-full h-full relative",
        className
      )}
    >
      <div
        onMouseMove={onMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="group/card w-full relative overflow-hidden bg-transparent flex items-center justify-center h-full"
      >
        <CardPattern
          mouseX={mouseX}
          mouseY={mouseY}
          randomString={randomString}
          isHovering={isHovering}
        />
        <div className="relative z-10 flex items-center justify-center">
          <div className="relative h-full w-full flex items-center justify-center text-white">
            {text && (
              <span className="text-white text-center z-20 font-medium text-base sm:text-lg px-4">
                {text}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export function CardPattern({
  mouseX,
  mouseY,
  randomString,
  isHovering,
}: {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  randomString: string;
  isHovering: boolean;
}) {
  const maskImage = useMotionTemplate`radial-gradient(250px at ${mouseX}px ${mouseY}px, white, transparent)`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="pointer-events-none">
      {/* Background numbers always visible */}
      <div className="absolute inset-0 [mask-image:linear-gradient(white,transparent)] opacity-30">
        <p className="absolute inset-x-0 inset-y-0 h-full w-full break-words text-white font-mono text-xs leading-relaxed tracking-wider transition duration-500">
          {randomString}
        </p>
      </div>
      {/* Hover effect with gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600 opacity-0 group-hover/card:opacity-100 backdrop-blur-xl transition duration-500"
        style={style}
      />
      <motion.div
        className="absolute inset-0 opacity-0 mix-blend-overlay group-hover/card:opacity-100"
        style={style}
      >
        <p className="absolute inset-x-0 inset-y-0 h-full w-full break-words text-white font-mono text-xs font-bold leading-relaxed tracking-wider">
          {randomString}
        </p>
      </motion.div>
    </div>
  );
}

const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export const generateRandomString = (length: number) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const Icon = ({ className, ...rest }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
