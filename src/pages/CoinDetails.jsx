import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { formatMoney, formatPercent, getCoin } from '../api.jsx'

export default function CoinDetails() {
  const { id } = useParams()
  const [coin, setCoin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    getCoin(id)
      .then(setCoin)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const description = useMemo(() => {
    const text = coin?.description?.en?.replace(/<[^>]*>/g, '') || ''
    return text.length > 420 ? `${text.slice(0, 420)}...` : text
  }, [coin])

  if (loading) return <section className="page"><p className="message">Loading details...</p></section>
  if (error || !coin) return <section className="page"><p className="message error">Could not load coin.</p></section>

  const market = coin.market_data
  const change = market.price_change_percentage_24h
  const changeClass = change >= 0 ? 'positive' : 'negative'

  return (
    <section className="page details-page">
      <Link to="/" className="back-link">← Back to markets</Link>

      <div className="details-hero">
        <img src={coin.image.large} alt={coin.name} />
        <div>
          <p className="eyebrow">Rank #{coin.market_cap_rank}</p>
          <h1>{coin.name}</h1>
          <p>{coin.symbol.toUpperCase()}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div><span>Current price</span><strong>{formatMoney(market.current_price.usd)}</strong></div>
        <div><span>24h change</span><strong className={changeClass}>{formatPercent(change)}</strong></div>
        <div><span>Market cap</span><strong>{formatMoney(market.market_cap.usd)}</strong></div>
        <div><span>24h volume</span><strong>{formatMoney(market.total_volume.usd)}</strong></div>
      </div>

      {description && (
        <article className="info-card">
          <h2>Quick summary</h2>
          <p>{description}</p>
        </article>
      )}
    </section>
  )
}
