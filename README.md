# Michael's Stuff

A retro storefront for Michael's personal collection of games, consoles, coins, and historical finds.

The first implementation is a reviewable catalog preview. Payments, order placement, and live shipping quotes stay disabled until the seller's checkout and shipping details are configured.

## Run locally

Requires Node.js 20 or later. No packages or installation are needed.

```sh
npm run build
npm start
```

Open http://127.0.0.1:4173. The server listens on the local computer only.

```sh
npm test
```

## Build and publish

`npm run build` creates a static `dist/` folder suitable for GitHub Pages or another static host, including subdirectory hosting. Publishing is a separate step; no automatic deployment workflow is enabled. Google Fonts is the only external presentation dependency and has system-font fallbacks.

## Catalog and photographs

Edit `catalog.json`, then run the build. Keep IDs stable so saved stashes survive updates. `photos.json` indexes the supplied photographs. WebP files strip EXIF metadata and reduce transfer size. Original full-resolution photos remain in the user's supplied ZIP; they are not duplicated in this repository.

Each listing records its title, console, region, release year, category, photo filename, condition assumption, and dated price source. Games in shared shelf pictures have individual listings pointing to that shelf picture; featured handhelds have item crops. This is a transcription draft, not a verified physical stocktake. Repeated views are consolidated and stock defaults to one unconfirmed unit per distinct title/edition. Separate discs for multi-disc titles are not separate products.

Case/box shown means a complete-in-box **pricing assumption**, per the project owner's instruction. It does not certify a manual, all original contents, authenticity, a working battery, or functional testing. Storage clamshells around bare cartridges are still treated as loose.

Release years with `releaseYearStatus: "Source checked"` are backed by a linked source. Other years are draft metadata that should be verified for the precise regional edition. Coins and historical items have honest empty categories because no corresponding inventory photos were supplied.

## Pricing

Prices are USD. Store money as integer cents. The pricing rule is exactly `market × 1.05`, rounded to the nearest cent with half-cent ties rounded up. `core.mjs` contains the shared rule, and the build recalculates storefront prices from `marketCents`.

References come from PriceCharting's sold-sales-based price guides, with loose or complete values selected as appropriate. A source match is not an authentication or condition appraisal. An unmatched edition has a null price and displays **Price under review**, never $0 or an invented estimate. Refresh dated prices before opening sales.

## Stash and shipping

The browser saves a unique-item stash in local storage. Customers can download a plain-text selection, including pending-price items. This creates no order, stock reservation, or payment. Shipping and taxes are excluded from the priced subtotal, and unpriced items are explicitly counted separately.

USPS domestic and international options explain that destination, packed weight, dimensions, and service eligibility determine quotes. No flat rates or delivery promises are fabricated.

To enable commerce, supply the payment-provider preference, shipping origin ZIP/country, package weights and dimensions, seller contact details, stock/condition confirmations, destination policy, and approved return/tax policies. Implement a server-side catalog authority, inventory reservation, payment webhook verification, and USPS (or authorized postage provider) rate integration before accepting payment. Client-side values must not be trusted for an order total.

## Verification

Automated tests cover cents/markup rounding, missing prices, catalog IDs and photo existence, combined filters, price sorting, and cart integrity. Browser checks cover product details, combined search, region/decade filtering, domestic/international shipping text, empty-cart behavior, and responsive overflow.

The local handoff includes separate inventory and pricing research files for seller review. These internal research files are excluded from this public repository.
