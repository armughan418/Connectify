# Connectify — Full-Stack Social Media Platform

A production-oriented social media application with a React frontend and a Node.js + Express backend. Connectify supports user profiles, posts with images/videos, friend connections, real-time messaging, reporting & moderation, and a full admin dashboard with settings and backup controls.

---

## Contents

- Project summary
- Tech stack
- Key features
- Architecture & folders
- Quick start (local)
- Backend API overview
- Frontend structure & pages
- Admin dashboard & settings
- Environment variables
- Development notes & contribution

---

## Project summary

Connectify is a modern social media web application that demonstrates a complete full-stack workflow: REST APIs, real-time WebSocket messaging (Socket.io), file uploads (Cloudinary), authentication (JWT), and an admin panel for moderation and system management.

This repository contains two main parts:

- `backend/` — Express server, MongoDB models, controllers, routes, utilities
- `frontend/` — React application, components, pages, services, and Socket context

---

## Tech stack

- Backend: Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs, Socket.io
- Frontend: React, react-router, axios, socket.io-client, Tailwind CSS, lucide-react icons
- Storage: Cloudinary for media uploads
- Emails: Nodemailer for OTP and notifications

---

## Key features

- User authentication (signup, login, OTP flow, password reset)
- User profiles (profile photo, cover photo, editable fields)
- Create / edit / delete posts (images & video support)
- Like/unlike and comment on posts
- Follow/friend system with friend list
- Real-time messaging using Socket.io
- Content reporting flow for users + admin moderation
- Admin dashboard with statistics, user management, report management, and settings
- Site maintenance mode and manual DB backup trigger

---

## Architecture & folders

Top-level layout:

- backend/

  - controllers/ # Request handlers
  - middlewares/ # auth, admin checks, multer
  - models/ # Mongoose schemas (User, Post, Comment, Message, Report)
  - routes/ # Express routes for auth, users, posts, comments, messages, reports
  - utils/ # cloudinary, mailers, db connection helpers
  - server.js # App entry, Socket.io setup

- frontend/
  - src/components/ # Reusable components (PostCard, ReportModal, CommentSection, etc.)
  - src/pages/ # Page views (Feed, Messages, Profile, Admin pages)
  - src/services/ # API wrappers (userService, postService, reportService, ...)
  - src/context/ # SocketContext for real-time features
  - src/utils/ # api endpoints and helpers

---

## Quick start (local development)

Prerequisites: Node.js (16+), npm, MongoDB (local or Atlas), Cloudinary account (optional for uploads)

1. Clone the repo

```bash
git clone <repo-url>
cd social-media-platfom
```

2. Backend

```powershell
cd backend
npm install
# create .env (see Environment variables below)
npm run dev    # starts server on http://localhost:5000 (nodemon)
```

3. Frontend

```powershell
cd frontend
npm install
npm start      # starts dev server on http://localhost:3000
```

Open `http://localhost:3000` in the browser.

---

## Backend API overview (short)

Base URL: `http://localhost:5000/api`

Authentication

- POST `/user/register` — register
- POST `/user/login` — login
- POST `/user/forget/password` — request reset
- POST `/user/otp/verify` — verify otp

Users

- GET `/user/profile` — current user profile
- PUT `/user/profile` — update profile
- GET `/user/:id` — get user by id

Posts

- POST `/post/create` — create post
- GET `/post/all` — list posts
- PUT `/post/:id/update` — update
- DELETE `/post/:id/delete` — delete
- POST `/post/:id/like` & `/post/:id/unlike`

Comments

- POST `/comment/create` — add comment
- GET `/comment/post/:postId` — list comments

Reports

- POST `/report` — submit report
- GET `/report/pending` — admin pending
- PUT `/report/:id` — resolve report

Admin

- GET `/auth/stats` — admin statistics

File upload

- GET `/cloudinary/signature` — secure upload
- POST `/cloudinary/upload` — upload file

Note: Check `backend/routes/` files for full endpoint list and expected payloads.

---

## Frontend structure & important pages

- `src/pages/Feed.jsx` — main feed, create post flow
- `src/pages/Messages.jsx` — conversations and messaging
- `src/pages/Friends.jsx` — friend list and requests
- `src/pages/UserOwnProfile.jsx` — own profile with edit modal (you can edit name, email, phone, address)
- `src/components/PostCard.jsx` — post display, likes, comments, share, report menu
- `src/components/ReportModal.jsx` — submit report UI
- `src/pages/admin/*` — admin UIs: Users, Reports, Settings

Services call backend endpoints and live in `src/services/` (use axios). Socket connection is provided by `src/context/SocketContext.jsx`.

---

## Admin dashboard & settings

Admin pages include:

- Dashboard with stats (total users, posts, reports)
- User management (view/edit/delete)
- Report moderation (approve/reject, remove offending posts)
- Platform settings: general, security, notifications, database backups

Settings currently persist to `localStorage` as a fallback. If you want settings stored server-side, add corresponding endpoints in `backend` and wire them in `frontend/src/services/adminService.js`.

---

## Environment variables (example)

Create a `.env` in `backend/` with at least:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/connectify
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
EMAIL_USER=...
EMAIL_PASSWORD=...
FRONTEND_URL=http://localhost:3000
```

Frontend uses `src/utils/api.js` to set the backend base URL (default `http://localhost:5000`).

---

## Development notes

- To enable real-time messaging, ensure Socket.io server (backend) runs and `SocketProvider` receives the `userId` (token-based auth recommended).
- Media uploads use a Cloudinary flow; files are uploaded through the backend helper (`utils/cloudinaryUpload.js`) or via signed uploads.
- For production, secure environment variables, enable HTTPS, set cookie flags, and consider a reverse proxy (NGINX) and a process manager (PM2).

---

## Contributing

1. Fork and branch: `git checkout -b feature/your-feature`
2. Implement tests if adding logic
3. Keep commits small and meaningful
4. Open a PR describing the change and testing steps

---

## License

This repository is provided "as-is". Add a license file if you intend to publish. The previous workspace used ISC in `backend/package.json` — adjust as needed.

---

If you want, I can:

- Expand the README with full endpoint examples for every API route
- Add a short developer checklist for deployment (PM2, Docker, CI)
- Generate a `docs/` folder with OpenAPI (Swagger) spec based on routes

Tell me which of those you'd like next and I will implement it.
