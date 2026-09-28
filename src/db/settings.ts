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

export async function saveShopDetails(details: ShopDetails): Promise<void> {
  await db.settings.bulkPut([
    { key: SHOP_NAME, value: details.shopName },
    { key: SHOP_PHONE, value: details.shopPhone },
  ])
}
