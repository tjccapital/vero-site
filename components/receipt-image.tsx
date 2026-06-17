"use client"

import { useEffect, useState } from "react"
import { ExternalLink, Loader2 } from "lucide-react"

// Renders a receipt image, transparently converting HEIC/HEIF (the format
// iPhones shoot) to a previewable JPEG. Browsers other than Safari can't decode
// HEIC in an <img>, so for those URLs we fetch the bytes and convert with
// heic2any (loaded lazily — it pulls in a WASM decoder we don't want in the
// initial bundle). Everything else renders directly.

function isHeicUrl(url: string): boolean {
  return /\.(heic|heif)(\?|#|$)/i.test(url)
}

// Reads the image bytes — directly first (works same-origin or when the CDN
// allows CORS), then via our same-origin proxy as a fallback — and converts
// them to a JPEG object URL.
async function convertHeic(url: string): Promise<string> {
  let blob: Blob | null = null
  try {
    const res = await fetch(url)
    if (res.ok) blob = await res.blob()
  } catch {
    // CORS / network — fall through to the proxy.
  }
  if (!blob) {
    const res = await fetch(`/api/image-proxy?url=${encodeURIComponent(url)}`)
    if (!res.ok) throw new Error(`proxy fetch failed (${res.status})`)
    blob = await res.blob()
  }
  const heic2any = (await import("heic2any")).default
  const converted = await heic2any({ blob, toType: "image/jpeg", quality: 0.9 })
  const out = Array.isArray(converted) ? converted[0] : converted
  return URL.createObjectURL(out as Blob)
}

export function ReceiptImage({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const heic = isHeicUrl(src)
  const [convertedSrc, setConvertedSrc] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!heic) return
    let cancelled = false
    let objectUrl: string | null = null
    convertHeic(src)
      .then((url) => {
        if (cancelled) {
          URL.revokeObjectURL(url)
          return
        }
        objectUrl = url
        setConvertedSrc(url)
      })
      .catch((err) => {
        console.error("[ReceiptImage] HEIC conversion failed:", err)
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [heic, src])

  if (failed) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
        <p className="text-sm text-[var(--muted-foreground)]">
          This image can&apos;t be previewed here.
        </p>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--primary)] hover:underline"
        >
          <ExternalLink className="h-4 w-4" />
          Open original
        </a>
      </div>
    )
  }

  if (heic && !convertedSrc) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--muted-foreground)]" />
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={heic ? (convertedSrc as string) : src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  )
}
