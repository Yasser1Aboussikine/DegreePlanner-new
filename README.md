# **DegreePlanner – Production-Ready Academic Planning System**

**DegreePlanner** is an intelligent academic planning system designed for AUI students. It combines **real-time chat**, **mentor/advisor assignment**, **role-based dashboards**, and comprehensive **semester planning workflows** to help students build, validate, and optimize their degree progress.

---

## 🚀 **Deployment Status: PRODUCTION READY** ✅

The project is **ready for production deployment** with all core features implemented and tested.

### ✅ **Completed Features**

#### Authentication & Security

- ✅ JWT authentication (access + refresh tokens)
- ✅ Password reset with email verification (24-hour expiration)
- ✅ Role-based access control (5 roles: Student, Mentor, Advisor, Registrar, Admin)
- ✅ Comprehensive Zod validation
- ✅ Bcrypt password hashing
- ✅ Refresh token rotation
- ✅ Authorization middleware with ownership checks

#### Real-Time Communication

- ✅ Socket.IO WebSocket integration
- ✅ Real-time chat (group + direct messages)
- ✅ Message read tracking (blue checkmark when ALL participants read)
- ✅ Typing indicators
- ✅ Auto-created group chats for mentor-student relationships
- ✅ Unread message counts

#### User Management

- ✅ Multi-role system with RBAC
- ✅ Mentor assignment (one per student, DB-enforced)
- ✅ Advisor assignment (one per student, DB-enforced)
- ✅ Email notifications

#### Academic Features

- ✅ Program management (Computer Science major + Minors)
- ✅ Semester review workflow (Student → Mentor → Advisor)
- ✅ Role-specific dashboards with analytics
- ✅ Classification tracking (Freshman, Sophomore, Junior, Senior)
- ✅ FYE (First Year Experience) student support

#### UI/UX

- ✅ Complete dark/light theme support
- ✅ Multi-step signup with real-time validation
- ✅ Date pickers with year/month dropdowns
- ✅ Responsive design (mobile-first)
- ✅ Toast notifications
- ✅ Form validation with clear error messages
- ✅ shadcn/ui accessible components

### 📋 **Pre-Deployment Checklist**

#### Backend Environment Variables Required

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@host:5432/db
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=password
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
FRONTEND_URL=https://your-frontend.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your-password
SMTP_FROM=DegreePlanner <noreply@degreeplanner.com>
```

#### Frontend Environment Variables Required

```env
# .env.production
VITE_API_URL=https://your-api.com/api
```

### ⚠️ **Recommended Before Launch**

- Add rate limiting (express-rate-limit)
- Set up monitoring (Sentry, LogRocket)
- Configure production database backups
- Set up CI/CD pipeline
- Add Helmet.js for security headers

---

## 🎯 **Core Features**

### 1. Authentication System

- **Multi-step signup** with validation at each step
- **JWT-based authentication** with refresh tokens
- **Password reset** via email with secure tokens
- **Role-based access control** (RBAC)

### 2. Real-Time Chat

- **Group chats**: Mentor + all assigned students
- **Direct messages**: One-on-one conversations
- **Read receipts**: Blue checkmark only when all participants read
- **Typing indicators**: Real-time typing status
- **Unread counts**: Per-thread unread message tracking

### 3. Assignment System

- **Mentor Assignment**: One mentor per student (DB-enforced)
- **Advisor Assignment**: One advisor per student (DB-enforced)
- Auto-creates group chat when mentor is assigned
- Unassigned student tracking

### 4. Semester Review Workflow

1. Student creates semester plan
2. Student submits for mentor review → `PENDING_MENTOR`
3. Mentor approves/rejects → `MENTOR_APPROVED` or `MENTOR_REJECTED`
4. Student submits to advisor → `PENDING_ADVISOR`
5. Advisor gives final approval → `ADVISOR_APPROVED` or `ADVISOR_REJECTED`

### 5. Role-Based Dashboards

- **Student**: Credits earned, GPA, plan status, assigned mentor/advisor
- **Mentor**: Assigned students, pending reviews, plan statistics
- **Advisor**: Assigned students, review queue, student analytics
- **Registrar**: System-wide stats, program enrollment, review metrics
- **Admin**: Full system access, user management, catalog management

### 6. Program Management

- Computer Science major (currently available)
- Minors: Math, Data Science, Business, Psychology, and more
- Classification system: Freshman (with FYE), Sophomore, Junior, Senior

### 7. Email Notifications

- Password reset emails
- Review status updates (mentor approval/rejection)
- Advisor approval/rejection notifications
- Student reports to admin

---

## 💾 **Technology Stack**

### Backend

- **Node.js + TypeScript**
- **Express.js** (HTTP server)
- **Socket.IO** (WebSockets)
- **Prisma** (PostgreSQL ORM)
- **Neo4j** (course prerequisites graph)
- **JWT** (authentication)
- **Nodemailer** (email)
- **Zod** (validation)

### Frontend

- **React 19 + TypeScript**
- **Vite** (build tool)
- **Redux Toolkit + RTK Query**
- **React Router v6**
- **Tailwind CSS**
- **shadcn/ui** components
- **React Hook Form + Zod**
- **Socket.IO Client**
- **Framer Motion** (animations)

### Databases

- **PostgreSQL**: Users, plans, chat, assignments
- **Neo4j**: Course catalog, prerequisites

---

## 📁 **Project Structure**

```
DegreePlanner-new/
├── server/                    # Backend (Node.js + Express)
│   ├── src/
│   │   ├── controllers/       # HTTP request handlers
│   │   ├── services/          # Business logic
│   │   ├── middlewares/       # Auth, validation, RBAC
│   │   ├── routes/            # API endpoints
│   │   ├── sockets/           # Socket.IO handlers
│   │   ├── config/            # DB, Socket, Logger
│   │   └── schemas/           # Zod validation
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   └── .env                   # Backend environment vars
│
└── web/                       # Frontend (React + Vite)
    ├── src/
    │   ├── features/          # Feature modules
    │   ├── components/        # Shared UI components
    │   ├── store/             # Redux + RTK Query
    │   ├── schemas/           # Zod validation
    │   └── styles/            # CSS + theme variables
    ├── .env.development       # Dev environment
    └── .env.production        # Prod environment
