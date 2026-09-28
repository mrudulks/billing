/** Remove spaces, dashes and brackets people type into phone numbers. */
export function cleanPhone(input: string): string {
  return input.replace(/[\s\-()]/g, '')
}

/** Empty is allowed. Otherwise 10 digits, optionally with a country code like +91. */
export function isValidPhone(input: string): boolean {
  const phone = cleanPhone(input)
  return phone === '' || /^\+?\d{10,13}$/.test(phone)
}

export const PHONE_ERROR = 'Enter a 10-digit phone number, or leave it empty'
