# Indian Handicrafts App

I built this app because I wanted to create something that actually helps Indian artisans get their work out there. It's a mobile marketplace where people can browse and order handcrafted products — stuff like Pashmina shawls, Kundan jewelry, Rajasthani turbans, mirror-work wallets, and more.

The whole thing runs on React Native with Expo, so it works on Android, iOS, and web from a single codebase.

## What it does

- Browse products in a clean grid layout with search and category filters
- Save favorites so you can come back to them later
- Check out artisan profiles — who made the thing, where they're from, how long they've been doing it
- Order straight through WhatsApp (no payment gateway needed, keeps it simple)
- Contact form if someone wants to partner up or ask questions
- On web it wraps everything in a phone frame so it doesn't look weird on a big screen

## Tech used

- **React Native + Expo SDK 54** — the main framework, handles everything cross-platform
- **React 19** — hooks everywhere (useState, useMemo, useCallback)
- **react-native-web** — makes the app run in browsers
- **Feather Icons** via @expo/vector-icons — all the icons you see in the app
- **JavaScript (ES6+)** — no TypeScript on this one, kept it straightforward

Nothing fancy on the backend — it's all client-side right now. Product data lives in the app itself.

## How to run it

You'll need Node.js (v18+) and npm.

```bash
git clone https://github.com/ataborz/Indian-Handicrafts-App.git
cd Indian-Handicrafts-App
npm install
npx expo start --web
```

For mobile, use `npx expo start` and scan the QR code with Expo Go on your phone.

## Project files

Everything lives in one main file honestly:

- `App.js` — all the screens, components, data, and styles
- `assets/` — product images (shawl, pottery, jewelry, baskets, etc.)
- `app.json` — Expo config
- `index.js` — entry point, just registers the app

## Screens

**Home** — hero banner, stats, featured crafts carousel, category chips, artisan cards

**Crafts** — full product grid with search bar and filter chips. Tap any product to see details, pick quantity, order on WhatsApp

**Favorites** — everything you've hearted shows up here

**Artisans** — detailed profiles with bio, experience, product count, and a connect button

**More** — about us page (the mission behind the app) and contact page with a form + direct email/phone/address

## Author

**Atay Ashraf Khan**

GitHub — [@ataborz](https://github.com/ataborz)
Email — khanatayashraf@gmail.com

## License

MIT — do whatever you want with it.
