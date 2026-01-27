# Project Coding Standards & Guidelines

## General Principles
- **Consistency > Cleverness**.
- **User Experience**: The app should feel "alive" (Optimistic UI, Toasts).
- **Security**: Secrets in Envs, strict isolation.

## 1. Naming Conventions

### Frontend (React/TS)
| Type | Convention | Example |
|------|------------|---------|
| Components (Files/Experts) | **PascalCase** | `DashboardTable.tsx` |
| Utilities/Hooks | **camelCase** | `useAuth.ts`, `formatDate.ts` |
| Variables/Functions | **camelCase** | `isLoading`, `handleSubmit` |
| Interfaces | **PascalCase** | `UserProps` (No "I" prefix) |
| Boolean Props | **is/has/should** | `isOpen`, `hasError` |

### Backend (Python/FastAPI)
| Type | Convention | Example |
|------|------------|---------|
| Variables/Functions | **snake_case** | `user_id`, `get_qr_code()` |
| Classes | **PascalCase** | `class Idea(BaseModel):` |
| Constants | **UPPER_SNAKE** | `MAX_RETRIES = 3` |
| API Paths | **kebab-case** | `/api/v1/ideas/create` |

---

## 2. Project Structure

### Feature-First Architecture
- Avoid dumping everything in `/components`.
- Group by Feature where possible.
- **Dumb/Presentational**: `components/ui` (Props only, no state).
- **Smart/Container**: `pages/` (Manage state, fetch data).
- **Barrel Exports**: Keep imports clean.

### Separation of Concerns
- **Backend Layers**:
    - `routers`: Parsing only. Calls Service.
    - `services`: Business Logic.
    - `db/crud`: Database Interaction.
    - `schemas`: Pydantic Models (IO).

---

## 3. Code Quality

### TypeScript
- **No `any` types**. Define interfaces for API responses.
- **Centralized API Routes**: No hardcoded API strings in components.

### React Pattern
- **Custom Hooks**: UI components should not contain raw API calls. Use hooks (e.g., `useIdeas`).
- **Data Fetching**: Use libraries or centralized hooks. Avoid manual `useEffect` for data fetching in generic components.
- **Validation**: Schema-based (Zod) or Pydantic (Backend).

### Async/State
- **Server vs Client State**: Separate them.
- **Optimistic UI**: Update UI immediately, rollback on error.

---

## 4. Backend Standards (Python)

### Database (MongoDB/SQL)
- **Naming**: `snake_case` for collections/tables and fields/columns.
- **Async**: Await every DB call.
- **Validation**: Return Pydantic `ResponseModel`, not raw DB objects.

### Security
- **Env Vars**: Prefix with `SECRET_`, `KEY_`, `API_`.
- **Private**: Never leak DB passwords to browser.
- **Middleware**: Protect routes.

### Logging
- **Structured JSON**: `timestamp`, `level`, `service`, `request_id`.
- **No PII**: Sanitize logs.

### Error Handling
- **Fail Fast**: Log FATAL if unrecoverable.
- **Standardized Errors**: Code, Message, Request ID.
