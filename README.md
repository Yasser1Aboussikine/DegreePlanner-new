# **DegreePlanner – Semi-Technical Comprehensive Overview**

**DegreePlanner** is an intelligent academic planning system designed specifically for AUI students.  
It combines **AI guidance**, **graph-based visualization**, and an interactive **drag-and-drop semester planner** to help students build, validate, and optimize their degree progress while adhering to academic rules, prerequisites, and catalog requirements.

The system is built as a **modern full-stack web application**, using a clean separation between the data layer (Neo4j + Prisma), the backend logic (Express), and a highly interactive frontend (Next.js, Redux Toolkit, React Flow, dnd-kit).

---

## ⚠️ **IMPORTANT: Theme System Requirements**

**ALL frontend components MUST be theme-aware to support light/dark mode switching.**

### Quick Reference for Developers

- ✅ **ALWAYS** use theme CSS variables: `bg-background`, `text-foreground`, `border-border`
- ❌ **NEVER** hardcode colors: `bg-neutral-950`, `text-white`, `bg-blue-600`
- 🧪 **TEST** all components in both light and dark modes before committing
- 📚 **READ** detailed guidelines: [apps/web/README.md](./apps/web/README.md#important-theme-system-guidelines)

### Theme CSS Variable Classes

```tsx
(bg - background, text - foreground); // Main backgrounds and text
(bg - card, text - card - foreground, border - border); // Cards and borders
(bg - primary, text - primary - foreground); // Primary buttons
(bg - secondary, text - secondary - foreground); // Secondary actions
(bg - muted, text - muted - foreground); // Subtle backgrounds
(bg - destructive, ring - ring, bg - accent); // Destructive, focus, hover
```

For complete theme development guidelines, see [apps/web/README.md](./apps/web/README.md).

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

### DegreePlan

- Has many semesters
- Stores metadata such as major/minor/specialization

### PlanSemester

- year
- term
- position (ordering)
- many planned courses

### PlannedCourse

- `courseCode` (Neo4j course link)
- status (`PLANNED`, `COMPLETED`, `DROPPED`)
- optional cached metadata (title, credits, category)

Prisma is responsible for:

- Data integrity
- Storage
- User roles
- Plan updates
- Advisor comments
- Notifications

---

# ⚙️ **Backend Architecture**

The backend is a **TypeScript Express API**, structured into:

- **Controllers** → handle requests
- **Services** → pure logic (plan validation, eligibility)
- **Neo4j utilities** → graph queries
- **Prisma** → relational data access

### Main Endpoints

```
GET    /plans/:userId         → load full plan + eligibility + validation
PUT    /plans/:userId         → update plan + validate + return eligibility

GET    /graphs/admin          → global catalog graph
GET    /graphs/student/:id    → personalized student graph

POST   /auth/login
GET    /auth/me

GET    /catalog/courses
GET    /catalog/programs
```

Backend responsibilities:

- Eligibility computation
- Validation enforcement
- Neo4j graph queries
- Role-based access control
- Data normalization
- Advisor workflows

---

# 🎨 **Frontend Architecture (Next.js + React)**

## **1. Next.js (App Router)**

- Server components where possible
- Client components for planner, graph, drag-drop

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

- React.js (App Router)
- React 19
- TypeScript
- RTK Query
- dnd-kit
- React Flow
- Tailwind CSS
- shadcn/ui

### **Backend**

- Express.js (TypeScript)
- Prisma ORM (PostgreSQL)
- neo4j-driver (Neo4j graph DB)
- JWT Authentication
- Zod validation (optional)

### **AI Integration**

- ChatBase (AI degree advising)

### **Dev Tools**

- Turborepo
- pnpm
- ESLint + Prettier
- Docker (optional)
- Nodemon for dev backend

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
- Clean monorepo architecture
