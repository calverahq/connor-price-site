# Connor Price — official site

Built and maintained by [Calvera HQ](https://calverahq.com). Hosted on the Calvera HQ HighLevel account.

## How it's wired
HighLevel page **Connor Price → Home** has one Custom Code element:

```html
<script>(function(){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/calverahq/connor-price-site@main/dist/cp-site.js?v='+Math.floor(Date.now()/6e5);var c=document.currentScript;c.parentNode.insertBefore(s,c.nextSibling);})();</script>
```
The `?v=` changes every 10 minutes so visitors' browsers never hold an old copy.

That bundle builds the whole page. Nothing else needs to change in HighLevel.

## Update the site
1. Edit `src/config.js` — the single source of truth for tracks, collabs, globe cities, videos, tour, merch, links and stats.
2. `python3 build.py` → rebuilds `dist/cp-site.js` and `dist/index.html`.
3. Commit and push to `main`.
4. Clear the CDN cache so the change is live in about a minute: open
   `https://purge.jsdelivr.net/gh/calverahq/connor-price-site@main/dist/cp-site.js`

## Turn on live hookups (in `src/config.js`, each falls back cleanly when blank)
| Key | Does | From |
|---|---|---|
| `hero.mp4` | Team's own muted hero loop instead of YouTube | 4 of Clubs |
| `tracks[].audio` | Approved audio files instead of the YouTube mini player | 4 of Clubs |
| `shop.storefrontToken` | Live products + Shopify checkout | Shopify → Headless channel → public Storefront token |
| `tour.bandsintownAppId` | Upcoming dates with tickets | Bandsintown for Artists |
| `alerts.webhook` | Signups into a Calvera HighLevel workflow | HighLevel → Automation → Inbound webhook |

## Files
- `src/config.js` content · `src/styles.css` look · `src/markup.html` structure · `src/app.js` player, globes, shop, tour · `src/geo.json` map borders (Natural Earth, public domain)
- `dist/` is generated — don't edit by hand.

No photos of Connor are in the repo. Add them only after his team approves them in writing.
