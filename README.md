# **DegreePlanner – Semi-Technical Comprehensive Overview**

**DegreePlanner** is an intelligent academic planning system designed specifically for AUI students.  
It combines **AI guidance**, **graph-based visualization**, and an interactive **drag-and-drop semester planner** to help students build, validate, and optimize their degree progress while adhering to academic rules, prerequisites, and catalog requirements.

The system is built as a **modern full-stack web application**, using a clean separation between the data layer (Neo4j + Prisma), the backend logic (Express), and a highly interactive frontend (React + Vite, Redux Toolkit, React Flow, dnd-kit).

---

## ⚠️ **IMPORTANT: Theme System Requirements**

**ALL frontend components MUST be theme-aware to support light/dark mode switching.**

### Quick Reference for Developers

- ✅ **ALWAYS** use theme CSS variables: `bg-background`, `text-foreground`, `border-border`
- ❌ **NEVER** hardcode colors: `bg-neutral-950`, `text-white`, `bg-blue-600`
- 🧪 **TEST** all components in both light and dark modes before committing
- 📚 **READ** detailed guidelines: [web/README.md](./web/README.md#important-theme-system-guidelines)

### Theme CSS Variable Classes

```tsx
(bg - background, text - foreground); // Main backgrounds and text
(bg - card, text - card - foreground, border - border); // Cards and borders
(bg - primary, text - primary - foreground); // Primary buttons
(bg - secondary, text - secondary - foreground); // Secondary actions
(bg - muted, text - muted - foreground); // Subtle backgrounds
(bg - destructive, ring - ring, bg - accent); // Destructive, focus, hover
```

For complete theme development guidelines, see [web/README.md](./web/README.md).

---

# 🧩 **Core Features**

## **1. Student Degree Planning**

Students can:

### ✔ Build a personalized degree plan

- See all their semesters
- Add/remove courses
- Rearrange courses across semesters
- View completed, planned, and missing courses

### ✔ Drag-and-drop Course Planner

Using **dnd-kit**, students can directly move courses between semesters in real time.

### ✔ Automatic Validation (Server-Side)

Every modification is validated through rules enforced by Neo4j and Prisma:

- Prerequisites
- Co-requisites
- Duplicate course detection
- Credit limits per semester
- Requirement completion (major/minor/specialization/GenEd)
- Catalog consistency

The backend returns a list of validation errors with types like:  
`E_PREREQ_MISSING`, `E_SEMESTER_CREDIT_OVERLOAD`, `E_DUPLICATE_COURSE_IN_PLAN`, etc.

### ✔ Eligibility System (“Unlocked Courses”)

Only courses whose prerequisites are satisfied in earlier semesters are **unlocked** and shown as available.  
This logic uses:

- Prisma → student’s current plan
- Neo4j → prerequisite graph
- Backend → eligibility computation per semester

The UI only shows _eligible_ courses while locking others with explanations.

---

## **2. AI-Powered Degree Advisor (ChatBase)**

Students can ask structured or open-ended questions:

- “What courses do I need for a minor in Math?”
- “Do I need CS2301 before taking CS3301?”
- “What is the best path to graduate in 3 years?”

**ChatBase** is integrated into the app and can reference the user’s degree plan, major/minor selections, and catalog information.

---

## **3. Graph-Based Visualizations (React Flow)**

### ✔ Admin Knowledge Graph

A full visual map of all AUI courses stored in Neo4j:

- Courses as nodes
- Prerequisite edges
- Co-requisite edges
- Filter by school, level, program
- Click nodes to view course metadata

This helps admins verify curriculum integrity, identify bottlenecks, and maintain catalog structure.

### ✔ Student Progress Graph

A personalized view:

- Green nodes → completed courses
- Blue → planned
- Yellow → missing
- Grey → locked
- Directed edges → prerequisite chains

Students visually understand how course choices propagate through the plan.

---

## **4. Advisor and Admin Tools**

### ✔ Advisors

- View student plans
- Comment on specific courses or semesters
- Provide approval or feedback
- Prevent editing of locked or past semesters if needed

### ✔ Admins

- Manage catalog (courses, programs, requirement groups)
- Update prerequisites (Neo4j)
- Invalidate graph data across the system
- Visualize course dependencies
- Maintain catalog year versions

---

# 💾 **Data Model Overview**

DegreePlanner uses **two complementary databases**:

## **1. Neo4j (Course Catalog Graph Database)**

Stores all academic structure:

- Nodes: `Course`, `Program`, `RequirementGroup`
- Relationships:
  - `PREREQUISITE_OF`
  - `CO_REQUISITE_OF`
  - `REQUIRES`
  - `INCLUDES`

Neo4j is responsible for:

- Prerequisite logic
- Co-requisite rules
- Requirement membership
- Curriculum graph generation

---

## **2. PostgreSQL (via Prisma ORM)**

Stores everything related to students and plans:

### User

- Only one degree plan per user (1-1 relation)
- Fields: `id`, `email`, `password`, `name`, `role`, `isActive`
- Roles: `STUDENT`, `ADMIN`, `ADVISOR`, `MENTOR`, `REGISTRAR`

### DegreePlan

- One-to-one relationship with User
- Has many PlanSemesters
- Fields: `id`, `userId`, `createdAt`, `updatedAt`
- Stores student's complete degree plan structure

### PlanSemester

- Belongs to one DegreePlan
- Has many PlannedCourses
- Fields: `id`, `degreePlanId`, `year`, `term`, `nth_semestre`, `createdAt`, `updatedAt`
- Terms: `FALL`, `SPRING`, `SUMMER`, `WINTER`
- `nth_semestre` tracks chronological order of semesters

### PlannedCourse

- Belongs to one PlanSemester
- Unique constraint on `(planSemesterId, courseCode)` - prevents duplicates per semester
- Fields: `id`, `planSemesterId`, `courseCode`, `status`, `courseTitle`, `credits`, `category`, `createdAt`, `updatedAt`
- `courseCode` links to Neo4j course data
- Status: `PLANNED`, `COMPLETED`, `DROPPED`
- Category: `GEN_ED`, `MAJOR_REQUIRED`, `MAJOR_ELECTIVE`, `MINOR_REQUIRED`, `MINOR_ELECTIVE`, `SPECIALIZATION`, `FREE_ELECTIVE`

Prisma is responsible for:

- Data integrity (foreign keys, unique constraints)
- Relational storage and queries
- User authentication and roles
- Plan CRUD operations
- Semester management
- Course enrollment tracking
- Cascading deletes (delete plan → delete semesters → delete planned courses)

---

# ⚙️ **Backend Architecture**

The backend is a **TypeScript Express API**, structured into:

- **Controllers** → handle HTTP requests, authentication, and authorization
- **Services** → pure business logic (plan validation, eligibility, CRUD operations)
- **Neo4j utilities** → graph queries for courses and prerequisites
- **Prisma** → relational data access for user plans
- **Middlewares** → authentication (JWT), authorization (RBAC), validation (Zod)
- **Routes** → endpoint definitions with middleware composition

## Service Layer

### Course Service (Neo4j)
- `course.service.ts` - 19 functions for course catalog operations
- Handles all Neo4j graph queries for courses, prerequisites, and dependencies
- No source_ids tracking (intentionally removed)
- Functions: CRUD, search, prerequisite chains, circular dependency detection

### Degree Plan Services (Prisma)
- `degreePlan.service.ts` - CRUD operations for degree plans
- `planSemester.service.ts` - CRUD operations for semesters
- `plannedCourse.service.ts` - CRUD operations for planned courses
- All services include nested relationships in queries
- Automatic data integrity through Prisma constraints

## Controller Layer

All controllers implement:
- Request validation
- User authorization (role-based + ownership checks)
- Service layer calls
- Standardized error handling
- Structured JSON responses

### Available Controllers:
- `auth.controller.ts` - signup, login, refresh, logout, me
- `courses.controller.ts` - course catalog operations
- `degreePlan.controller.ts` - degree plan management
- `planSemester.controller.ts` - semester management
- `plannedCourse.controller.ts` - planned course management

### Main Endpoints

#### Authentication
```
POST   /api/auth/signup       → register new user
POST   /api/auth/login        → authenticate user
POST   /api/auth/refresh      → refresh access token
POST   /api/auth/logout       → logout user
GET    /api/auth/me           → get current user info
```

#### Courses (Neo4j)
```
GET    /api/courses                         → get all courses (paginated)
GET    /api/courses/search?q=              → search courses
GET    /api/courses/labels                 → get all node labels
GET    /api/courses/label/:label           → get courses by label
GET    /api/courses/discipline/:discipline → get courses by discipline
GET    /api/courses/code/:course_code      → get course by code
GET    /api/courses/:id                    → get course by ID
POST   /api/courses                        → create course (ADMIN only)
PUT    /api/courses/:id                    → update course (ADMIN only)
DELETE /api/courses/:id                    → delete course (ADMIN only)

GET    /api/courses/:id/prerequisites      → get course prerequisites
GET    /api/courses/:id/dependents         → get course dependents
GET    /api/courses/:id/prerequisite-chain → get full prerequisite chain
GET    /api/courses/:id/dependent-chain    → get full dependent chain
POST   /api/courses/:id/prerequisites      → add prerequisite (ADMIN/ADVISOR)
DELETE /api/courses/:id/prerequisites/:prerequisiteId → remove prerequisite (ADMIN/ADVISOR)
```

#### Degree Plans (PostgreSQL)
```
GET    /api/degree-plans                   → get all degree plans (ADMIN/ADVISOR only)
GET    /api/degree-plans/me                → get my degree plan
GET    /api/degree-plans/user/:userId      → get degree plan by user ID
GET    /api/degree-plans/:id               → get degree plan by ID
POST   /api/degree-plans                   → create degree plan
PUT    /api/degree-plans/:id               → update degree plan
DELETE /api/degree-plans/:id               → delete degree plan
```

#### Plan Semesters (PostgreSQL)
```
GET    /api/plan-semesters                          → get all semesters (ADMIN/ADVISOR only)
GET    /api/plan-semesters/degree-plan/:degreePlanId → get semesters by degree plan
GET    /api/plan-semesters/:id                      → get semester by ID
POST   /api/plan-semesters                          → create semester
PUT    /api/plan-semesters/:id                      → update semester
DELETE /api/plan-semesters/:id                      → delete semester
```

#### Planned Courses (PostgreSQL)
```
GET    /api/planned-courses                        → get all planned courses (ADMIN/ADVISOR only)
GET    /api/planned-courses/status/:status         → get courses by status (ADMIN/ADVISOR only)
GET    /api/planned-courses/semester/:planSemesterId → get courses by semester
GET    /api/planned-courses/:id                    → get planned course by ID
POST   /api/planned-courses                        → create planned course
PUT    /api/planned-courses/:id                    → update planned course
DELETE /api/planned-courses/:id                    → delete planned course
```

#### Graph Visualizations
```
GET    /api/graphs/admin                   → global catalog graph
GET    /api/graphs/student/:id             → personalized student graph
```

### Authorization Rules

All degree plan, semester, and planned course endpoints implement role-based access control:

**Students:**
- Can only create, read, update, and delete their own degree plans and related data
- Cannot access other students' plans
- Have full control over their own planning data

**Advisors:**
- Can view all students' degree plans
- Can view all semesters and planned courses
- Cannot modify student data (view-only access)

**Admins:**
- Full access to all degree plans, semesters, and planned courses
- Can create, update, and delete any planning data
- Can manage course catalog in Neo4j
- Can modify course prerequisites and relationships

Backend responsibilities:

- Eligibility computation
- Validation enforcement
- Neo4j graph queries
- Role-based access control
- Data normalization
- Advisor workflows
- User-specific data isolation

---

# 🎨 **Frontend Architecture (React + Vite)**

## **1. React + Vite**

- Single Page Application (SPA) architecture
- Fast development with Hot Module Replacement (HMR)
- Client-side routing with React Router
- Optimized production builds

## **2. Redux Toolkit**

Stores:

- Student degree plan
- Eligibility (which courses unlocked per semester)
- Validation errors
- Auth
- Catalog metadata

RTK Query handles:

- Server communication
- Plan fetching
- Plan updates
- Catalog fetching

Everything is normalized and cached automatically.

## **3. dnd-kit**

For drag-and-drop:

- Instant optimistic UI updates
- Smooth animations
- Automatic snapping to semester zones
- Restrictions based on eligibility

## **4. React Flow**

Two graph systems:

- Admin graph (entire university catalog)
- Student graph (personalized progress)

Nodes automatically reflect:

- prerequisite satisfaction
- completion
- locked/unlocked states

---

# 🚨 **Validation Framework (Server-Side)**

Every plan update is validated through the backend.

### Possible validation error types include:

- `E_PREREQ_MISSING`
- `E_COREQ_MISSING`
- `E_COURSE_NOT_ELIGIBLE_FOR_SEMESTER`
- `E_SEMESTER_CREDIT_OVERLOAD`
- `E_DUPLICATE_COURSE_IN_PLAN`
- `E_MAJOR_REQUIREMENT_UNMET`
- and many more…

Each error includes:

```ts
{
  semesterId: string;
  courseCode: string;
  type: ValidationErrorType;
  message?: string;
}
```

Errors are displayed in UI next to the invalid course.

---

# 🔐 **Authentication & Roles**

Users can be:

- **STUDENT**
- **ADVISOR**
- **ADMIN**

JWT-based authentication with role-based middleware.  
The UI adjusts according to user role.

---



---

# 📚 **Technologies Used**

### **Frontend**

- React 19
- Vite (build tool)
- React Router (client-side routing)
- TypeScript
- Redux Toolkit + RTK Query
- dnd-kit
- React Flow
- Tailwind CSS
- shadcn/ui
- Framer Motion

### **Backend**

- Express.js (TypeScript)
- Prisma ORM (PostgreSQL)
- neo4j-driver (Neo4j graph DB)
- JWT Authentication
- Zod validation (optional)

### **AI Integration**

- ChatBase (AI degree advising)

### **Dev Tools**

- pnpm (package manager)
- ESLint + Prettier
- Docker (optional)
- Nodemon (backend development)
- Vite Dev Server (frontend development)

---

# 🧭 **Overall System Behavior**

### Students:

- Load their plan → backend fetches plan + eligibility
- Move courses → RTK updates instantly → backend validates → errors shown if needed
- Browse catalog → add eligible courses
- Consult AI advisor → suggestions based on their plan

### Advisors:

- View student plans
- Suggest or annotate changes
- Lock or approve semesters

### Admins:

- Maintain catalog in Neo4j
- Manage programs & requirement groups
- Visualize academic graph
- Invalidate catalog data

---

# 🎯 **Summary**

DegreePlanner is a **fully-modern academic planning system** combining:

- Real-time drag-and-drop
- Dynamic AI assistance
- Neo4j-powered prerequisite logic
- Graph visualization
- Strict server-side validation
- Modern full-stack architecture with React + Vite frontend and Express backend

If you're an AI, do not use comments
