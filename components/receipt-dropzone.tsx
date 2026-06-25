"use client"

import { useCallback, useRef, useState } from "react"
import {
  CheckCircle2,
  FileImage,
  Loader2,
  Upload,
  XCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Phases the caller can drive the dropzone through. "matching" specifically
// signals to the user that an OCR/match step is running after the file has
// been transferred — i.e. the upload itself is done but we're waiting for
// the backend to link the receipt to a transaction.
export type UploadPhase =
  | "idle"
  | "uploading"
  | "matching"
  | "done"
  | "error"

const ACCEPTED_TYPES = "image/*,application/pdf"

export interface ReceiptDropzoneProps {
  // Called with files the user dropped or picked. Caller is responsible for
  // upload + state management; the dropzone just collects inputs.
  onFiles: (files: File[]) => void | Promise<void>
  phase?: UploadPhase
  // Optional override for the headline copy in each phase. Useful when the
  // surrounding context already implies "receipt" and the dropzone should
  // read as "Drop here to attach…" instead of "Drag & drop a receipt".
  idleTitle?: string
  idleHint?: string
  // Compact mode shrinks padding and icon size — used inline on the
  // transaction detail "no receipt yet" empty state.
  compact?: boolean
  // Secondary message displayed under the headline. Used for surfacing OCR
  // warnings or "we'll try to auto-match" hints from the caller.
  message?: string | null
  className?: string
  disabled?: boolean
}

// Drag-and-drop + click-to-browse receipt uploader. Renders a phase-aware
// status (uploading / matching / done / error) so the parent can keep its
// own JSX simple — it just drives the `phase` prop.
export function ReceiptDropzone({
  onFiles,
  phase = "idle",
  idleTitle,
  idleHint,
  compact = false,
  message,
  className,
  disabled = false,
}: ReceiptDropzoneProps) {
  const [isOver, setIsOver] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const busy = phase === "uploading" || phase === "matching"
  const blocked = busy || disabled

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsOver(false)
      if (blocked) return
      if (!e.dataTransfer.files) return
      const files = Array.from(e.dataTransfer.files).filter(
        (f) => f.type.startsWith("image/") || f.type === "application/pdf"
      )
      if (files.length > 0) {
        void onFiles(files)
      }
    },
    [onFiles, blocked]
  )

  const onSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return
      const files = Array.from(e.target.files)
      if (files.length > 0 && !blocked) {
        void onFiles(files)
      }
      // Reset so the same file can be picked again after a failed upload.
      e.target.value = ""
    },
    [onFiles, blocked]
  )

  const openPicker = useCallback(() => {
    if (blocked) return
    inputRef.current?.click()
  }, [blocked])

  const headline =
    phase === "uploading"
      ? "Uploading receipt…"
      : phase === "matching"
      ? "Matching to your transactions…"
      : phase === "done"
      ? "Receipt uploaded"
      : phase === "error"
      ? "Upload failed"
      : isOver
      ? "Drop your receipt here"
      : idleTitle ?? "Drag & drop a receipt"

  const hint =
    phase === "uploading"
      ? "Hang tight — sending it to Vero."
      : phase === "matching"
      ? "Running OCR and looking for the right transaction."
      : phase === "done"
      ? "We'll attach it to a transaction automatically."
      : phase === "error"
      ? "Try a clearer image or a different file."
      : idleHint ?? "or click to choose a file (JPG, PNG, HEIC, PDF)"

  const Icon =
    phase === "uploading" || phase === "matching"
      ? Loader2
      : phase === "done"
      ? CheckCircle2
      : phase === "error"
      ? XCircle
      : isOver
      ? FileImage
      : Upload

  return (
    <div
      onDragOver={(e) => {
        if (blocked) return
        e.preventDefault()
        setIsOver(true)
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
      onClick={openPicker}
      role="button"
      tabIndex={blocked ? -1 : 0}
      aria-disabled={blocked || undefined}
      onKeyDown={(e) => {
        if (blocked) return
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          openPicker()
        }
      }}
      className={cn(
        "relative rounded-lg border-2 border-dashed text-center transition-colors",
        compact ? "p-4" : "p-6 sm:p-8",
        blocked
          ? "cursor-default"
          : "cursor-pointer hover:bg-[var(--muted)]/50",
        isOver && !blocked
          ? "border-[var(--primary)] bg-[var(--primary)]/5"
          : "border-[var(--border)]",
        phase === "error" && "border-red-300 bg-red-50/50",
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        multiple
        className="sr-only"
        onChange={onSelect}
        tabIndex={-1}
        aria-hidden="true"
      />
      <div className="flex flex-col items-center gap-2">
        <div
          className={cn(
            "flex items-center justify-center rounded-full",
            compact ? "h-9 w-9" : "h-12 w-12",
            phase === "error"
              ? "bg-red-100 text-red-600"
              : phase === "done"
              ? "bg-green-100 text-green-700"
              : "bg-[var(--muted)] text-[var(--muted-foreground)]"
          )}
        >
          <Icon
            className={cn(
              compact ? "h-4 w-4" : "h-5 w-5",
              busy && "animate-spin"
            )}
          />
        </div>
        <p
          className={cn(
            "font-medium",
            compact ? "text-sm" : "text-base",
            phase === "error" && "text-red-700"
          )}
        >
          {headline}
        </p>
        <p className="text-xs text-[var(--muted-foreground)]">{hint}</p>
        {message ? (
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            {message}
          </p>
        ) : null}
      </div>
    </div>
  )
}
