interface HasCustomerAmount {
  customerId: number
}

/** Balance per customer in paise: sum of bill totals minus sum of payments. */
export function balancesByCustomer(
  bills: (HasCustomerAmount & { total: number })[],
  payments: (HasCustomerAmount & { amount: number })[],
): Map<number, number> {
  const balances = new Map<number, number>()
  for (const bill of bills) {
    balances.set(bill.customerId, (balances.get(bill.customerId) ?? 0) + bill.total)
  }
  for (const payment of payments) {
    balances.set(payment.customerId, (balances.get(payment.customerId) ?? 0) - payment.amount)
  }
  return balances
}
