# CryptoRadar - React Crypto Tracker

CryptoRadar is a dark modern React web application built for the Client-Side Programming course project. It uses live crypto market data, a moving ticker, search, sorting, coin details, a watchlist, a guide page, a simple estimator, and a demo buy panel.

## Requirements checklist

- Built with Vite and React
- Uses a real public REST API: CoinGecko API
- Uses React Router with different pages:
  - Markets
  - Watchlist
  - Coin Details
  - Guide
- Uses React Hooks for real purposes:
  - `useState` for UI and API state
  - `useEffect` for fetching API data and saving to localStorage
  - `useMemo` for filtering, sorting, and calculations
  - `useCallback` for stable event functions
  - `useRef` for focusing the search input
- Ready to host on GitHub
- Ready to deploy on Netlify

## Main features

- Live crypto prices from CoinGecko
- Moving top crypto ticker
- Search and sort coins
- Save coins to the watchlist
- Coin details page
- Guide page with simple crypto terms
- USD to crypto estimator
- Demo buy panel in the Watchlist page

## How to run

```bash
npm install
npm run dev
```

## How to build

```bash
npm run build
```