```

---

## 🚀 **Getting Started**

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL 14+
- Neo4j 5.x
- SMTP server

### Installation

```bash
# Clone repository
git clone <repo-url>
cd DegreePlanner-new

# Install backend
cd server
pnpm install
pnpm prisma migrate dev

# Install frontend
cd ../web
pnpm install
```

### Development

```bash
# Terminal 1: Backend
cd server
pnpm dev          # Runs on http://localhost:5000

# Terminal 2: Frontend
cd web
pnpm dev          # Runs on http://localhost:5173
```

### Production Build

```bash
# Backend
cd server
pnpm build
pnpm start

# Frontend
cd web
pnpm build
# Deploy dist/ folder to static hosting
```

---

## 🔒 **Security**

✅ Implemented:

- JWT authentication with refresh tokens
- Password hashing (bcrypt)
- Role-based authorization
- Input validation (Zod)
- CORS configuration
- SQL injection prevention (Prisma)
- XSS prevention (React escaping)
- Secure password reset tokens

⚠️ Recommended additions:

- Rate limiting
- Helmet.js security headers
- 2FA (future enhancement)

---

## 📚 **API Endpoints**

### Authentication

```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/auth/me
```

### Chat

```
GET    /api/chat/threads
GET    /api/chat/threads/:id/messages
POST   /api/chat/messages
GET    /api/chat/unread-count
```

### Assignments

```
GET    /api/mentor-assignments
POST   /api/mentor-assignments
GET    /api/advisor-assignments
POST   /api/advisor-assignments
```

### Dashboards

```
GET    /api/dashboard/student/:id
GET    /api/dashboard/mentor/:id
GET    /api/dashboard/advisor/:id
GET    /api/dashboard/registrar
GET    /api/dashboard/admin
```

### Reviews

```
GET    /api/reviews/semester/:id
POST   /api/reviews
PUT    /api/reviews/:id/submit-mentor
PUT    /api/reviews/:id/approve-mentor
PUT    /api/reviews/:id/reject-mentor
PUT    /api/reviews/:id/submit-advisor
PUT    /api/reviews/:id/approve-advisor
PUT    /api/reviews/:id/reject-advisor
```

Full API documentation: See `server/src/routes/` directory

---

## 🎨 **Theme System**

**CRITICAL**: All components must use CSS variables for colors.

```tsx
// ✅ CORRECT - Uses theme variables
<div className="bg-background text-foreground">
  <Card className="bg-card border-border">
    <Button className="bg-primary text-primary-foreground">
      Submit
    </Button>
  </Card>
</div>

// ❌ WRONG - Hardcoded colors
<div className="bg-white text-black">
  <div className="bg-gray-100">Bad</div>
</div>
```

See `web/UI.md` for complete theme guidelines.

---

## 🔄 **WebSocket Events**

### Client → Server

```javascript
socket.emit("thread:join", { threadId });
socket.emit("message:send", { threadId, content });
socket.emit("message:read", { threadId, messageIds });
socket.emit("typing:start", { threadId });
```

### Server → Client

```javascript
socket.on("new:message", messageData);
socket.on("message:read:update", { messageIds, readerId });
socket.on("user:typing", { threadId, userId, userName });
```

**Production Note**: WebSockets run on the same port as HTTP (default: 5000)

---

## 📖 **Documentation**

- **Backend API**: See `server/src/routes/`
- **Frontend Components**: See `web/src/components/`
- **Theme Guidelines**: See `web/UI.md`
- **Database Schema**: See `server/prisma/schema.prisma`

---

## 🧪 **Testing**

```bash
# Backend tests
cd server
pnpm test

# Frontend tests
cd web
pnpm test
```

---

## 🗺️ **Roadmap**

### Phase 1: Core Platform ✅ (COMPLETED)

- ✅ Authentication & RBAC
- ✅ Real-time chat
- ✅ Mentor/Advisor assignments
- ✅ Semester review workflow
- ✅ Role-based dashboards
- ✅ Email notifications
- ✅ Dark/light theme

### Phase 2: Advanced Planning (In Progress)

- ⚠️ Drag-and-drop semester planner
- ⚠️ Course prerequisite validation
- ⚠️ Eligibility computation
- ⚠️ Auto-scheduling

### Phase 3: Visualizations (Planned)

- 📅 React Flow dependency graphs
- 📅 Student progress visualization
- 📅 Admin knowledge graph

### Phase 4: AI Integration (Planned)

- 📅 ChatBase AI advisor
- 📅 Natural language queries
- 📅 Smart recommendations

### Phase 5: Mobile & Advanced (Future)

- 📅 React Native mobile app
- 📅 Calendar integration
- 📅 GPA calculator
- 📅 Course reviews/ratings

---

## 🤝 **Contributing**

1. Create feature branch: `git checkout -b feature/name`
2. Make changes with tests
3. Follow code standards (TypeScript, theme CSS variables)
4. Open Pull Request

---

## 📄 **License**

Proprietary and confidential - AUI (Al Akhawayn University)

---

## 📞 **Support**

- Email: support@degreeplanner.com
- Issues: GitHub Issues

---

**DegreePlanner** - Empowering students to plan their academic journey with confidence. 🎓
