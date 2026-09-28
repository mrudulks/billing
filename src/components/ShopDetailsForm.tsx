import { useState, type FormEvent } from 'react'
import { saveShopDetails, type ShopDetails } from '../db/settings'
import { cleanPhone, isValidPhone, PHONE_ERROR } from '../lib/phone'
import Button from './Button'
import TextField from './TextField'

export default function ShopDetailsForm({ initial }: { initial: ShopDetails }) {
  const [shopName, setShopName] = useState(initial.shopName)
  const [shopPhone, setShopPhone] = useState(initial.shopPhone)
  const [phoneError, setPhoneError] = useState('')
  const [status, setStatus] = useState<'idle' | 'saved' | 'failed'>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!isValidPhone(shopPhone)) {
      setPhoneError(PHONE_ERROR)
      return
    }
    try {
      await saveShopDetails({ shopName: shopName.trim(), shopPhone: cleanPhone(shopPhone) })
      setStatus('saved')
    } catch {
      setStatus('failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 px-4">
      <TextField
        label="Shop name"
        value={shopName}
        onChange={(v) => {
          setShopName(v)
          setStatus('idle')
        }}
        hint="Printed at the top of every bill"
        autoCapitalize="words"
        autoComplete="off"
      />
      <TextField
        label="Your phone"
        value={shopPhone}
        onChange={(v) => {
          setShopPhone(v)
          setPhoneError('')
          setStatus('idle')
        }}
        error={phoneError}
        type="tel"
        inputMode="tel"
        autoComplete="off"
      />
      <div className="flex items-center gap-4">
        <Button type="submit" className="flex-1">
          Save shop details
        </Button>
        {status === 'saved' && (
          <p role="status" className="text-lg font-bold text-leaf-700">
            Saved
          </p>
        )}
      </div>
      {status === 'failed' && <p className="text-lg font-semibold text-danger">Could not save. Please try again.</p>}
    </form>
  )
}
