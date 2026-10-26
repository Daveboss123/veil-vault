import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

export function QrCode({ value, label }: { value: string; label: string }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    let active = true
    if (!canvas.current) return
    QRCode.toCanvas(canvas.current, value, { width: 280, margin: 2, errorCorrectionLevel: 'M', color: { dark: '#142019', light: '#fffdf5' } })
      .then(() => { if (active) setError(false) })
      .catch(() => { if (active) setError(true) })
    return () => { active = false }
  }, [value])
  return <div className="qr-block"><canvas ref={canvas} aria-label={label} role="img" />{error && <p role="alert">Could not draw this QR code.</p>}<span>{label}</span></div>
}
