# Maison De La Fork — Shop redesign (static front end)

A static front end for the Maison De La Fork online shop: the shop page, which opens with the Fork Monday (Cyber Monday, Nov 30) intro and offers, and one
page for each product. It is plain HTML, CSS and JavaScript. There is **no build step, no framework and no package to
install**: copy the folder to a web server and it works.

> **Important: this is a design build, not a working store.** The bag (cart) is a stand-in kept in the visitor's own
> browser. Nothing is ordered or paid for. Before it can take orders it has to be connected to the real store
> (WooCommerce on maisondelafork.com) for cart, prices, stock, checkout and payment. See
> [Connecting to the store](#connecting-to-the-store).

---

## Contents

1. [What is in the folder](#what-is-in-the-folder)
2. [Putting it on a server](#putting-it-on-a-server)
3. [Pages](#pages)
4. [How it works](#how-it-works)
5. [Editing content](#editing-content)
6. [Connecting to the store](#connecting-to-the-store)
7. [Browser support, accessibility, performance](#browser-support-accessibility-performance)
8. [Before launch: checklist](#before-launch-checklist)
9. [Product content to confirm](#product-content-to-confirm)

---

## What is in the folder

```
index.html                         the shop page (Fork Monday intro and offers, Persian Cookie, Gift Box, Compose Your Own, Tea & Gift Cards)
product-<slug>.html                one page per product (21 pages, listed below)
product.html                       an old address; forwards to product-abrisham-collection.html
product_content_manifest.json      where each product's copy came from, and what still needs confirming
README.md                          this file
.nojekyll                          only for GitHub Pages (lets it serve the files as they are); harmless elsewhere

assets/
  css/
    shop.css                       styles for index.html
    product.css                    styles shared by every product page
    header.css                     the compact header that slides in on scroll-up (every page)
    bag.css                        the bag drawer (every page)
    fm.css                         index.html: the Fork Monday intro (calendar photo, gold ink, headline)
    fm-cats.css                    index.html: the Fork Monday offer categories (accordions, polaroids, offer rows)
  js/
    shop.js                        index.html: the bag store, product cards, choice pickers, the Holiday intro
    product.js                     product pages: the bag store, gallery, quantity, sticky "Add to cart" bar
    header.js                      the compact header (every page)
    bag.js                         the bag drawer (every page)
    fm.js                          index.html: Fork Monday intro (photo placement, marker ring and handwriting drawn by hand)
    fm-cats.js                     index.html: Fork Monday categories (open/close, spots left, bag limit)
  img/                             photos and artwork (about 24 MB)
    bag/                           small square thumbnails used in the bag drawer
    fm/                            Fork Monday intro: calendar photos (desktop, phone) and the gold ink layers
    fm-pol-<category>-d/-m.jpg     Fork Monday polaroids: square for desktop, 3:2 for phones
  fonts/
    dahlia.otf                     Dahlia, the display typeface (headings)
```

Every page loads, in this order:

```html
<link rel="stylesheet" href="assets/css/shop.css">      <!-- or product.css on product pages -->
<link rel="stylesheet" href="assets/css/bag.css">
<link rel="stylesheet" href="assets/css/header.css">
...
<script src="assets/js/shop.js"></script>               <!-- or product.js -->
<script src="assets/js/header.js"></script>
<script src="assets/js/bag.js"></script>
```

The order of the scripts matters: `shop.js` / `product.js` create the bag store that the other two use.

All paths are **relative**, so the site works at the root of a domain, in a sub-folder (e.g. `/shop/`) or on a test domain
without changes.

**External resources** (the only things not in the folder):
- the **KoHo** typeface from Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`), used for all body text;
- links out to maisondelafork.com (menu, footer, contact), social networks and press articles.

---

## Putting it on a server

### Any web server (Apache, Nginx, IIS, a CDN or static host)

1. Upload the **contents** of the folder (not the folder itself) to the web root or to the sub-folder you want, keeping
   the structure exactly as it is. `index.html` must sit next to the `assets` folder.
2. Open the address in a browser. That is all: there is nothing to compile, install or configure.

Recommended server settings (all optional, the site works without them):

- **HTTPS.**
- **Compression** (gzip or Brotli) for `.html`, `.css`, `.js`, `.json`, `.svg`. The CSS and HTML compress very well.
- **Caching.** Images and fonts can be cached for a long time (e.g. 30 days). Keep HTML short (or `no-cache`) so content edits
  show up at once. CSS and JS files are not versioned by name, so give them a short cache (e.g. 1 hour) or add a version to
  their links when you change them (`assets/css/shop.css?v=2`).
- **MIME types.** Make sure `.webp` is served as `image/webp` and `.otf` as `font/otf` (most servers already do).

Example for **Nginx**:

```nginx
location ~* \.(jpg|jpeg|png|webp|svg|otf)$ { expires 30d; add_header Cache-Control "public"; }
location ~* \.(css|js)$                   { expires 1h; }
location ~* \.html$                         { add_header Cache-Control "no-cache"; }
gzip on;
gzip_types text/css application/javascript application/json image/svg+xml;
```

Example `.htaccess` for **Apache**:

```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access plus 30 days"
  ExpiresByType image/png  "access plus 30 days"
  ExpiresByType image/webp "access plus 30 days"
  ExpiresByType font/otf   "access plus 30 days"
  ExpiresByType text/css   "access plus 1 hour"
  ExpiresByType application/javascript "access plus 1 hour"
</IfModule>
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml
</IfModule>
AddType image/webp .webp
AddType font/otf .otf
```

### GitHub Pages

Upload the contents of the folder to the root of a repository (include the hidden `.nojekyll` file), then
**Settings → Pages → Deploy from a branch → `main` / `(root)`**. The site appears at
`https://<user>.github.io/<repository>/` after a minute.

### Running it on your own computer

```
cd path/to/this/folder
python3 -m http.server 8000
```

then open http://localhost:8000. Double-clicking `index.html` also works.

---

## Pages

| File | What it is |
|---|---|
| `index.html` | The shop page. Sections in order: Fork Monday intro, the Fork Monday categories (`#fm-weddings`, `#fm-tables`, `#fm-cakes`, `#fm-nursery`, `#fm-towers`), Persian Cookie (`#sweets`), Gift Box (`#gifts`), Compose Your Own (`#compose`), Tea & Gift Cards (`#gifting`), the Maison story, service row, footer. |
| `product-<slug>.html` | One page per product: gallery, name, price, description, choice (where there is one), quantity and Add to cart (or Enquire), size / allergens / delivery, related products. |
| `product.html` | Old address of the first sample page; redirects to `product-abrisham-collection.html`. Keep it so old links still work. |

The 21 product pages are listed, with their status, in [Product content to confirm](#product-content-to-confirm).

---

## How it works

### The bag (cart) — `window.MDLFBag`

Defined at the top of `shop.js` and `product.js` (the same code in both). It keeps the bag as `{ "line name": quantity }` in the
browser's `localStorage` under the key **`mdlf-bag`**, so it survives page changes and reloads, **in that browser only**.

```js
MDLFBag.get(name)          // quantity of a line (0 if not in the bag)
MDLFBag.set(name, qty)     // set a quantity (0 removes the line); repaints everything that listens
MDLFBag.on(fn)             // fn(name) is called after every change
MDLFBag.items()            // a copy of the whole bag
MDLFBag.total()            // number of pieces in the bag
```

A product with a choice is **one line per choice**, named `Product · Choice` (with a middle dot), e.g. `Lattice Pie · Apple`,
`Noon Berenji · Botanical`. The header bag shows the total with an ochre badge.

Everything else in the interface (cards, product pages, drawer, header) only talks to the bag through these five functions, so
connecting the real cart means replacing this one object (see [Connecting to the store](#connecting-to-the-store)).

### Shop page cards (`index.html`, `shop.js`)

Each product is a plain `<article class="card">` in the HTML: photo, a close-up shown on hover (`*-d.jpg`), name, a note or a
choice, the price, and the add button.

- **Add button.** A blind-embossed circle with a plus. Adding turns it into an ochre wax seal with the quantity on it, with small
  plus / minus buttons beside it. Back at zero the emboss returns. The photo shows an "In bag" tag.
- **Choices** (Lattice Pie: Pumpkin / Berries / Apple; Pigeon Pie: Chicken / Turkey; Toot Tower: Pomegranate / Pastel Almond;
  Noon Berenji: Botanical / Yamatsu Red Roses / Portuguese Vintage Tile). A small picker in place of the card's note opens a
  menu. The first option is pre-selected, so Add always works in one tap. Keyboard: arrows, Enter, Escape.
- **Phone-only copies.** Four cards in the Holiday Collection (Lattice Pie, Pigeon Pie, Special Gift Box, Madeleine Tower)
  appear twice in the HTML: once inside the intro's grid (desktop) and once, marked `class="card m-only"`, in the grid that
  follows it (phones). Only one copy is ever visible. **When you edit one, edit both.**
- **Special Gift Box** is shown both in the Holiday Collection and under Gift Box. It is the same product (one bag line).

### Product pages (`product.js`)

Each page names its product on the `<body>`:

```html
<body data-product="Walnut">
```

`product.js` uses that name as the line in the bag, so it must match the name used on the shop page and in `bag.js`.

- Gallery with thumbnails (desktop) or swipe and dots (phones), arrows and keyboard.
- Quantity stepper and **Add to cart**; a slim bar with the product and **Add to cart** follows the visitor once the main button
  has scrolled out of view (phones).
- Pages with a choice (Lattice Pie, Pigeon Pie, Noon Berenji, Toot Tower) have a native `<select id="pdp-option">`, dressed as a
  designed menu by a small script **inside that page** (marked `/* this page only */`). The `<select>` stays the source of truth.
  On Lattice Pie and Pigeon Pie each choice has its own description and allergens (`window.PDP_OPTS` in the page); on Noon Berenji
  and Toot Tower the choice turns the gallery to the matching photo.
- Holiday products (Lattice Pie, Pigeon Pie, Toot Tower, Madeleine Tower, Green Bean Casserole, Rainbow Potato Gratin) show
  **Enquire about this item** (to the contact page) instead of Add to cart, while prices and ordering are being confirmed.
- Gift Card and the two Compose Your Own boxes link to the live site, where they are personalised and paid.

### Compact header (`header.js`, `header.css`)

`header.js` copies the page's own header into a fixed bar at the top of the window. Scrolling **down**, it stays out of the way;
scrolling **up** a little, it slides down with the logo, menu and bag (its count kept in step), so the bag is always one small
scroll away. On the shop page it only starts after the Holiday intro; on product pages, once the normal header has scrolled out of
view. It holds still while the bag drawer is open. Because it is a copy, any change to the page's header appears in it too.

### Bag drawer (`bag.js`, `bag.css`)

A drawer slides in from the right on every page.

- **Hover** over the bag icon (mouse only): it peeks in, and goes again when the pointer leaves both the icon and the drawer.
- **Click / tap** the bag icon: it opens and stays. The page behind dims under a warm navy shade and stops scrolling; focus stays
  inside; Escape, the close button, a click on the shade or "Continue shopping" closes it.
- **Something new is added**: it peeks in with that line highlighted and steps back after about 4 seconds (unless the pointer or
  focus is inside it).

Each line shows a thumbnail, the name, the choice, a quantity stepper, Remove and the line price. The foot shows the subtotal.
Products whose price reads "Price to come" are left out of the subtotal, and a note says so.

The drawer needs to know each product's page, thumbnail and price. That information is in the **`CATALOG`** object at the top of
`bag.js`:

```js
"Walnut": { "url": "product-walnut.html", "img": "assets/img/bag/walnut-c-d.jpg", "price": "$87", "note": "24 pieces" },
```

Keep it in step with the cards. **Checkout** is not connected yet: it only shows a short note.

### Fork Monday (`fm.js`, `fm-cats.js`)

The page opens on the same paper, oval window, crest and cupid. Scrolling lifts the paper onto a photographed calendar
strip with a silver fork; the 30 is circled in gold marker and "Fork Monday" is handwritten, both drawn stroke by stroke at
hand speed. The headline reads "Our rarest prices, one day only" / "Save up to $3,750" / "10–15% off weddings, tables & cakes".
Scrolling on leads into five categories, closed by default: each shows a polaroid and opens on click to its offers. Credit
offers show "You pay / You get"; other offers show the struck regular price. Spots left are shown, and the bag will not take
more than the spots left. With "reduce motion" on, the ink appears at once.

Still to confirm with the client: prices marked "to be confirmed", credit terms and expiry, the campaign timing, and the
Special Order section at the end of the page.

### Holiday intro (older, `shop.js`, "Holiday intro" section; no longer shown)

The shop page opens on a sheet of brand-blue paper with an oval window onto the Toot Tower, the crest printed around it. The
visitor's scroll lifts the paper; the page then rests on a short introduction (the tower stays, a bauble rolls in against its bowl,
the text and order dates appear); one more scroll brings up the Holiday Collection grid. Scrolling up returns step by step.
The tower never moves or changes size between the stages on desktop; on phones it glides into its tile in the grid.

The artwork is in `assets/img`: `paper-tile.jpg`, `paper-window.png`, `paper-shadow.png`, `frame-print2.png` (desktop) and
`frame-print-m.png` (phones), `maison-line.png`, `title-main.png` / `title-main-2.png`, `cupid-print.png`, `tower-*`,
`hol-ornament*`. With "reduce motion" switched on in the visitor's system, the grid is shown directly, without the animation.

### Breakpoints

Phones up to **640 px**; tablets **641–900 px** (some grids switch at 860 px); desktop from **901 px**. Hover effects only apply on
devices with a mouse; on touch screens the controls keep a 44 px touch area.

---

## Editing content

There is no admin panel or template: content is edited directly in the HTML.

**Change a price.** A product's price appears in several places; change all of them:
1. its card in `index.html` (`<span class="card__price">`), **twice** for the four phone-only copies listed above;
2. its own product page: the price under the name (`buyc__price`) and the sticky bar at the bottom (`sbar__t`);
3. related-product cards on other product pages (search the HTML files for the product's page name, e.g. `product-walnut.html`);
4. `CATALOG` in `assets/js/bag.js`.

**Change a name.** As above, and also the `data-product="…"` on its product page's `<body>` and the `data-key="…"` on its card's
add button in `index.html`. Bags saved under the old name keep it until emptied.

**Change a photo.** Replace the file in `assets/img` with one of the same name and proportions. Each card photo has a close-up
for hover with `-d` added to its name (e.g. `walnut-c.jpg` and `walnut-c-d.jpg`): replace both. The drawer uses a 192 × 192 px
square copy in `assets/img/bag/`.

**Add a product.** Copy an existing card in `index.html` and a similar product page, change the text, links, photos and
`data-product`, and add an entry to `CATALOG` in `bag.js`.

**Header and footer.** They are repeated in every HTML file. A change has to be made in all 22 pages (search and replace), or the
pages moved into the store's own templates.

---

## Connecting to the store

The quickest route is to keep this front end and replace the bag store with calls to WooCommerce:

1. Replace `window.MDLFBag` (top of `shop.js` and `product.js`) with an object that has the same five functions (`get`, `set`,
   `on`, `items`, `total`) but reads and writes the WooCommerce cart (for example through the WooCommerce Store API,
   `/wp-json/wc/store/v1/cart`). Map each line name (`Product · Choice`) to a product and variation ID.
2. Point **Checkout** in `bag.js` (`.js-checkout`) to the store's checkout page.
3. Take prices, stock and "sold out" from the store rather than the HTML (or render these pages from WooCommerce templates using
   the same markup and CSS).
4. Wire up **Search**, the **account** icon and the **newsletter** form in the footer (currently not connected).

Alternatively, the HTML, CSS and JS can be moved into a WordPress theme; all class names are self-contained and the CSS does not
depend on any framework.

---

## Browser support, accessibility, performance

- **Browsers:** current Chrome, Safari (macOS and iOS), Firefox and Edge. Uses modern CSS (grid, `inset`,
  `aspect-ratio`) and plain ES2017 JavaScript. Internet Explorer is not supported.
- **Accessibility:** buttons and links are real `<button>` / `<a>` elements with labels; the choice menus are listboxes over native
  selects; the bag drawer is a dialog that holds focus and closes with Escape; animations are switched off for visitors who ask
  their system to reduce motion; touch targets are at least 44 px.
- **Performance:** no frameworks; each product page is about 15 KB of HTML plus shared CSS/JS that the browser caches.
  Images are the bulk (about 24 MB in total, loaded lazily as the visitor scrolls). Before launch it is worth compressing them:
  the largest are `frame-print2.png` (2 MB), `title-main.png`, `title-main-2.png`, `paper-window.png` and the 1000 × 1250 px
  product gallery photos; lossless PNG optimisation and WebP versions would cut the total considerably.

---

## Before launch: checklist

- [ ] Connect the bag, Checkout, Search, account and newsletter to the store (see above).
- [ ] Confirm the product content flagged below: prices (several Holiday items say "Price to come"; check that **Madeleine
      Tower $35** is right), contents, allergens, availability.
- [ ] Holiday order-by dates on the shop page (Thanksgiving Nov 23, Christmas Dec 18).
- [ ] Main Course I–III and Side Dish I–II in the Holiday Collection are placeholders (no page, no price, no add button).
- [ ] Compress images (see Performance).
- [ ] Check that the licence for the **Dahlia** typeface covers web use.
- [ ] Add page metadata for sharing (Open Graph image and description) if wanted; titles and meta descriptions are already set.
- [ ] Set up HTTPS, compression and caching on the server.

---

## Product content to confirm

`product_content_manifest.json` records, for each product, where its copy came from and what still needs a decision.

| Page | Category | Status | To confirm |
|---|---|---|---|
| [Lattice Pie](product-lattice-pie.html) | Holiday Collection | `price_tbd` | Copy from client (Nov 2026). Price TBD. |
| [Pigeon Pie](product-pigeon-pie.html) | Holiday Collection | `price_tbd` | Copy from client (Nov 2026). Price TBD. |
| [Toot Tower](product-toot-tower.html) | Holiday Collection | `preview_sale` | Price $230 from client (Nov 2026). Height on page still from the historic listing (approx. 10 in). |
| [Madeleine Tower](product-madeleine-tower.html) | Holiday Collection | `preview_sale` | Price $35 and size 7 × 15 in from client (Nov 2026). |
| [Pansy Cookie](product-pansy-cookie.html) | Persian Cookie | `normal` |  |
| [Noon Berenji](product-noon-berenji.html) | Persian Cookie | `normal` | The client description is specifically Botanical; other pattern options are shown in the original site, but do not have separate verified copy. |
| [Noon Berenji, Pinkland](product-noon-berenji-pinkland.html) | Persian Cookie | `sold_out` |  |
| [Toot](product-toot.html) | Persian Cookie | `normal` |  |
| [Pa-Derazi](product-pa-derazi.html) | Persian Cookie | `normal` |  |
| [Walnut](product-walnut.html) | Persian Cookie | `normal` | Contains dairy and nuts per official listing. |
| [Coconut Macaroon](product-coconut-macaroon.html) | Persian Cookie | `normal` |  |
| [Calisson](product-calisson.html) | Persian Cookie | `normal` | Official listing: refrigerate airtight and enjoy within six weeks. |
| [Special Gift Box](product-special-gift-box.html) | Assortments | `normal` | The official product detail page could not be fetched; only the product name/price and the three-box label in the redesign are verified. No contents or allergens invented. |
| [Abrisham Collection](product-abrisham-collection.html) | Assortments | `normal` |  |
| [Diba Collection](product-diba-collection.html) | Assortments | `normal` |  |
| [Rumi Blend](product-rumi-blend.html) | Tea & Gift Cards | `normal` |  |
| [Gift Card](product-gift-card.html) | Tea & Gift Cards | `external` |  |
| [Custom Small Box](product-custom-small-box.html) | Compose Your Own | `external` | Official site examples per row: Pansy 9, Rice 8, Pa-Derazi 4, Walnut 4, Coconut 5. |
| [Custom Large Box](product-custom-large-box.html) | Compose Your Own | `external` | Official site examples per row: Pansy 12, Rice 12, Pa-Derazi 8, Walnut 6, Coconut 5. |
| [Green Bean Casserole with Brie](product-green-bean-casserole-with-brie.html) | Holiday Collection | `price_tbd` | Copy from client (Nov 2026). Price TBD. |
| [Rainbow Potato Gratin](product-rainbow-potato-gratin.html) | Holiday Collection | `price_tbd` | Copy from client (Nov 2026). Price TBD. |

Status: `normal` regular product; `price_tbd` price not set yet; `preview_sale` seasonal item shown ahead of confirmation;
`sold_out` shown as sold out; `external` personalised and paid on the live site.
