# RTK Query Store

This folder contains the Redux Toolkit Query setup for the DegreePlanner application.

## Structure

```
store/
├── api/
│   ├── apiSlice.ts          # Base API configuration
│   ├── authApi.ts            # Authentication endpoints
│   ├── coursesApi.ts         # Course management endpoints
│   ├── degreePlanApi.ts      # Degree plan endpoints
│   ├── planSemesterApi.ts    # Plan semester endpoints
│   ├── plannedCourseApi.ts   # Planned course endpoints
│   └── index.ts              # API exports
├── types/
│   └── index.ts              # TypeScript type definitions
├── hooks.ts                  # Typed Redux hooks
├── store.ts                  # Redux store configuration
└── index.ts                  # Main exports
```

## Setup

The store is already configured. You just need to wrap your app with the Redux Provider in `main.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
```

## Environment Variables

Create a `.env` file in the `web` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

## Usage Examples

### Authentication

```tsx
import { useLoginMutation, useGetMeQuery } from './store';

function LoginForm() {
  const [login, { isLoading, error }] = useLoginMutation();
  const { data: user } = useGetMeQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      console.log('Logged in:', result.user);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Courses

```tsx
import {
  useGetAllCoursesQuery,
  useSearchCoursesQuery,
  useGetCourseByIdQuery
} from './store';

function CourseList() {
  const { data: courses, isLoading, error } = useGetAllCoursesQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading courses</div>;

  return (
    <div>
      {courses?.map(course => (
        <div key={course.id}>{course.course_title}</div>
      ))}
    </div>
  );
}

// Search courses
function SearchCourses() {
  const [query, setQuery] = useState('');
  const { data: results } = useSearchCoursesQuery(query, {
    skip: query.length < 2, // Don't search until 2+ chars
  });

  return <div>...</div>;
}
```

### Degree Plans

```tsx
import {
  useGetMyDegreePlanQuery,
  useCreateDegreePlanMutation,
  useUpdateDegreePlanMutation
} from './store';

function MyDegreePlan() {
  const { data: plan, isLoading } = useGetMyDegreePlanQuery();
  const [createPlan] = useCreateDegreePlanMutation();
  const [updatePlan] = useUpdateDegreePlanMutation();

  const handleCreatePlan = async (userId: string) => {
    try {
      await createPlan({ userId }).unwrap();
    } catch (err) {
      console.error('Failed to create plan:', err);
    }
  };

  return <div>...</div>;
}
```

### Plan Semesters

```tsx
import {
  useGetPlanSemestersByDegreePlanIdQuery,
  useCreatePlanSemesterMutation
} from './store';

function SemesterList({ degreePlanId }: { degreePlanId: string }) {
  const { data: semesters } = useGetPlanSemestersByDegreePlanIdQuery(degreePlanId);
  const [createSemester] = useCreatePlanSemesterMutation();

  const handleAddSemester = async () => {
    await createSemester({
      degreePlanId,
      year: 2024,
      term: 'FALL',
      nth_semestre: 1,
    });
  };

  return <div>...</div>;
}
```

### Planned Courses

```tsx
import {
  useGetPlannedCoursesByPlanSemesterIdQuery,
  useCreatePlannedCourseMutation,
  useUpdatePlannedCourseMutation
} from './store';

function PlannedCourses({ semesterId }: { semesterId: string }) {
  const { data: courses } = useGetPlannedCoursesByPlanSemesterIdQuery(semesterId);
  const [createCourse] = useCreatePlannedCourseMutation();
  const [updateCourse] = useUpdatePlannedCourseMutation();

  const handleAddCourse = async () => {
    await createCourse({
      planSemesterId: semesterId,
      courseCode: 'CSC3309',
      status: 'PLANNED',
      category: 'COMPUTER_SCIENCE',
    });
  };

  const handleUpdateStatus = async (id: string, status: PlannedCourseStatus) => {
    await updateCourse({ id, data: { status } });
  };

  return <div>...</div>;
}
```

## Features

- **Automatic Caching**: RTK Query automatically caches data and manages cache invalidation
- **Optimistic Updates**: UI updates immediately, rolls back on error
- **Automatic Refetching**: Data refetches when needed (on focus, reconnect, etc.)
- **TypeScript Support**: Full type safety throughout
- **Normalized Cache**: Efficient data storage and updates
- **Tag-based Invalidation**: Smart cache invalidation using tags

## Available Hooks

### Auth API
- `useSignupMutation`
- `useLoginMutation`
- `useRefreshMutation`
- `useLogoutMutation`
- `useGetMeQuery`

### Courses API
- `useGetAllCoursesQuery`
- `useSearchCoursesQuery`
- `useGetCourseByIdQuery`
- `useGetCoursesByLabelQuery`
- `useGetCoursesByDisciplineQuery`
- `useGetCourseByCourseCodeQuery`
- `useCreateCourseMutation`
- `useUpdateCourseMutation`
- `useDeleteCourseMutation`
- `useGetCoursePrerequisitesQuery`
- `useGetCourseDependentsQuery`
- `useGetPrerequisiteChainQuery`
- `useGetDependentChainQuery`
- `useAddPrerequisiteMutation`
- `useRemovePrerequisiteMutation`

### Degree Plan API
- `useGetAllDegreePlansQuery`
- `useGetMyDegreePlanQuery`
- `useGetDegreePlanByUserIdQuery`
- `useGetDegreePlanByIdQuery`
- `useCreateDegreePlanMutation`
- `useUpdateDegreePlanMutation`
- `useDeleteDegreePlanMutation`

### Plan Semester API
- `useGetAllPlanSemestersQuery`
- `useGetPlanSemestersByDegreePlanIdQuery`
- `useGetPlanSemesterByIdQuery`
- `useCreatePlanSemesterMutation`
- `useUpdatePlanSemesterMutation`
- `useDeletePlanSemesterMutation`

### Planned Course API
- `useGetAllPlannedCoursesQuery`
- `useGetPlannedCoursesByStatusQuery`
- `useGetPlannedCoursesByPlanSemesterIdQuery`
- `useGetPlannedCourseByIdQuery`
- `useCreatePlannedCourseMutation`
- `useUpdatePlannedCourseMutation`
- `useDeletePlannedCourseMutation`

All query hooks also have lazy versions (e.g., `useLazyGetAllCoursesQuery`) for manual triggering.
