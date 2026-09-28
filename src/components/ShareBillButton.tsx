import { whatsappPhone } from '../lib/bills'
import Button from './Button'

interface ShareBillButtonProps {
  text: string
  phone: string | undefined
  onMessage: (message: string) => void
}

/** Opens WhatsApp to the customer's number, or the phone's share menu when there is no number. */
export default function ShareBillButton({ text, phone, onMessage }: ShareBillButtonProps) {
  const waPhone = whatsappPhone(phone)

  async function handleShare() {
    if (waPhone) {
      window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
      return
    }
    if (navigator.share) {
      try {
        await navigator.share({ text })
      } catch {
        // Closing the share menu is not an error.
      }
      return
    }
    try {
      await navigator.clipboard.writeText(text)
      onMessage('Bill copied. Paste it in WhatsApp.')
    } catch {
      onMessage('Could not share. Add a phone number to this customer.')
    }
  }

  return (
    <Button onClick={handleShare} className="w-full">
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3z" />
      </svg>
      {waPhone ? 'Send on WhatsApp' : 'Share bill'}
    </Button>
  )
}
