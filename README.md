# shop-frontend

React (Vite) UI for the shop. Talks to the [shop-backend](https://github.com/naveenk4339/shop-backend) API.

Looks and works like a familiar online store:

- **Sign in / create account**, with a "Fill in demo account" button (`demo@shop.com` / `demo123`)
- **Header**: search box with category filter, account and Sign out, Returns & Orders, cart with item count
- **Departments bar**: All, Today's Deals, Grocery, Electronics, Home & Kitchen, Books
- **Product grid**: star ratings, review counts, deal badges with % off and list price, delivery date, Add to Cart; sort by price or rating
- **Product details**: click a product to see its price and savings, rating, "About this item" highlights, delivery date, quantity, Add to Cart and Buy Now
- **Cart page**: quantity dropdown (1–10), Delete, Remove all items, subtotal, Proceed to checkout
- **Checkout**: card payment with validation (test card `4242 4242 4242 4242`; `4000 0000 0000 0002` is declined), item review, order summary, Place your order
- **Order confirmation**: payment approved amount, order number, total items, item table
- **Your Orders**: every past order with View order details

Every button shows a text label.

## Run

Start **shop-backend** first (it listens on http://localhost:4000), then:

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Configuration

Copy `.env.example` to `.env` to change these:

| Variable       | Used when   | Default                 | Purpose                                    |
| -------------- | ----------- | ----------------------- | ------------------------------------------ |
| `BACKEND_URL`  | `npm run dev` | `http://localhost:4000` | Where the dev proxy sends `/api` requests |
| `VITE_API_URL` | build/deploy | empty (same origin)    | Full URL of the deployed backend           |

For a production build pointing at a hosted backend:

```bash
VITE_API_URL=https://api.example.com npm run build
```

Remember to allow the frontend's address in the backend's `CORS_ORIGIN`.

## Structure

```
src/
  api.js              calls to the backend
  CartContext.jsx     cart shared by every page and the header count
  cardValidation.js   card checks shown before paying
  format.js           prices, dates, discounts
  components/         Header, Layout, ProductCard, Price, Rating, QtySelect, Logo
  pages/              Login, Home, Product, Cart, Checkout, OrderConfirmation, Orders
```
