export function currencyFormat(number: number) {
  return number.toLocaleString('pt-br', { maximumFractionDigits: 3 })
}

export function formatPoints(number: number) {
  let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  })
  return USDollar.format(number)
}
