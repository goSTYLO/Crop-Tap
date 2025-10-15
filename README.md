# Crop-Tap

A web-based eCommerce platform connecting local farmers with buyers. Backend built with Node.js/Express and MySQL (Sequelize). Frontend currently HTML/CSS/JS under `FRONT/`.

## Previous Project Status
- Backend API was working and tested in Postman
- Implemented domains:
  - Users: CRUD via `BACK/controllers/user_controller.js` and `BACK/routes/user_routes.js`
  - Products: Model + CRUD with image uploads (Multer + Sharp) via `product_controller.js`, `product_routes.js`, `middleware/uploadMiddleware.js`, `services/imageService.js`
  - Carts, Cart Items: Models + CRUD via `cart_controller.js`, `cartItem_controller.js`, and routes
  - Orders, Order Items: Models + CRUD and cart→order logic via `order_controller.js` and `services/businessService.js`
  - Payments: Model + CRUD (no Stripe integration yet)
- Server setup: `BACK/server.js` with middleware (cors, body-parser), Sequelize sync, and static `productImgs/`
- SQL schema available in `crop-tap.sql`

## Updates Made (This Session)
- Planning and Tasks
  - Parsed PRD from `.taskmaster/docs/crop-tap_prd.txt`
  - Generated 15 top-level tasks and expanded subtasks (Taskmaster)
  - Mapped codebase progress; marked completed tasks accordingly
- Authentication
  - Added `POST /auth/register` (secure password hashing stored in `users.password_hash`)
    - Files: `BACK/controllers/auth_controller.js`, `BACK/routes/auth_routes.js`
  - Added `POST /auth/login` issuing JWT tokens
    - Files: `BACK/controllers/auth_controller.js`, `BACK/routes/auth_routes.js`
  - Added JWT utilities middleware
    - `authenticate` and `authorize(roles)` in `BACK/middleware/authMiddleware.js`
  - Mounted `/auth` routes in `BACK/server.js`
- No breaking changes to existing routes; legacy endpoints remain intact

## Current API Map (Key)
- Users: `/users` (CRUD)
- Auth (new): `/auth/register`, `/auth/login`
- Products: `/products`
- Carts: `/carts`, Cart Items: `/cart-items`
- Orders: `/orders`
- Payments: `/payments` (Stripe not yet wired)

## Environment
Create `BACK/.env` with at least:
```
PORT=3000
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_pass
DB_NAME=crop_tap
JWT_SECRET=change_this_in_production
```

## Run
```
cd BACK
npm install
node server.js
```

## Quick Testing (Postman)
1. Register: `POST /auth/register`
   - Body (JSON): `{ "name":"Alice", "email":"a@ex.com", "password":"pass123", "role":"buyer" }`
2. Login (JWT): `POST /auth/login`
   - Body (JSON): `{ "email":"a@ex.com", "password":"pass123" }`
   - Response includes `accessToken`
3. Protected routes
   - Add header `Authorization: Bearer <accessToken>`
4. Products
   - `GET /products`
   - Create with image: `POST /products` (multipart form-data, field `image`)

## Next Suggested Work
- Integrate Stripe Payment Intents + webhook (Tasks 11–12)
- Apply `authenticate`/`authorize` to sensitive routes (admin/farmer areas)
- Frontend wiring for login/registration and product fetching (Tasks 15)

## Taskmaster
Tasks generated and tracked under `.taskmaster/` (tag: `master`). Major completed tasks include initialization, models & CRUD, images, cart/order flow, and new auth endpoints.
