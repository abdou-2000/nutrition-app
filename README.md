# Nutrition App Backend

## Setup

1. Install dependencies
   ```bash
   cd backend
   npm install
   ```
2. Configure environment variables in `backend/.env`
   - `DATABASE_URL` for MySQL connection
   - `JWT_SECRET` for token signing
3. Run migrations
   ```bash
   npx prisma migrate deploy
   ```
4. Start the server
   ```bash
   npm run dev
   ```

## Folder structure
- `backend/src/controllers` – route handlers
- `backend/src/routes` – API routes
- `backend/src/middlewares` – authentication & validation
- `backend/src/validators` – Joi schemas
- `backend/prisma` – Prisma schema

## Roles
- **admin** – gestion des utilisateurs et contenus
- **nutritionist** – crée programmes, plats et conseils
- **client** – suit des programmes et interagit

## Testing with Postman
Import `backend/postman_collection.json` in Postman and set `{{baseUrl}}` to your server URL.
