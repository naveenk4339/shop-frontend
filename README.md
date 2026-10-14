# shop-frontend

React (Vite) UI for the shop. Talks to the [shop-backend](https://github.com/naveenk4339/shop-backend) API.

- **Login / register** – demo account `demo@shop.com` / `demo123`
- **Home** – add items to the cart, change quantities, see total items and total price
- **Checkout** – pay by card with validation (test card `4242 4242 4242 4242`; `4000 0000 0000 0002` is declined)
- **Order confirmation** – order ID, items, total items and approved amount

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
  cardValidation.js   card checks shown before paying
  pages/Login.jsx
  pages/Home.jsx
  pages/Checkout.jsx
  pages/OrderConfirmation.jsx
```
