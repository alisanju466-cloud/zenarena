# ZENOX ESPORTS — Frontend Prototype

## Included
- `index.html` — website pages and interface
- `style.css` — responsive black/red premium esports styling
- `app.js` — manual tournament creation, free player registration, status management and demo leaderboard
- `README.md` — setup notes

## Publish on GitHub Pages
1. Create a repository named `zenox-esports`.
2. Upload these four files directly into the repository root.
3. Open **Settings → Pages**.
4. Select **Deploy from a branch**, choose `main` and `/ (root)`, then save.

## Current prototype behavior
- New wallet starts at **0 points**.
- Tournament cards start empty; organizer manually creates tournaments from the Admin page.
- Players can join free tournaments until slots are full.
- Organizer can update a tournament status and record sample leaderboard wins.
- Tournament data, registrations and demo leaderboard are stored in that browser's local storage.

## Important limitations
This is a static frontend demo. Local storage is per browser/device, so different players will not share registrations or see the same live updates. A production version needs a secure backend, database, player authentication and a protected admin role.

This prototype intentionally has no cash deposits, withdrawals, paid entry, money transfers or redeemable balances. Demo points have no cash or prize value. Never expose admin controls without server-side authentication.

This is an independent community project and is not affiliated with or endorsed by Garena.
