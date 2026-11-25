# Fork Monday shop page — update 10 (25 Nov 2026)

Changes on top of the full package you have (`maison-shop-fork-monday-final.zip`, 24 Nov).
Upload the **contents** of this folder over it, keeping the structure (`index.html` next to `assets/`).
Files with the same path replace the old ones.

## Updated files (replace)
- `index.html`
- `assets/css/shop.css` (card names a step larger)
- `assets/css/fm-cats.css`, `assets/css/fm-shop.css`
- `assets/js/fm-cats.js`, `assets/js/bag.js`

## New files (add)
- `product-sofreh-aghd.html` — the **sample** Fork Monday service page (Sofreh Aghd). Its card on the shop links to it.
  The other eight services have no page yet and their cards are not linked.
- `assets/css/product.css`, `assets/js/product.js` — the product-page styles and script (the same ones your product pages
  use; this copy also has the larger card names). If you already have them on the server, replace them.
- `assets/css/fm-pdp.css`, `assets/js/fm-pdp.js` — Fork Monday additions for the service page.
- `assets/img/fm-pdp-sofreh-aghd.jpg` — its photograph.

## What changed

### Members first (26–27 Nov): the locked view
On 26 and 27 Nov the Fork Monday prices are for members only. A visitor who is **not signed in** now sees, on every
Fork Monday card and on the service page:
- a light panel with **Members price**, the members' price with a gold padlock, "x of y left", "Save $…" and
  **Sign in or create a profile** (the whole panel links to the sign-up);
- under it the **Regular price** with its + : the price they can buy at today;
- pressing + first shows a small note ("Members pay $… · Sign in or create a profile · Continue at $…").

Members see the cards as before (Fork Monday price, regular price struck through).

**What the page needs from the store:**
1. Set `window.FM_MEMBER = true` for a signed-in member (before `fm-cats.js` runs). Without it the visitor gets the
   locked view until 28 Nov 00:00 Los Angeles time, after which everyone sees the Fork Monday prices.
   (`window.FM_GUEST = true/false` forces either view.)
2. A visitor who is not a member must be **charged the regular price**. The bag in this build still shows the
   Fork Monday price; the real cart has to apply the right price.
3. "x of y left" counts the members' price only; buying at the regular price should not take from it.
4. All "Sign in or create a profile" links point to `#create-profile`: set the real sign-in / sign-up URL.

### Review switch (remove before launch)
`index.html` and `product-sofreh-aghd.html` start with
`<script>window.FM_REVIEW=true …</script>`. It shows a small **Visitor: Not a member / Member** switch at the bottom
left, so the client can review both views. **Delete that line (or set it to false) before the campaign goes live.**

### Other
- Card names a step larger, across the site.
- Prices: the regular price in navy; "Add" appears only when the + itself is pointed at.
- Copy and photos as agreed on 24 Nov (already in your package) are unchanged.
