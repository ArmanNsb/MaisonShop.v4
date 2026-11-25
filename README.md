# Maison De La Fork — Shop page, Fork Monday edition

This package is the **shop page only** (`index.html`) with everything it uses, latest version (25 Nov 2026; see CHANGES.md for the members-first locked view and the review switch).
It replaces the shop page you put live before. The **product pages are not included**: you are building those.

It is plain HTML, CSS and JavaScript: no build step, no framework, nothing to install. All paths are relative.

> This is a design build. The bag (cart) is a stand-in kept in the visitor's browser (`localStorage`, key `mdlf-bag`);
> nothing is ordered or paid. Cart, prices, stock and checkout still need to be connected to the real store.

---

## 1. Putting it live

Upload the **contents** of this folder over the previous shop page, keeping the structure: `index.html` next to `assets/`.
Files with the same path replace the old ones. Two old images are no longer used and can be deleted (optional):
`assets/img/fm-pol-tables-d.jpg`, `assets/img/fm-pol-nursery-d.jpg`.

On GitHub: open the repository's **root**, *Add file → Upload files*, drop `index.html` **and** the `assets` folder
together, commit. (Uploading `assets` from inside `assets/` would create `assets/assets/…`.)

Make sure the server sends `.webp` as `image/webp` (most do).

---

## 2. What changed since the Holiday shop page

**New files**

| File | What it does |
|---|---|
| `assets/css/fm.css` | Fork Monday intro: calendar, fork, headline |
| `assets/css/fm-how.css` | "How it works" section and the navy members band |
| `assets/css/fm-cats.css` | Gold fork dividers between sections, polaroid/stamp styles |
| `assets/css/fm-shop.css` | Fork Monday product cards: two prices, "x of y left", sold-out state |
| `assets/js/fm.js` | Fork Monday intro: the paper lift, the calendar strip that glides from 26 to 30 Nov, the ring round the 30, the two-step headline on desktop |
| `assets/js/fm-cats.js` | Stock lines ("2 of 3 left"), bag limit, fork dividers, members band |
| `assets/img/fm/strip-ink.webp`, `strip-top.webp` | Calendar strip (desktop): printed gold days 26–30, small forks on the lines |
| `assets/img/fm/strip-ink-m.webp`, `strip-top-m.webp` | The same, cropped for phones |
| `assets/img/fm/paper-tile.jpg` | Seamless cotton paper that slides with the strip |
| `assets/img/fm/ring30.webp` | The printed gold ring round the 30 (revealed by a pen stroke) |
| `assets/img/fm/fork-d.webp`, `fork-d-shadow.webp`, `fork-m.webp`, `fork-m-shadow.webp` | The vintage fork and its shadow (multiply), desktop and phone |
| `assets/img/fm/cal-*-base.webp`, `cal-*-ring.webp` | Earlier calendar photos, kept as a fallback |
| `assets/img/fm/fork-cursor.png`, `fork-cursor-2x.png` | Fork-shaped pointer over the members band |
| `assets/img/fm-fork-divider.png` | Hand-drawn gold fork on the lines between sections |
| `assets/img/fm-*.jpg` | Photos on the Fork Monday cards |

**Changed files:** `index.html`, `assets/js/bag.js` (prices and new products in `CATALOG`), plus the shared
`shop.css`, `bag.css`, `header.css`, `shop.js`, `header.js` as included here.

Stylesheet / script order in `index.html` (keep it):

```html
<link rel="stylesheet" href="assets/css/shop.css">
<link rel="stylesheet" href="assets/css/bag.css">
<link rel="stylesheet" href="assets/css/header.css">
<link rel="stylesheet" href="assets/css/fm.css">
<link rel="stylesheet" href="assets/css/fm-cats.css">
<link rel="stylesheet" href="assets/css/fm-shop.css">
<link rel="stylesheet" href="assets/css/fm-how.css">
…
<script src="assets/js/shop.js"></script>     <!-- creates the bag store first -->
<script src="assets/js/fm.js"></script>
<script src="assets/js/fm-cats.js"></script>
<script src="assets/js/header.js"></script>
<script src="assets/js/bag.js"></script>
```

---

## 3. The page, top to bottom

1. **Fork Monday intro** (`<section class="intro">`). The blue paper with the oval window lifts on scroll to show a
   paper calendar strip with a vintage fork. The strip glides slowly between 26 and 30 Nov (all five days printed in gold);
   each time the 30 arrives a gold ring is drawn round it. On desktop, "Fork Monday" first stands alone above the strip;
   on the next scroll the headline "Our most special prices, once a year only." and "Save up to $2,500" rise under it as
   How it works comes in. On phones the three lines sit together. With "reduce motion" on, the strip rests on the 30
   with the ring shown.
2. **How it works** (`#fm-how`): three steps and the navy members band (Members first 26–27 Nov, Open to everyone
   28–30 Nov, **Create my profile**).
3. **Fork Monday sections**: `#fm-weddings` (Wedding Services), `#fm-tables` (Tables & Events), `#fm-cakes`
   (Custom Cakes), `#fm-nursery` (Maison Nursery), `#fm-towers` (Towers). Same layout as the shop sections.
4. **Shop sections**: `#sweets` (Persian Cookie), `#gifts` (Gift Box), `#compose` (Compose Your Own),
   `#gifting` (Tea & Gift Cards), then the story, service row and footer.

A gold fork sits on the line above each section from Wedding Services to Gift Box.

---

## 4. Product cards with a Fork Monday price

Every product in the campaign has, under its name:

