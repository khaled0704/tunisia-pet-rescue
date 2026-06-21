# 🐾 Tunisia Pet Rescue

A full-stack web platform connecting stray animals with shelters and adoptive families across Tunisia.

> Built with the MERN stack — MongoDB, Express, React, Node.js

---

## 🌍 About

Tunisia Pet Rescue is a community-driven platform that allows:
- **Visitors** to browse adoptable animals, report strays, and find nearby shelters
- **Shelters & NGOs** to manage their animal listings and process adoption requests
- **Admins** to verify shelters and moderate the platform

---

## ✨ Features

- 🐶 **Animal Listings** — Browse animals by species, age, health status, and location
- 📍 **Shelter Directory** — Find verified shelters and NGOs across Tunisia
- 🚨 **Stray Reports** — Report a stray animal with photo and location
- ❤️ **Adoption Requests** — Apply to adopt and track your application status
- 🔔 **Email Notifications** — Alerts for new reports and adoption updates
- 🔐 **Role-Based Auth** — Visitor / Shelter / Admin roles with JWT

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT + bcrypt |
| Image Upload | Cloudinary |
| Email | Nodemailer |
| Deployment | Vercel (client) + Render (server) + MongoDB Atlas |

---

## 📁 Project Structure

```
tunisia-pet-rescue/
├── client/                   # React frontend
│   └── src/
│       ├── components/       # Reusable UI components
│       ├── pages/            # Route-level pages
│       ├── context/          # Auth context
│       ├── hooks/            # Custom hooks
│       └── utils/            # Axios instance, helpers
│
├── server/                   # Express backend
│   ├── config/               # DB connection
│   ├── controllers/          # Route logic
│   ├── middleware/            # Auth middleware
│   ├── models/               # Mongoose schemas
│   └── routes/               # API routes
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/khaled0704/tunisia-pet-rescue.git
cd tunisia-pet-rescue
```

### 2. Setup the server
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### 3. Setup the client
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

---

## 🗺️ Roadmap

- [x] Project setup & structure
- [ ] Authentication (JWT + roles)
- [ ] Animal CRUD
- [ ] Shelter directory
- [ ] Stray report system
- [ ] Adoption request flow
- [ ] Email notifications
- [ ] Map integration (Leaflet.js)
- [ ] Deployment

---

## 👤 Author

**Khaled Nawar** — [@khaled0704](https://github.com/khaled0704)

> 💡 Idea by a friend who cares about stray animals in Tunisia 🐾
