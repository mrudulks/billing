import { db } from './db'

const SHOP_NAME = 'shopName'
const SHOP_PHONE = 'shopPhone'

export interface ShopDetails {
  shopName: string
  shopPhone: string
}

export async function getShopDetails(): Promise<ShopDetails> {
  const [name, phone] = await db.settings.bulkGet([SHOP_NAME, SHOP_PHONE])
  return { shopName: name?.value ?? '', shopPhone: phone?.value ?? '' }
}

const LAST_BILL_NUMBER = 'lastBillNumber'

/**
 * Takes the next bill number. Numbers are never reused, even after a bill is deleted.
 * Must be called inside a transaction that includes `settings` and `bills`.
 */
export async function takeNextBillNumber(): Promise<number> {
  const [counter, lastBill] = await Promise.all([db.settings.get(LAST_BILL_NUMBER), db.bills.orderBy('number').last()])
  const next = Math.max(Number(counter?.value ?? 0), lastBill?.number ?? 0) + 1
  await db.settings.put({ key: LAST_BILL_NUMBER, value: String(next) })
  return next
}

export async function saveShopDetails(details: ShopDetails): Promise<void> {
  await db.settings.bulkPut([
    { key: SHOP_NAME, value: details.shopName },
    { key: SHOP_PHONE, value: details.shopPhone },
  ])
}
