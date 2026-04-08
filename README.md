# Smart Operations System (Internal)

A professional, full-stack operational management platform designed for internal organizational use. This system replaces public registration with an Admin-governed model to ensure high security and accountability for fast-growing startups.

---

## 🚀 Technical Stack

* **Frontend:** React.js, Tailwind CSS, Lucide React
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL (via Prisma ORM)
* **Authentication:** JWT (JSON Web Tokens)
* **Security:** Bcrypt.js for password hashing

---

## 🔐 Role-Based Access Control (RBAC)

| Feature                       | Admin | Manager | User |
| ----------------------------- | :---: | :-----: | :--: |
| Login Access                  |   ✅   |    ✅    |   ✅  |
| User Creation (Add Member)    |   ✅   |    ❌    |   ❌  |
| User Management (Edit/Delete) |   ✅   |    ✅    |   ❌  |
| Create Task                   |   ✅   |    ❌    |   ❌  |
| Assign Tasks                  |   ✅   |    ✅    |   ❌  |
| Task Tracking & Overview      |   ✅   |    ✅    |   ✅  |
| Update Own Task Status        |   ✅   |    ✅    |   ✅  |

---

## 🔑 Demo Credentials

Use the following accounts to test the system:

### 👑 Admin

* **Email:** [admin@gmail.com](mailto:admin@gmail.com)
* **Password:** admin@123

### 🧑‍💼 Manager

* **Email:** [manager@gmail.com](mailto:manager@gmail.com)
* **Password:** manager@123

### 👤 User

* **Email:** [user@gmail.com](mailto:user@gmail.com)
* **Password:** user@123

---

## 🧠 Engineering Decision Document (EDD)

### 1. Security Decision: Closed-Loop Registration

**Decision:** Removed public signup.
**Reason:** Prevent unauthorized access.
**Implementation:** Only Admin can create users from the dashboard.

---

### 2. UX Decision: Seamless Admin Workflow

**Decision:** Instant JWT after user creation
**Reason:** Immediate activation without extra login step

---

### 3. Architecture Decision: Centralized User Management

**Decision:** Combined Add/Edit into one modal
**Reason:** Cleaner UI, fewer routes, better maintainability

---

### 4. Database Design: Relational Integrity

**Decision:** Prisma relational models (User ↔ Task)
**Reason:** Prevent orphan records and ensure valid assignments

---

## 🛠️ Installation & Setup

### Prerequisites

* Node.js (v16+)
* PostgreSQL installed and running

---

### 🔹 Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/System_db"
JWT_SECRET="your_secret_key"
PORT=7000
```

Run Prisma:

```bash
npx prisma generate
npx prisma db push
```

Start server:

```bash
npm run dev
# or with PM2
pm2 start index.js --name smart-ops
```

---

### 🔹 Frontend Setup

```bash
cd frontend
npm install
npm run build
```

---

## 🌐 Deployment (VPS)

* Backend runs on: `http://31.97.230.36:7000`
* Frontend is served via Express static middleware
* API base URL:

```js
baseURL: '/api'
```

---

## ⚠️ Important Notes

* Do NOT use `localhost` in frontend API calls (use `/api`)
* Ensure PostgreSQL credentials are correct
* Restart PM2 after any changes:

```bash
pm2 restart smart-ops
```

---

## 📌 Features Summary

* Secure Admin-controlled system
* Task assignment & tracking
* Role-based dashboards
* JWT authentication
* Production-ready deployment

---

## 👨‍💻 Author

Built as a full-stack assignment project demonstrating:

* Backend architecture
* Secure authentication
* Database design
* VPS deployment

---

## 🚀 Future Improvements

* Add notifications system
* Role-based dashboards UI improvements
* Analytics & reporting
* Docker deployment

---
