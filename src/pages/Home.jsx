import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CoinCard from '../components/CoinCard.jsx'
import { getMarkets, formatMoney, formatPercent } from '../api.jsx'

const STORAGE_KEY = 'cryptoradar_watchlist'

export default function Home() {
  const [coins, setCoins] = useState([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('rank')
  const [amount, setAmount] = useState(100)
  const [quickCoinId, setQuickCoinId] = useState('bitcoin')
  const [savedCoins, setSavedCoins] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const searchInput = useRef(null)

  const loadCoins = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getMarkets()
      setCoins(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    searchInput.current?.focus()
    loadCoins()
  }, [loadCoins])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCoins))
  }, [savedCoins])

  const toggleSave = useCallback((id) => {
    setSavedCoins((current) =>
      current.includes(id) ? current.filter((coinId) => coinId !== id) : [...current, id]
    )
  }, [])

  const filteredCoins = useMemo(() => {
    const text = search.toLowerCase().trim()
    const result = coins.filter((coin) =>
      coin.name.toLowerCase().includes(text) || coin.symbol.toLowerCase().includes(text)
    )

    if (sortBy === 'price') return result.sort((a, b) => b.current_price - a.current_price)
    if (sortBy === 'change') return result.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    return result.sort((a, b) => a.market_cap_rank - b.market_cap_rank)
  }, [coins, search, sortBy])

  const marketLeader = coins[0]
  const tickerCoins = coins.slice(0, 14)
  const tickerLoop = [...tickerCoins, ...tickerCoins]

  const topGainer = useMemo(() => {
    if (coins.length === 0) return null
    return [...coins].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)[0]
  }, [coins])

  const topLoser = useMemo(() => {
    if (coins.length === 0) return null
    return [...coins].sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)[0]
  }, [coins])

  const quickCoin = useMemo(() => {
    return coins.find((coin) => coin.id === quickCoinId) || coins[0]
  }, [coins, quickCoinId])

  const quickEstimate = useMemo(() => {
    if (!quickCoin || !amount) return 0
    return Number(amount) / quickCoin.current_price
  }, [amount, quickCoin])

  return (
    <section className="page">
      {!loading && !error && (
        <div className="ticker-shell" aria-label="Moving top crypto prices">
          <div className="ticker-track">
            {tickerLoop.map((coin, index) => (
              <div className="ticker-item" key={`${coin.id}-${index}`}>
                <img src={coin.image} alt={coin.name} />
                <span>{coin.symbol.toUpperCase()}</span>
                <strong>{formatMoney(coin.current_price)}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="hero">
        <div>
          <p className="eyebrow">CryptoRadar</p>
          <h1>Live prices, clean watchlist, and a sharper crypto dashboard.</h1>


          <div className="quick-stats">
            <span>{coins.length || '—'} coins loaded</span>
            <span>{savedCoins.length} saved</span>
            <span>USD market data</span>
          </div>
        </div>

        <div className="hero-card">
          <span>Market leader</span>
          <strong>{marketLeader ? marketLeader.name : 'Loading...'}</strong>
          <p>{marketLeader ? formatMoney(marketLeader.current_price) : '—'}</p>
        </div>
      </div>

      {!loading && !error && (
        <div className="home-tools">
          <article className="mini-dashboard-card">
            <span>Top gainer today</span>
            <strong>{topGainer?.name}</strong>
            <p className="positive">{topGainer ? formatPercent(topGainer.price_change_percentage_24h) : '—'}</p>
          </article>

          <article className="mini-dashboard-card">
            <span>Biggest drop today</span>
            <strong>{topLoser?.name}</strong>
            <p className="negative">{topLoser ? formatPercent(topLoser.price_change_percentage_24h) : '—'}</p>
          </article>

          <article className="mini-dashboard-card estimate-card">
            <span>Quick estimate</span>
            <div className="small-estimator">
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
              <select value={quickCoinId} onChange={(event) => setQuickCoinId(event.target.value)}>
                {coins.slice(0, 12).map((coin) => (
                  <option key={coin.id} value={coin.id}>{coin.symbol.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <p>{quickCoin ? `${quickEstimate.toFixed(6)} ${quickCoin.symbol.toUpperCase()}` : '—'}</p>
          </article>
        </div>
      )}

      <div className="toolbar">
        <input
          ref={searchInput}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search Bitcoin, Ethereum..."
        />

        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
          <option value="rank">Sort by rank</option>
          <option value="price">Sort by price</option>
          <option value="change">Sort by 24h change</option>
        </select>

        <button onClick={loadCoins}>Refresh</button>
      </div>

      {loading && <p className="message">Loading live prices...</p>}
      {error && <p className="message error">{error}</p>}

      {!loading && !error && (
        <div className="coin-grid">
          {filteredCoins.map((coin) => (
            <CoinCard
              key={coin.id}
              coin={coin}
              isSaved={savedCoins.includes(coin.id)}
              onToggle={toggleSave}
            />
          ))}
        </div>
      )}
    </section>
  )
}
