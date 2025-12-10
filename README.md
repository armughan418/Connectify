# Connectify - Social Media Platform

A full-stack social media application built with **Node.js + Express** (Backend) and **React** (Frontend), featuring real-time messaging, post sharing, user connections, and comprehensive admin dashboard.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Installation & Setup](#installation--setup)
- [Backend API Documentation](#backend-api-documentation)
- [Frontend Components & Pages](#frontend-components--pages)
- [Real-Time Features](#real-time-features)
- [Admin Dashboard](#admin-dashboard)
- [Security & Authentication](#security--authentication)
- [Database Models](#database-models)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Development Workflow](#development-workflow)
- [Future Enhancements](#future-enhancements)

---

## Project Overview

**Connectify** is a comprehensive social media platform enabling users to:

- Create and share posts with images/videos
- Connect with other users (friend requests & management)
- Send real-time messages
- Like and comment on posts
- Report inappropriate content
- Manage user profiles with cover photos
- Browse user connections and friend lists

**Admin Features:**

- Comprehensive dashboard with user/post/report analytics
- User management (view, edit, delete)
- Report management and moderation
- Platform settings (maintenance mode, security, notifications)
- Database backup management

---

## 🛠 Tech Stack

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js (v5.1.0)
- **Database:** MongoDB with Mongoose (v8.18.0)
- **Authentication:** JWT (jsonwebtoken v9.0.2)
- **Password Security:** bcryptjs (v3.0.2), bcrypt (v6.0.0)
- **File Upload:** Cloudinary integration with multer (v2.0.2)
- **Real-Time Communication:** Socket.io (v4.5.4)
- **Email Service:** Nodemailer (v7.0.5)
- **Input Validation:** Joi (v18.0.1)
- **Environment:** dotenv (v17.2.1)
- **CORS:** cors (v2.8.5)

### Frontend

- **Library:** React (v19.1.1)
- **Router:** react-router-dom (v7.8.2)
- **HTTP Client:** Axios (v1.13.2)
- **Real-Time:** socket.io-client (v4.8.1)
- **UI Components:**
  - lucide-react (v0.553.0) - Icon library
  - react-icons (v5.5.0)
- **Styling:** Tailwind CSS, PostCSS, Autoprefixer
- **Notifications:** react-toastify (v11.0.5)
- **Animations:** framer-motion (v12.23.25)
- **Charts:** recharts (v3.4.1)
- **Utilities:** react-countup (v6.5.3)

---

## Features

### User Features

| Feature                | Status   | Description                                                        |
| ---------------------- | -------- | ------------------------------------------------------------------ |
| **Authentication**     | Complete | Email signup/login with JWT, OTP verification, password reset      |
| **User Profiles**      | Complete | Profile picture, cover photo, bio, contact information             |
| **Post Management**    | Complete | Create, edit, delete posts with images/videos; category tagging    |
| **Engagement**         | Complete | Like/unlike posts, add comments, track engagement metrics          |
| **Friend Connections** | Complete | Send/accept friend requests, view friend lists, manage connections |
| **Messaging**          | Complete | Real-time messaging with Socket.io, conversation history           |
| **Content Reporting**  | Complete | Report inappropriate posts with reason/description; admin review   |
| **User Search**        | Complete | Search for users by name/email                                     |
| **Feed**               | Complete | Personalized feed of posts from connected users                    |

### Admin Features

| Feature               | Status   | Description                                                     |
| --------------------- | -------- | --------------------------------------------------------------- |
| **Dashboard**         | Complete | Real-time analytics: total users, posts, reports, connections   |
| **User Management**   | Complete | View, edit user details, delete accounts                        |
| **Report Management** | Complete | Review reported posts, approve/reject reports, track moderation |
| **Settings Panel**    | Complete | General, security, notification, and database settings          |
| **Maintenance Mode**  | Complete | Restrict platform access during maintenance                     |
| **Database Backups**  | Complete | Manual and automatic backup scheduling                          |
| **Security Config**   | Complete | 2FA settings, session timeout, password requirements            |

---

## 🏗 Architecture

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (React Frontend)               │
│  ┌─────────────┐  ┌──────────┐  ┌────────────────┐      │
│  │  Pages      │  │Components│  │   Services     │      │
│  └─────────────┘  └──────────┘  └────────────────┘      │
│         │                │                 │              │
└─────────┼────────────────┼─────────────────┼──────────────┘
          │                │                 │
       Axios            Socket.io        REST APIs
          │                │                 │
          └────────────────┼─────────────────┘
                           │
┌──────────────────────────┴───────────────────────────────┐
│           SERVER (Express.js Backend)                    │
│  ┌─────────────┐  ┌──────────┐  ┌────────────────┐      │
│  │  Routes     │  │Controllers│  │  Middleware   │      │
│  └─────────────┘  └──────────┘  └────────────────┘      │
│         │                │                 │              │
│  ┌──────────────────────────────────────────┐            │
│  │       Models & Schema (Mongoose)         │            │
│  └──────────────────────────────────────────┘            │
│         │                │                 │              │
└─────────┼────────────────┼─────────────────┼──────────────┘
          │                │                 │
        MongoDB        Cloudinary        Socket.io
          │                │                 │
┌─────────┴────────────────┼─────────────────┴──────────────┐
│        External Services & Database                        │
│  ┌──────────────┐  ┌──────────┐  ┌──────────────┐         │
│  │  MongoDB     │  │Cloudinary│  │  Nodemailer  │         │
│  └──────────────┘  └──────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### Technology Flow

1. **Frontend** (React) → REST API/Socket.io → **Backend** (Express)
2. **Backend** → MongoDB (data persistence)
3. **Backend** → Cloudinary (image/video storage)
4. **Backend** → Nodemailer (email notifications)
5. Real-time updates via Socket.io bidirectional communication

---

## 📦 Installation & Setup

### Prerequisites

- Node.js (v16+)
- MongoDB Atlas or local MongoDB instance
- Cloudinary account (for image/video uploads)
- Nodemailer configured email

### Clone Repository

```bash
git clone <repository-url>
cd social-media-platfom
```

### Backend Setup

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create `.env` file** in backend root:

   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRY=7d

   # Cloudinary
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Email Service (Nodemailer)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password

   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start backend server:**

   ```bash
   # Production
   npm start

   # Development (with nodemon)
   npm run dev
   ```

   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Update API configuration** in `frontend/src/utils/api.js`:

   ```javascript
   const local = "http://localhost:5000"; // Ensure this matches backend port
   ```

4. **Install Tailwind CSS** (if not already installed):

   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

5. **Start frontend dev server:**
   ```bash
   npm start
   ```
   Application opens at `http://localhost:3000`

---

## 🔌 Backend API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint                | Description                 | Auth |
| ------ | ----------------------- | --------------------------- | ---- |
| POST   | `/user/register`        | Register new user           | No   |
| POST   | `/user/login`           | Login user                  | No   |
| POST   | `/user/forget/password` | Initiate password reset     | No   |
| POST   | `/user/otp/verify`      | Verify OTP                  | No   |
| POST   | `/user/update/password` | Update password after reset | No   |
| GET    | `/user/get/access`      | Refresh/verify access token | Yes  |

**Register Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phone": "+1234567890",
  "address": "123 Main St"
}
```

**Login Request:**

```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### User Endpoints

| Method | Endpoint              | Description              | Auth |
| ------ | --------------------- | ------------------------ | ---- |
| GET    | `/user/profile`       | Get current user profile | Yes  |
| PUT    | `/user/profile`       | Update user profile      | Yes  |
| GET    | `/user/:id`           | Get user by ID           | Yes  |
| GET    | `/user/search?query=` | Search users             | Yes  |
| GET    | `/auth/users`         | Get all users (admin)    | Yes  |
| PUT    | `/auth/users/:id`     | Update user (admin)      | Yes  |
| DELETE | `/auth/users/:id`     | Delete user (admin)      | Yes  |

**Update Profile Request:**

```json
{
  "name": "Updated Name",
  "phone": "+9876543210",
  "address": "456 Oak Ave",
  "profilePhoto": "cloudinary_url",
  "coverPhoto": "cloudinary_url"
}
```

### Post Endpoints

| Method | Endpoint           | Description     | Auth |
| ------ | ------------------ | --------------- | ---- |
| POST   | `/post/create`     | Create new post | Yes  |
| GET    | `/post/all`        | Get all posts   | Yes  |
| GET    | `/post/:id`        | Get post by ID  | Yes  |
| PUT    | `/post/:id/update` | Update post     | Yes  |
| DELETE | `/post/:id/delete` | Delete post     | Yes  |
| POST   | `/post/:id/like`   | Like a post     | Yes  |
| POST   | `/post/:id/unlike` | Unlike a post   | Yes  |

**Create Post Request:**

```json
{
  "content": "This is my first post!",
  "image": "cloudinary_url_optional",
  "video": "cloudinary_url_optional",
  "category": "general"
}
```

### Comment Endpoints

| Method | Endpoint                | Description           | Auth |
| ------ | ----------------------- | --------------------- | ---- |
| POST   | `/comment/create`       | Create comment        | Yes  |
| GET    | `/comment/post/:postId` | Get comments for post | Yes  |
| GET    | `/comment/:id`          | Get comment by ID     | Yes  |
| PUT    | `/comment/:id/update`   | Update comment        | Yes  |
| DELETE | `/comment/:id/delete`   | Delete comment        | Yes  |

**Create Comment Request:**

```json
{
  "postId": "post_id_here",
  "text": "Great post!"
}
```

### Friend Endpoints

| Method | Endpoint         | Description            | Auth |
| ------ | ---------------- | ---------------------- | ---- |
| POST   | `/friend/add`    | Send friend request    | Yes  |
| POST   | `/friend/accept` | Accept friend request  | Yes  |
| POST   | `/friend/remove` | Remove friend          | Yes  |
| GET    | `/friend/list`   | Get user's friend list | Yes  |

**Add Friend Request:**

```json
{
  "friendId": "user_id_to_add"
}
```

### Message Endpoints

| Method | Endpoint                 | Description                       | Auth |
| ------ | ------------------------ | --------------------------------- | ---- |
| POST   | `/message/send`          | Send message (also via Socket.io) | Yes  |
| GET    | `/message/:friendId`     | Get conversation history          | Yes  |
| GET    | `/message/conversations` | Get all conversations             | Yes  |
| GET    | `/message/unread/count`  | Get unread message count          | Yes  |

**Send Message Request:**

```json
{
  "receiverId": "recipient_user_id",
  "content": "Hello! How are you?"
}
```

### Report Endpoints

| Method | Endpoint          | Description                 | Auth |
| ------ | ----------------- | --------------------------- | ---- |
| POST   | `/report`         | Report a post               | Yes  |
| GET    | `/report/pending` | Get pending reports (admin) | Yes  |
| GET    | `/report/all`     | Get all reports (admin)     | Yes  |
| PUT    | `/report/:id`     | Resolve report (admin)      | Yes  |

**Report Post Request:**

```json
{
  "postId": "post_to_report",
  "reason": "Inappropriate Content",
  "description": "This post violates community guidelines"
}
```

### Admin Endpoints

| Method | Endpoint      | Description          | Auth |
| ------ | ------------- | -------------------- | ---- |
| GET    | `/auth/stats` | Get admin statistics | Yes  |

**Stats Response:**

```json
{
  "totalUsers": 156,
  "totalPosts": 1024,
  "totalReports": 18,
  "totalFriendConnections": 3421
}
```

### File Upload (Cloudinary)

| Method | Endpoint                | Description               | Auth |
| ------ | ----------------------- | ------------------------- | ---- |
| GET    | `/cloudinary/signature` | Get upload signature      | Yes  |
| POST   | `/cloudinary/upload`    | Upload file to Cloudinary | Yes  |

---

## Frontend Components & Pages

### Core Pages

#### Home (`pages/home.jsx`)

- Landing page with platform overview
- Call-to-action for signup/login
- Feature highlights

#### Login (`pages/login.jsx`)

- Email/password authentication
- Error handling with toast notifications
- JWT token storage
- Redirect to feed on success

#### Signup (`pages/signup.jsx`)

- User registration form
- Name, email, password, phone, address fields
- Input validation (Joi on backend)
- Password strength feedback

#### Feed (`pages/Feed.jsx`)

- Personalized feed of posts
- Create new post modal
- Post cards with like/comment interactions
- Real-time updates

#### Messages (`pages/Messages.jsx`)

- Conversation list with friends
- Real-time messaging via Socket.io
- Message history
- Unread message indicators

#### Friends (`pages/Friends.jsx`)

- Friend list display
- Pending friend requests
- Add/remove friend functionality
- User search integration

#### User Profile (`pages/UserOwnProfile.jsx` & `pages/userProfile.jsx`)

- Profile picture and cover photo upload
- User information display
- Edit profile modal
- Posts, about, friends, and photos tabs
- Friend/unfollow actions

#### Search (`pages/Search.jsx`)

- User search by name/email
- Browse all users
- Quick profile preview
- Add friend button

#### Admin Panel (`pages/AdminPanel.jsx`)

- Dashboard with statistics
- Navigation to admin sections
- Real-time stat updates

#### Admin Dashboard (`pages/AdminDashboard.jsx`)

- Admin-only dashboard
- User stats with charts
- Navigation to admin features

### Admin Pages

#### Admin Users (`pages/admin/AdminUsers.jsx`)

- List all users in table format
- View user details
- Edit user information
- Delete user accounts
- Search and filter users

#### Admin Reports (`pages/admin/AdminReports.jsx`)

- View all reports submitted by users
- Report details with reason and description
- Approve/reject reports
- Action on reported posts
- Report status tracking

#### Admin Settings (`pages/admin/AdminSettings.jsx`)

- **General Settings:** Site name, description, maintenance mode toggle
- **Security Settings:** 2FA, session timeout, password requirements
- **Notification Settings:** Email/push/report/signup alerts
- **Database Settings:** Auto backup, backup frequency, retention period
- **Manual Backup:** Trigger backup on demand

#### Admin Profile (`pages/admin/AdminProfile.jsx`)

- Admin account management
- Password change
- Activity logs

### Reusable Components

#### PostCard (`components/PostCard.jsx`)

```
Features:
- Post display with author info
- Like/unlike functionality
- Comment section toggle
- Share post (to WhatsApp/Web Share API)
- Three-dot menu for reporting (non-owners)
- Edit/delete for post owners
- Real-time like count updates
```

#### CommentSection (`components/CommentSection.jsx`)

```
Features:
- Display all comments
- Add new comments
- Delete own comments
- Nested comment structure (if supported)
```

#### FriendCard (`components/FriendCard.jsx`)

```
Features:
- Friend avatar and name
- Profile link
- Remove friend button
```

#### MessageThread (`components/MessageThread.jsx`)

```
Features:
- Message display
- Real-time message updates
- Sender/receiver indication
- Message timestamps
```

#### ReportModal (`components/ReportModal.jsx`)

```
Features:
- Reason dropdown selection
- Description textarea
- Submit functionality
- Loading state
- Error handling
```

#### Navbar (`components/navbar.jsx`)

- Logo and branding
- Navigation links (authenticated)
- User dropdown menu
- Logout functionality

#### Responsive Layout Components

- `LayoutWithNavbar.jsx` - Standard navigation layout
- `LayoutWithNavbarSocial.jsx` - Social media features layout
- `AdminSidebarSocial.jsx` - Admin sidebar navigation

---

## Real-Time Features

### Socket.io Implementation (`backend/server.js`)

**Socket Events:**

1. **User Registration**

   ```javascript
   socket.on("register", (userId) => {
     // User joins room with ID
     userSockets[userId] = socket.id;
     socket.join(userId);
   });
   ```

2. **Send Message**

   ```javascript
   socket.on('sendMessage', (data) => {
     const { senderId, receiverId, content } = data;
     // Emit to receiver's room
     io.to(receiverId).emit('receiveMessage', {...});
   });
   ```

3. **Typing Indicator**

   ```javascript
   socket.on('typing', (data) => {
     io.to(data.receiverId).emit('typing', {...});
   });
   ```

4. **User Online Status**
   ```javascript
   socket.on("userOnline", (userId) => {
     io.emit("userStatusChanged", { userId, online: true });
   });
   ```

### Frontend Socket Integration (`context/SocketContext.jsx`)

The `SocketProvider` context wraps the app to provide:

- Socket instance access throughout components
- Auto-connection/disconnection
- Real-time event listeners
- Message broadcasting

**Usage in components:**

```jsx
import { useContext } from "react";
import SocketContext from "../context/SocketContext";

function MyComponent() {
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", (data) => {
        // Handle incoming message
      });
    }
  }, [socket]);
}
```

---

## Admin Dashboard

### Dashboard Statistics

- **Total Users:** Real-time count of registered users
- **Total Posts:** Cumulative posts created
- **Pending Reports:** Reports awaiting admin action
- **Friend Connections:** Total friend connections in system

### Admin Functions

#### User Management

- View all users in sortable table
- Edit user information
- Delete user accounts and associated data
- Search users by name/email
- View user activity

#### Report Management

- Review all reported posts
- See report reason and details
- View reported post content
- Take action: Approve/Reject/Remove post
- Track report resolution time

#### Settings Management

- **General:** Maintenance mode, site info
- **Security:** 2FA, password policies, session timeout
- **Notifications:** Email/push alerts, report notifications
- **Database:** Backup configuration, manual backup trigger

#### Maintenance Mode

When enabled:

- Regular users see "Site Under Maintenance" page
- Admin access remains unrestricted
- Protects platform during updates/maintenance
- Prevents new user registrations

---

## Security & Authentication

### Authentication Flow

1. **User Registration**

   - Password hashed with bcryptjs (salt rounds: 10)
   - Unique email validation
   - OTP sent via Nodemailer for email verification

2. **User Login**

   - Email/password verification
   - JWT token generated (7-day expiry)
   - Token stored in localStorage (frontend)
   - Refresh token endpoint for session extension

3. **Protected Routes**
   - `authMiddleware.js` validates JWT on protected endpoints
   - Admin routes checked with `adminAuth.js`
   - User-specific routes verified by ID

### Password Security

- **Hashing:** bcryptjs with 10 salt rounds
- **Policy:** Configurable minimum length (default: 8 chars)
- **Strong Password Option:** Uppercase + lowercase + numbers + special chars
- **Reset Flow:** OTP verification via email

### Session Management

- **Timeout:** Configurable (default: 30 minutes of inactivity)
- **2FA Option:** Admin setting for two-factor authentication
- **Cookie Security:** httpOnly, secure, sameSite flags enabled

### Data Protection

- JWT tokens in Authorization headers
- CORS enabled for frontend origin only
- Input validation with Joi
- SQL injection protection via Mongoose ODM

---

## Database Models

### User Model (`models/user.js`)

```javascript
{
  name: String,
  email: String (unique, lowercase),
  password: String (hashed),
  phone: String,
  address: String,
  role: String (enum: ['user', 'admin']),
  otp: {
    otp: String,
    sendTime: Date,
    token: String,
    tokenExpiry: Date
  },
  resetPassword: {
    otp: String,
    otpSendTime: Date,
    token: String,
    otpExpiry: Date
  },
  friends: [ObjectId],
  profilePhoto: String (Cloudinary URL),
  coverPhoto: String (Cloudinary URL),
  timestamps: true
}
```

### Post Model (`models/Post.js`)

```javascript
{
  author: ObjectId (ref: User),
  content: String,
  image: String (Cloudinary URL),
  video: String (Cloudinary URL),
  category: String (enum: ['general', 'tech', 'life', 'other']),
  likes: [ObjectId],
  likesCount: Number,
  comments: [ObjectId] (ref: Comment),
  timestamps: true
}
```

### Comment Model (`models/Comment.js`)

```javascript
{
  author: ObjectId (ref: User),
  post: ObjectId (ref: Post),
  text: String,
  likes: [ObjectId],
  likesCount: Number,
  timestamps: true
}
```

### Message Model (`models/Message.js`)

```javascript
{
  sender: ObjectId (ref: User),
  receiver: ObjectId (ref: User),
  content: String,
  read: Boolean (default: false),
  timestamps: true
}
```

### Report Model (`models/Report.js`)

```javascript
{
  post: ObjectId (ref: Post),
  reportedBy: ObjectId (ref: User),
  reason: String,
  description: String,
  status: String (enum: ['pending', 'resolved', 'rejected']),
  resolvedBy: ObjectId (ref: User),
  resolvedAt: Date,
  timestamps: true
}
```

---

## Configuration

### Backend Environment Variables (`.env`)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRY=7d

# Cloudinary (Image/Video Storage)
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_SERVICE=gmail

# Frontend URL
FRONTEND_URL=http://localhost:3000

# OTP Expiry (in minutes)
OTP_EXPIRY=15
```

### Frontend Configuration (`src/utils/api.js`)

```javascript
const api = () => {
  const local = "http://localhost:5000";

  return {
    registerUser: `${local}/api/user/register`,
    loginUser: `${local}/api/user/login`,

    getUserProfile: `${local}/api/user/profile`,
    updateUserProfile: `${local}/api/user/profile`,
  };
};
```

---

## Running the Application

### Full Stack Start (Recommended)

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev          # Starts on http://localhost:5000
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm start            # Starts on http://localhost:3000
```

### Production Build

**Backend:**

```bash
cd backend
npm start            # Uses production-optimized setup
```

**Frontend:**

```bash
cd frontend
npm run build        # Creates optimized build in build/ folder
npm serve build      # (or use any static server)
```

## Development Workflow

### Creating New Features

1. **Backend API:**

   - Create controller in `controllers/`
   - Define model in `models/`
   - Add routes in `routes/`
   - Add middleware if needed in `middlewares/`

2. **Frontend:**

   - Create service in `services/` (for API calls)
   - Create components in `components/`
   - Create pages in `pages/`
   - Use services in components via axios

3. **Example: New Feature Flow**
   ```
   Feature Idea
     ↓
   Design Schema (Model)
     ↓
   Create Controller with CRUD operations
     ↓
   Add Routes and Middleware
     ↓
   Build API endpoint
     ↓
   Create Frontend Service (API wrapper)
     ↓
   Build React Components
     ↓
   Test end-to-end
     ↓
   Deploy
   ```

### Best Practices

- **Error Handling:** Use try-catch with meaningful error messages
- **Validation:** Validate input on both backend (Joi) and frontend
- **Environment Variables:** Never commit sensitive data
- **Comments:** Keep code self-documenting; use comments for "why", not "what"
- **Testing:** Test APIs with Postman before frontend integration
- **Commit Messages:** Clear, concise messages with context

### Debugging Tips

1. **Backend Issues:**

   - Check MongoDB connection
   - Verify Cloudinary credentials
   - Check console logs in terminal running `npm run dev`
   - Use Postman to test API endpoints

2. **Frontend Issues:**
   - Open browser DevTools (F12)
   - Check Network tab for API responses
   - Check Console for JS errors
   - Verify backend is running and accessible

---

## Future Enhancements

### Planned Features

- [ ] Advanced search with filters
- [ ] Post recommendations algorithm
- [ ] User activity notifications
- [ ] Group messaging/channels
- [ ] Video call integration (Twilio/Agora)
- [ ] Stories feature (temporary posts)
- [ ] User blocking functionality
- [ ] Content moderation using AI
- [ ] Dark mode theme
- [ ] Mobile app (React Native)
- [ ] Email digest/newsletter
- [ ] Advanced analytics dashboard
- [ ] Performance optimization (caching, CDN)

### Technical Improvements

- [ ] Write unit tests (Jest)
- [ ] Add integration tests
- [ ] Implement Redis caching
- [ ] GraphQL migration
- [ ] Microservices architecture
- [ ] Kubernetes deployment
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Load testing and optimization

---

## Support & Contribution

### Reporting Issues

- Check existing issues before creating new ones
- Provide clear reproduction steps
- Include environment details (OS, Node version, etc.)

### Contributing

1. Create feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open Pull Request

### Development Standards

- Follow ESLint configuration
- Format code with Prettier
- Write meaningful commit messages
- Update documentation with changes

---

## 👥 Team & Contact

**Project Name:** Connectify  
**Description:** Full-Stack Social Media Platform  
**Status:** Active Development

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Mongoose Docs](https://mongoosejs.com/)
- [Socket.io Documentation](https://socket.io/docs/)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Last Updated:** December 2025  
**Version:** 1.0.0
