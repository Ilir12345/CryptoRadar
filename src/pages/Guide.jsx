import { useEffect, useMemo, useState } from 'react'
import { formatMoney, formatPercent, getMarkets } from '../api.jsx'

const guideCards = [
  {
    title: '1. Check the price',
    text: 'The price shows how much one coin costs right now in USD.',
  },
  {
    title: '2. Watch the 24h change',
    text: 'Green means the coin went up today. Red means it went down today.',
  },
  {
    title: '3. Save important coins',
    text: 'Use the star button to save coins and follow them in your watchlist.',
  },
]

const terms = [
  { word: 'Market cap', text: 'The total value of a cryptocurrency.' },
  { word: 'Volume', text: 'How much of the coin was traded in 24 hours.' },
  { word: 'Rank', text: 'The position of the coin compared to others.' },
]

const checklistItems = [
  'I checked today’s price movement',
  'I looked at the market cap',
  'I compared the coin with another coin',
  'I saved the coin before making a decision',
]

export default function Guide() {
  const [coins, setCoins] = useState([])
  const [checkedItems, setCheckedItems] = useState([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getMarkets()
        .then(setCoins)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false))
  }, [])

  const topMover = useMemo(() => {
    if (coins.length === 0) return null

    return [...coins].sort(
        (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
    )[0]
  }, [coins])

  const checklistScore = useMemo(() => {
    return Math.round((checkedItems.length / checklistItems.length) * 100)
  }, [checkedItems])

  function toggleChecklistItem(item) {
    if (checkedItems.includes(item)) {
      setCheckedItems(checkedItems.filter((currentItem) => currentItem !== item))
    } else {
      setCheckedItems([...checkedItems, item])
    }
  }

  return (
      <section className="page">
        <div className="simple-header">
          <p className="eyebrow">Market guide</p>
          <h1>Learn how to read the crypto market.</h1>
          <p>
            This page helps users understand the most important crypto numbers in a simple way.
          </p>
        </div>

        <div className="guide-panel">
          <div>
            <p className="eyebrow">Simple steps</p>
            <h2>Search, check, save, and watch.</h2>

          </div>

          <div className="radar-circle">◎</div>
        </div>

        <div className="requirements-grid">
          {guideCards.map((card) => (
              <div key={card.title}>
                <strong>{card.title}</strong>
                <span>{card.text}</span>
              </div>
          ))}
        </div>

        <div className="term-box">
          <h2>Crypto words made simple</h2>

          <div className="term-grid">
            {terms.map((term) => (
                <div key={term.word}>
                  <strong>{term.word}</strong>
                  <span>{term.text}</span>
                </div>
            ))}
          </div>
        </div>

        <div className="tool-grid">
          <article className="tool-card">
            <p className="eyebrow">Safety checklist</p>
            <h2>Before saving a coin, check these steps.</h2>
            <p>
              This is a simple guide tool. It helps the user think before adding coins to the watchlist.
            </p>

            <div className="checklist">
              {checklistItems.map((item) => (
                  <label key={item} className="checklist-item">
                    <input
                        type="checkbox"
                        checked={checkedItems.includes(item)}
                        onChange={() => toggleChecklistItem(item)}
                    />
                    <span>{item}</span>
                  </label>
              ))}
            </div>

            <div className="result-box">
              <span>Guide progress</span>
              <strong>{checklistScore}% ready</strong>
            </div>
          </article>

          <article className="tool-card market-mood-card">
            <p className="eyebrow">Today’s signal</p>
            <h2>Top mover from the live API</h2>

            {loading && <p className="small-message">Checking market...</p>}
            {error && <p className="small-message error">Market signal is unavailable.</p>}

            {!loading && !error && topMover && (
                <div className="mover-box">
                  <img src={topMover.image} alt={topMover.name} />

                  <div>
                    <strong>{topMover.name}</strong>
                    <span>{formatPercent(topMover.price_change_percentage_24h)} today</span>
                    <small>{formatMoney(topMover.current_price)}</small>
                  </div>
                </div>
            )}
          </article>
        </div>
      </section>
  )
}