```html
<article class="card fmcard ocard" data-total="5" data-left="5">
  …
  <p class="fmspots"><span class="ocard__left">5 of 5 left</span></p>
  <div class="card__meta">
    <span class="card__spec"><span class="card__price fmprice"><b>$105</b><s>$132</s></span></span>
    <span class="add add--sold ocard__sold">Sold out</span>
    <div class="buy" data-key="Abrisham Collection">…</div>
  </div>
</article>
```

- **Stock.** `data-total` = quantity for sale (from the client's sheet); `data-left` = what is left.
  `fm-cats.js` writes "**left of total left**" and, at 0, switches the card to **Sold out**.
  The bag will not take more than `data-left`. **To connect real stock, set `data-left` from the store** (or call the
  same logic after updating it). Today `data-left` equals `data-total`.
- **Prices.** `<b>` is the Fork Monday price (navy), `<s>` the regular price, shown first and struck through by hand in
  gold; both in the Dahlia face.
- **Labels.** Piece counts, "Gluten-free", "Vegan", "3 boxes", "12 cakes" stay above the prices; "Credit", "Tower",
  "Large" and "Small" are not shown.
- **Add.** On desktop "ADD" appears above the round button on hover; on phones only the button shows.
- Service items (Sofreh, tables, cakes, nursery) are bought as a **credit**. The terms are explained in How it works,
  not on each card.
- **Custom Cake** has a line under its name: "(Birthday, Anniversary, Bridal Shower)".

### Campaign data on the page

Prices are rounded down to whole dollars, as asked by the client (e.g. $105.60 → $105), so a few differ by cents from
the "Campaign Price" column of the sheet.

| Section | Product | Regular | Fork Monday | Qty |
|---|---|---|---|---|
| Wedding Services | Sofreh Aghd | $8,000 | $6,800 | 2 |
| | Destination Sofreh Aghd | $12,000 | $9,500 | 1 |
| | Wedding Cake | $3,500 | $2,900 | 2 |
| Tables & Events | Dessert Table | $8,000 | $6,800 | 2 |
| | Dinner Table | $5,000 | $3,900 | 1 |
| Custom Cakes | Custom Cake | $650 | $570 | 4 |
| Maison Nursery | Baby Shower | $8,000 | $6,800 | 2 |
| | Custom Birthday Cake | $1,000 | $850 | 3 |
| | One Sweet First Year | $1,800 | $1,260 | 2 |
| Towers | Madeleine Tower | $350 | $290 | 2 |
| | Toot Tower, Pomegranate | $230 | $190 | 2 |
| | Toot Tower, Pastel Almond | $230 | $190 | 2 |
| Persian Cookie | Abrisham Collection | $132 | $105 | 5 |
| | Diba Collection | $101 | $80 | 5 |
| | Pansy Cookie | $101 | $80 | 5 |
| | Noon Berenji | $112 | $89 | 5 |
| | Toot | $62 | $49 | 5 |
| | Pa-Derazi | $79 | $63 | 5 |
| | Walnut | $87 | $69 | 5 |
| | Coconut Macaroon | $87 | $69 | 5 |
| | Calisson | $72 | $57 | 5 |
| Gift Box | Special Gift Box | $300 | $255 | 3 |
| Tea & Gift Cards | Rumi Blend | $25 | $18 | 5 |

Not in the campaign (regular price, unchanged): Noon Berenji Pinkland (sold out), Compose Your Own boxes, Gift Card.

Each price also appears in `CATALOG` in `assets/js/bag.js` (the bag drawer reads it). Keep the two in step.

---

## 5. Links to product pages (yours to build)

Cards link to these addresses; create a page at each, or change the `href`s in `index.html` and the `url`s in
`CATALOG` (`bag.js`) to your own:

```
product-abrisham-collection.html   product-diba-collection.html   product-pansy-cookie.html
product-noon-berenji.html          product-noon-berenji-pinkland.html
product-toot.html                  product-pa-derazi.html          product-walnut.html
product-coconut-macaroon.html      product-calisson.html
product-special-gift-box.html      product-rumi-blend.html         product-gift-card.html
product-custom-small-box.html      product-custom-large-box.html
product-madeleine-tower.html       product-toot-tower.html  (both Toot Tower cards)
```

The Fork Monday service cards (Sofreh, tables, cakes, nursery) have **no link yet**. Their descriptions are in the
client's document; once you build those pages, link the cards (`card__media` and `card__name` in `index.html`) and
add a `url` to their `CATALOG` entries in `bag.js`.
`product-lattice-pie.html` and `product-pigeon-pie.html` are only linked from hidden Holiday cards still in the HTML.

---

## 6. Still to do / to confirm

- **Create my profile** button links to `#create-profile` (placeholder): set the real sign-up URL.
- **Members first (26–27 Nov)**: the page shows the locked members' view to visitors who are not signed in (see CHANGES.md).
  The store must tell the page who is a member (`window.FM_MEMBER`) and charge non-members the regular price.
- **Review switch**: remove `window.FM_REVIEW=true` from `index.html` and `product-sofreh-aghd.html` before launch.
- All Fork Monday cards now have photos (4:3).
- Client notes still open in the sheet: Pinkland restock.
- The bag's note about items "priced on confirmation" still says "Holiday"; it only shows when such an item is in the bag.

---

## 7. Notes

- Breakpoints: phones ≤ 900 px use the phone layout and the phone calendar photo; desktop from 901 px.
- Hover effects (fork pointer, ADD label, photo close-ups) only apply with a mouse.
- `window.FM_EDIT` / `window.FM_STATES` are review switches used only in the design preview and editor files; they are
  off on the real page. Nothing to do.
- External: the KoHo font from Google Fonts; links to maisondelafork.com, social networks and press.
