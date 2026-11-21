# Improvement log

One small improvement per day, each delivered as its own pull request. Newest first.
Check this list and the open pull requests before picking the next one.

Feature pull requests don't edit this file (when several were open, each adding a row at the
top of the table made them conflict with one another); rows are added together in a separate
log update instead.

| Date | Improvement | Repo |
| ---- | ----------- | ---- |
| 2026-11-20 | Promo codes at checkout (`SAVE10` 10% off, `WELCOME5` $5 off $25+): Apply/Remove in the order summary; the discount is worked out and charged on the server, and saved on the order | shop-frontend + shop-backend |
| 2026-11-19 | Automated tests for Save for later (13 end-to-end tests: quantity kept, 10-item cap, privacy, checkout leaves saved items alone) | shop-backend |
| 2026-11-18 | Sign-in protection: after 5 wrong passwords in 15 minutes an email is locked for 15 minutes (429 + Retry-After) | shop-backend |
| 2026-11-15 | Continuous integration: GitHub Actions installs, tests and builds every pull request | shop-frontend + shop-backend |
| 2026-11-14 | Accessibility fixes from an axe scan (cart link name, heading order, sign-in landmark), a Skip to main content link, and `useDemoAccount` renamed to `fillDemoAccount` | shop-frontend |
| 2026-11-12 | Cancel order: from Your Orders or the order page, with an in-page confirm step and simulated refund; cancelled orders are marked | shop-frontend + shop-backend |
| 2026-11-11 | Frontend unit tests (`npm test`, Vitest): card validation, input formatters, prices, discounts and dates | shop-frontend |
| 2026-11-10 | Automated backend tests (`npm test`): card validation, simulated payments, and the checkout API end to end | shop-backend |
| 2026-11-09 | "Your recently viewed items" row on the home page (last 8 products opened, Clear history; kept in this browser and cleared on sign out) | shop-frontend |
| 2026-11-08 | Save for later: move cart items to a saved list (quantity kept), then Move to cart or Delete; stored in the database | shop-frontend + shop-backend |
| 2026-10-21 | "About this item" highlights on every product page (3–5 points per product, stored in the database) | shop-frontend + shop-backend |
| 2026-10-16 | Product details page: big image, price and savings, rating, quantity, Add to Cart and Buy Now; product names link to it from the grid and cart | shop-frontend |
