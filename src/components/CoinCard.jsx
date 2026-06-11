import { Link } from 'react-router-dom'
import { formatMoney, formatPercent } from '../api.jsx'

export default function CoinCard({ coin, isSaved, onToggle }) {
    const changeClass = coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'

    function handleSaveClick(event) {
        event.preventDefault()
        event.stopPropagation()
        onToggle(coin.id)
    }

    return (
        <article className="coin-card">
            <Link to={`/coin/${coin.id}`} className="coin-card-link">
                <div className="coin-top">
                    <img src={coin.image} alt={coin.name} />

                    <div>
                        <h3>{coin.name}</h3>
                        <span>{coin.symbol.toUpperCase()}</span>
                    </div>
                </div>

                <div className="coin-info">
                    <p>
                        <span>Price</span>
                        <strong>{formatMoney(coin.current_price)}</strong>
                    </p>

                    <p>
                        <span>24h change</span>
                        <strong className={changeClass}>
                            {formatPercent(coin.price_change_percentage_24h)}
                        </strong>
                    </p>

                    <p>
                        <span>Rank</span>
                        <strong>#{coin.market_cap_rank}</strong>
                    </p>
                </div>
            </Link>

            <button className="save-button" onClick={handleSaveClick}>
                {isSaved ? '★ Saved' : '☆ Save'}
            </button>
        </article>
    )
}