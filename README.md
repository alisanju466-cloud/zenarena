# ZENOX ESPORTS — Frontend Prototype

## Upload
Upload `index.html`, `style.css`, `app.js`, and `README.md` to the root of a GitHub repository. Enable GitHub Pages from **Settings → Pages → Deploy from a branch → main → /(root)**.

## Current behavior
- No sample tournaments or players are preloaded.
- New accounts start with 0 non-cash demo points.
- Admin-created tournaments are hidden as drafts until the organizer clicks **Start & publish**.
- Players can join published matches for free until slots are full.
- Admin can move a match from upcoming to live to completed, or delete it.
- Player point requests are manual, non-cash demo point adjustments. Admin can approve or reject them.
- Leaderboard begins empty and can be populated with organizer-entered demo results.
- Data is stored in localStorage in the current browser only.

## Important
This is a static frontend prototype, not a multi-user production service. Each visitor has separate browser storage. To share users, joins, requests, balances and live updates across devices, add a secure backend, database and server-side admin authentication.

This prototype does not process real-money deposits, withdrawals, payments, paid tournament entry, or cash-equivalent points. Demo points cannot be purchased, cashed out, transferred, or redeemed. Never publish admin controls without proper server-side authentication.

Independent community project; not affiliated with or endorsed by Garena.
