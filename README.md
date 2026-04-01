# 🚗 Motriva — The Editorial Marketplace

A production-grade React frontend for a premium used-car marketplace in India. Built with the **editorial/magazine aesthetic**: bold Manrope headlines, deep-blue primary (`#000666`), burnt-orange CTA (`#9f4200`), and a strict "no-border" design system.

---

## Project Structure

```
motriva/
├── public/
│   └── index.html              # App shell
├── src/
│   ├── components/
│   │   ├── Icon.jsx            # Material Symbols wrapper
│   │   ├── TopHeader.jsx       # Fixed glass navigation bar
│   │   ├── BottomNav.jsx       # Fixed bottom tab bar
│   │   ├── FilterChips.jsx     # Horizontal scrollable filter pills
│   │   ├── Badge.jsx           # Certified / Deal / EV / Featured badges
│   │   ├── SpecChip.jsx        # Spec data tile (fuel, km, etc.)
│   │   ├── CarCard.jsx         # Horizontal scroll featured car card
│   │   ├── SearchListingCard.jsx  # Vertical search result card (+ featured variant)
│   │   ├── TrustGrid.jsx       # 2×2 trust tile section
│   │   └── EditorialFeed.jsx   # News/article feed section
│   ├── pages/
│   │   ├── Home.jsx            # Homepage with hero, showroom, trust, feed
│   │   ├── Search.jsx          # Discovery / search listings
│   │   ├── CarDetail.jsx       # Car detail page with tabs, CTA bar
│   │   ├── Dashboard.jsx       # Seller dashboard with listings & docs
│   │   └── Sell.jsx            # Sell your car onboarding
│   ├── data/
│   │   └── cars.js             # All mock data (cars, listings, news, documents)
│   ├── hooks/
│   │   └── useActiveTab.js     # Tab state hook
│   ├── App.js                  # Router setup
│   ├── index.js                # React entry point
│   ├── index.css               # Global styles + Tailwind directives
│   └── firebase.js             # Firebase configuration
├── tailwind.config.js          # Full design token system
├── postcss.config.js
└── package.json
```

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm start

# 3. Open in browser
# → http://localhost:3000
```

---

## Pages & Routes

| Route         | Page              | Description                              |
|---------------|-------------------|------------------------------------------|
| `/`           | Home              | Hero, featured showroom, trust, feed     |
| `/search`     | Search/Discovery  | Filter chips + full listing feed         |
| `/car/:id`    | Car Detail        | Gallery, specs, tabs, sticky CTA bar     |
| `/dashboard`  | Seller Dashboard  | Stats, listings, document vault          |
| `/sell`       | Sell Your Car     | 5-step onboarding flow                   |

---

## Design System

| Token               | Value      | Usage                      |
|---------------------|------------|----------------------------|
| `primary`           | `#000666`  | Headlines, nav, trust icons |
| `secondary`         | `#9f4200`  | CTAs, prices, accents       |
| `tertiary-fixed`    | `#a3f69c`  | Certified ribbons, check marks |
| `surface-container-lowest` | `#ffffff` | Cards                  |
| Font Headline       | Manrope    | All display/headline text   |
| Font Body           | Inter      | Body, labels, specs         |

**Rules applied:**
- ❌ No `1px` borders — use surface color shifts
- ❌ No `#000000` black — use `on-surface` (`#191c1e`)
- ❌ No sharp corners — minimum `rounded-lg` (0.5rem)
- ✅ Glass nav: `rgba(255,255,255,0.85)` + `backdrop-blur(20px)`
- ✅ Editorial shadow: `0 24px 48px -12px rgba(0,6,102,0.08)`

---

## Next Steps

Ready to wire up to the current Firebase backend:
- Authentication configured via `AuthContext.jsx`
- Firestore database integration ready in `DataContext.jsx`
- Location-based filtering via `LocationContext.jsx`
