import { MessageCircle, Phone } from 'lucide-react'

/**
 * WhatsApp badge that "pushes out" the UPI apps customers pay with
 * (GPay, PhonePe, Paytm). Pure CSS motion; static when reduced motion is on.
 */
export function PaymentLogos() {
  return (
    <div className="pay-stage" aria-hidden="true">
      <span className="pay-chip pay-chip-1">
        <span style={{ color: '#4285F4' }}>G</span>
        <span style={{ color: '#EA4335' }}>P</span>
        <span style={{ color: '#FBBC05' }}>a</span>
        <span style={{ color: '#34A853' }}>y</span>
      </span>
      <span className="pay-chip pay-chip-2">
        <span style={{ color: '#002E6E' }}>pay</span>
        <span style={{ color: '#00BAF2' }}>tm</span>
      </span>
      <span className="pay-chip pay-chip-3" style={{ color: '#5F259F' }}>
        PhonePe
      </span>
      <span className="pay-badge">
        <span className="relative flex items-center justify-center">
          <MessageCircle className="size-9 text-white" strokeWidth={2} />
          <Phone className="absolute size-3.5 text-white" strokeWidth={2.6} fill="currentColor" />
        </span>
      </span>
    </div>
  )
}
