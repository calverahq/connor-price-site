# Connor Price — official site

Built and maintained by [Calvera HQ](https://calverahq.com). Hosted on the Calvera HQ HighLevel account.

## How it's wired
HighLevel page **Connor Price → Home** has one Custom Code element containing `loader.html`:

```html
<script>(function(){var c=document.currentScript,b='https://cdn.jsdelivr.net/gh/calverahq/connor-price-site@';function go(v){var s=document.createElement('script');s.src=b+v+'/dist/cp-site.js';c.parentNode.insertBefore(s,c.nextSibling);}fetch('https://api.github.com/repos/calverahq/connor-price-site/commits/main').then(function(r){return r.ok?r.json():Promise.reject();}).then(function(d){go(d.sha);},function(){go('main');});})();</script>
```

It asks GitHub for the latest commit on `main` and loads exactly that build from jsDelivr, so a push is live on the next page load, with no cache purge. If GitHub is unreachable it falls back to `@main`.

That bundle builds the whole page. Nothing else needs to change in HighLevel.

## Update the site
1. Edit `src/config.js` — the single source of truth for tracks, collabs, globe cities, videos, tour, merch, links and stats.
2. `python3 build.py` → rebuilds `dist/cp-site.js` and `dist/index.html`.
3. Commit and push to `main`. It's live on the next page load.

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
