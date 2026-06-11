import { useCallback, useEffect, useMemo, useState } from 'react'
import CoinCard from '../components/CoinCard.jsx'
import { formatMoney, getMarkets } from '../api.jsx'

const STORAGE_KEY = 'cryptoradar_watchlist'
const CARD_KEY = 'cryptoradar_demo_card'

export default function Watchlist() {
  const [coins, setCoins] = useState([])
  const [savedCoins, setSavedCoins] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  })
  const [cardName, setCardName] = useState(() => localStorage.getItem(CARD_KEY) || '')
  const [buyCoinId, setBuyCoinId] = useState('')
  const [buyAmount, setBuyAmount] = useState(50)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMarkets()
      .then(setCoins)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCoins))
  }, [savedCoins])

  useEffect(() => {
    localStorage.setItem(CARD_KEY, cardName)
  }, [cardName])

  const toggleSave = useCallback((id) => {
    setSavedCoins((current) => current.filter((coinId) => coinId !== id))
  }, [])

  const watchedCoins = useMemo(() => {
    return coins.filter((coin) => savedCoins.includes(coin.id))
  }, [coins, savedCoins])

  const selectedCoin = useMemo(() => {
    return watchedCoins.find((coin) => coin.id === buyCoinId) || watchedCoins[0]
  }, [watchedCoins, buyCoinId])

  const coinAmount = useMemo(() => {
    if (!selectedCoin || !buyAmount) return 0
    return Number(buyAmount) / selectedCoin.current_price
  }, [buyAmount, selectedCoin])

  const handleDemoBuy = useCallback(() => {
    if (!selectedCoin) {
      setMessage('Save a coin first, then you can try to buy.')
      return
    }

    if (!cardName.trim()) {
      setMessage('Add a card name first. Example: Student Card')
      return
    }

    setMessage(
      `Demo buy created: ${formatMoney(Number(buyAmount || 0))} for ${coinAmount.toFixed(6)} ${selectedCoin.symbol.toUpperCase()}.`
    )
  }, [buyAmount, cardName, coinAmount, selectedCoin])

  return (
    <section className="page">
      <div className="simple-header">
        <p className="eyebrow">Your saved coins</p>
        <h1>Watchlist</h1>
      </div>

      {loading && <p className="message">Loading your watchlist...</p>}

      {!loading && (
        <div className="demo-buy-panel">
          <div>
            <h2>Add a card and buy</h2>
            <p>This is only a project demo. It does not use real money and does not save real card numbers.</p>
          </div>

          <div className="demo-buy-form">
            <input
              value={cardName}
              onChange={(event) => setCardName(event.target.value)}
              placeholder="Card name, example: Student Card"
            />

            <select value={selectedCoin?.id || ''} onChange={(event) => setBuyCoinId(event.target.value)}>
              {watchedCoins.length === 0 && <option value="">No saved coins</option>}
              {watchedCoins.map((coin) => (
                <option key={coin.id} value={coin.id}>{coin.name}</option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              value={buyAmount}
              onChange={(event) => setBuyAmount(event.target.value)}
            />

            <button onClick={handleDemoBuy}>Demo Buy</button>
          </div>

          {selectedCoin && (
            <div className="demo-result">
              <span>Estimated amount</span>
              <strong>{coinAmount.toFixed(6)} {selectedCoin.symbol.toUpperCase()}</strong>
            </div>
          )}

          {message && <p className="small-message buy-message">{message}</p>}
        </div>
      )}

      {!loading && watchedCoins.length === 0 && (
        <div className="empty-box">
          <h2>No coins saved yet</h2>
          <p>Go to Markets and click the star on a coin.</p>
        </div>
      )}

      <div className="coin-grid">
        {watchedCoins.map((coin) => (
          <CoinCard key={coin.id} coin={coin} isSaved={true} onToggle={toggleSave} />
        ))}
      </div>
    </section>
  )
}
