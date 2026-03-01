"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { VeroLogo } from "@/components/ui/vero-logo"

const words = ["merchant", "receipt", "consumer"]
const PAUSE_MS = 1000
const ROTATION_DURATION = 0.6

export default function RotatingIconPage() {
  const [step, setStep] = useState(0)
  const [isPaused, setIsPaused] = useState(true)

  useEffect(() => {
    if (isPaused) {
      const timer = setTimeout(() => {
        setIsPaused(false)
        setStep((prev) => prev + 1)
      }, PAUSE_MS)
      return () => clearTimeout(timer)
    }
  }, [isPaused])

  const handleRotationComplete = useCallback(() => {
    setIsPaused(true)
  }, [])

  const currentWord = words[step % 3]
  const rotation = step * 120

  return (
    <div className="min-h-screen flex flex-col items-center pt-32 bg-white">
      <div className="flex flex-col items-center gap-8">
        {/* Cycling word */}
        <div className="h-16 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={step}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="text-5xl font-semibold tracking-tight text-black"
            >
              {currentWord}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Rotating Vero icon */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{
            duration: ROTATION_DURATION,
            ease: "easeInOut",
          }}
          onAnimationComplete={handleRotationComplete}
          style={{ transformOrigin: "50% 40%" }}
          className="text-black"
        >
          <VeroLogo size={160} />
        </motion.div>
      </div>
    </div>
  )
}
