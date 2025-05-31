# 📰 Blog API Backend – MERN Stack

This is a **Node.js + Express.js** backend API for a blog platform. It includes full CRUD operations, user authentication with **JWT**, secure password hashing with **argon2**, file uploads, input validation, and testing.

---

## 📦 Tech Stack

- **Node.js** – server runtime
- **Express.js** – backend web framework
- **MongoDB** – NoSQL database
- **Mongoose** – ODM for MongoDB
- **argon2** – password hashing
- **jsonwebtoken (JWT)** – token-based authentication
- **multer** – file/image uploads
- **express-validator** – validation middleware
- **dotenv** – environment variable manager
- **Jest + Supertest** – testing framework

---

## 📁 Project Structure

```
.
├── controllers/         # Business logic (users/posts)
├── models/              # Mongoose schemas
├── utils/               # Middlewares: auth, validation
├── uploads/             # Uploaded image files
├── tests/               # Jest/Supertest tests
├── .env                 # Environment configuration
├── seed.js              # Demo data seeder
├── jest.config.cjs      # Jest configuration
├── index.js             # Entry point
└── package.json
```

---

## ✅ Features

- Secure user registration and login with **argon2** password hashing
- JWT-based authentication with token validation
- CRUD for blog posts with ownership checks
- Protected image upload route
- Server-side input validation
- MongoDB seeding with demo user/posts
- Unit & integration tests for key endpoints

---

## ⚙️ Setup Instructions

### 1. Clone the repo and install packages

```bash
git clone https://github.com/rubaka-pl/blog-mern
cd blog-api
npm install
```

### 2. Create a `.env` file

```env
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
NODE_ENV=development
```

---

## 🌱 Seed Demo Data

This will **wipe all users/posts** and create:

- 1 demo user (`demo@example.com`, password: `123456`)
- 2 test posts

```bash
npm run seed
```

> ⚠️ Warning: This will delete all current data.

---

## 🧪 Run Tests

```bash
npm test
```

Covers:

- Auth (login, register, access)
- Posts (fetch, create, unauthorized access)
- Uploads (401 without token, 200 with)

---

## 🔐 Auth Routes

- `POST /auth/register` – create user
- `POST /auth/login` – receive token
- `GET /auth/me` – check token

---

## ✍️ Post Routes

| Method | Endpoint          | Description                    |
|--------|-------------------|--------------------------------|
| GET    | `/posts`          | List all posts                 |
| GET    | `/posts/:id`      | Get one post (adds a view)     |
| POST   | `/posts`          | Create (auth required)         |
| PATCH  | `/posts/:id`      | Update (auth + ownership)      |
| DELETE | `/posts/:id`      | Delete (auth + ownership)      |

---

## 📤 Upload Route

```http
POST /upload
Headers: Authorization: Bearer <token>
Body: FormData with field "image"
```

Returns:

```json
{
  "url": "/uploads/your-image.jpg"
}
```

---

## 🔐 Security Notes

- Secrets like MongoDB URI and JWT key are stored in `.env` (excluded via `.gitignore`)
- Passwords are hashed with **argon2**
- Protected routes check `Bearer` token

---

## 📃 License

MIT – free to use, modify, and distribute.

---

Feel free to fork, improve, or use as a starter!
