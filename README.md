# Smart_Operations_System# Smart Operations System (Internal)

A professional, full-stack operational management platform designed for internal organizational use. This system replaces public registration with an Admin-governed model to ensure high security and accountability for fast-growing startups.

## 🚀 Technical Stack
- **Frontend:** React.js, Tailwind CSS (Modern Corporate UI), Lucide React (Icons).
- **Backend:** Node.js, Express.js.
- **Database:** PostgreSQL/MySQL via Prisma ORM.
- **Security:** JWT (JSON Web Tokens) for session management, Bcrypt.js for one-way password hashing.

---

## 🔐 Role-Based Access Control (RBAC)

The system enforces a strict hierarchy to maintain data integrity and operational security:

| Feature | Admin | Manager | User |
| :--- | :---: | :---: | :---: |
| **Login Access** | ✅ | ✅ | ✅ |
| **User Creation (Add Member)** | ✅ | ❌ | ❌ |
| **User Management (Edit/Delete)** | ✅ | ✅ | ❌ |
| **Create Task** | ✅ | ❌ | ❌ |
 **Assign Tasks** | ✅ | ✅ | ❌ |
| **Task Tracking & Overview** | ✅ | ✅ | ✅ |
| **Update Own Task Status** | ✅ | ✅ | ✅ |

---

## 🧠 Engineering Decision Document (EDD)

### 1. Security Decision: Closed-Loop Registration
**Decision:** Removed the public "Sign Up" toggle from the landing page.
**Reasoning:** In a real-world enterprise environment, allowing anyone to register an account is a vulnerability. 
**Implementation:** I moved the registration logic into the `UserManagement` module. Only an authenticated **Admin** can create new accounts, assigning a name, email, role, and initial password. This ensures every user in the system is verified.

### 2. UX Decision: Seamless Admin Workflow
**Decision:** Implementing immediate JWT generation upon Admin-driven registration.
**Reasoning:** To reduce friction during onboarding, the backend returns an authentication token immediately after the Admin creates a new user. This confirms the account is "Live" and "Active" instantly in the system state.

### 3. Architecture Decision: Centralized State for Personnel
**Decision:** Combined "Add" and "Edit" functionality into a dynamic modal within the User Management hub.
**Reasoning:** This keeps the UI clean and reduces the number of routes. The system intelligently switches between `POST` (Register) and `PUT` (Update) based on whether a user object is currently selected for editing.

### 4. Database Design: Relational Integrity
**Decision:** Used Prisma ORM to define strict relationships between Users and Tasks.
**Reasoning:** Using a relational approach ensures that tasks cannot be assigned to non-existent users. By implementing a Delete function in the UI, I also ensured the backend handles potential orphan data gracefully.

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- A running PostgreSQL or MySQL instance

### 1. Backend Setup
1. Navigate to the `backend` directory.
2. Install dependencies: `npm install`.
3. Create a `.env` file:
   ```env
   DATABASE_URL="your_database_connection_string"
   JWT_SECRET="your_super_secret_key"
   PORT=5000