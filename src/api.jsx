const BASE_URL = 'https://api.coingecko.com/api/v3'

export function getMarkets() {
  return fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=40&page=1&sparkline=false&price_change_percentage=24h`
  )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Could not load market data')
        }

        return response.json()
      })
}

export function getCoin(id) {
  return fetch(
      `${BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
  )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Could not load coin details')
        }

        return response.json()
      })
}

export function formatMoney(value) {
  if (value === null || value === undefined) {
    return '—'
  }

  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value < 1 ? 6 : 2,
  })
}

export function formatPercent(value) {
  if (value === null || value === undefined) {
    return '—'
  }

  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`
}