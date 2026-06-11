import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Watchlist from './pages/Watchlist.jsx'
import Guide from './pages/Guide.jsx'
import CoinDetails from './pages/CoinDetails.jsx'
import Navbar from './components/Navbar.jsx'

export default function App() {
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/guide" element={<Guide />} />
                <Route path="/coin/:id" element={<CoinDetails />} />
            </Routes>
        </>
    )
}