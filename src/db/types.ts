// All money values are integer paise (₹1 = 100).
// All `date` / `fromDate` / `toDate` values are local ISO dates: 'YYYY-MM-DD'.

export interface Customer {
  id: number
  name: string
  phone?: string
  address?: string
  notes?: string
  createdAt: string
}

export interface Item {
  id: number
  name: string
  defaultPrice: number
  // 1 = shown on entry screen, 0 = hidden. Number, because IndexedDB cannot index booleans.
  active: 0 | 1
}

export interface CustomerPrice {
  id: number
  customerId: number
  itemId: number
  price: number
}

export interface Entry {
  id: number
  customerId: number
  date: string
  itemId: number
  // Copied at time of sale so later price/name changes never alter old bills.
  itemName: string
  unitPrice: number
  qty: number
  billId?: number
}

export interface Bill {
  id: number
  number: number
  customerId: number
  fromDate: string
  toDate: string
  total: number
  createdAt: string
}

export interface Payment {
  id: number
  customerId: number
  date: string
  amount: number
  note?: string
}

export interface Setting {
  key: string
  value: string
}
