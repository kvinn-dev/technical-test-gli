# System Design — Task Tracker

## 1. Document Information

| Item              | Description                 |
| ----------------- | --------------------------- |
| Project           | Simple Task/Project Tracker |
| Product name (UI) | TaskFlow                    |
| Repository name   | `task-tracker`              |
| Document          | System Design               |
| Version           | 1.0                         |
| Status            | Proposed design             |

This document describes the proposed architecture, database design, API contract, project structure, frontend state management, and development configuration for the Task Tracker technical test.

## 2. System Architecture

The application uses a **Client-Server architecture with REST API communication**.

```mermaid
flowchart TD
    A[React Frontend] <-->|HTTP / JSON| B[FastAPI Backend]
    B --> C[SQLAlchemy ORM]
    C <-->|SQL| D[(PostgreSQL)]
```

### Component Responsibilities

| Component          | Responsibility                                                            |
| ------------------ | ------------------------------------------------------------------------- |
| React + TypeScript | Renders the user interface and manages client-side state.                 |
| Axios              | Sends HTTP requests from the frontend to the backend.                     |
| FastAPI            | Exposes REST API endpoints and coordinates request handling.              |
| Pydantic           | Validates request and response data.                                      |
| Service layer      | Contains application/business logic.                                      |
| SQLAlchemy         | Maps Python objects to database records and performs database operations. |
| PostgreSQL         | Persistently stores task data.                                            |

The frontend must not connect directly to PostgreSQL. All data access goes through the FastAPI backend.

### Example Request Flow: Create Task

1. The user fills out the task form in React.
2. React sends a `POST /tasks` request through Axios.
3. FastAPI receives the request through its task router.
4. Pydantic validates the request data.
5. The service layer performs the required application logic.
6. SQLAlchemy writes the task to PostgreSQL.
7. FastAPI returns a JSON response.
8. React updates the task list after a successful response.

## 3. Database Design

### 3.1 Database

- **DBMS:** PostgreSQL
- **Database name:** `task_tracker`
- **Initial table:** `tasks`

The application will initialize the required table automatically at startup using SQLAlchemy `Base.metadata.create_all(bind=engine)`, as permitted by the technical test.

### 3.2 Entity: `tasks`

| Column        | Suggested type | Constraints / Description                                       |
| ------------- | -------------- | --------------------------------------------------------------- |
| `id`          | INTEGER        | Primary key; generated automatically.                           |
| `title`       | VARCHAR(255)   | NOT NULL; task title.                                           |
| `description` | TEXT           | Nullable; optional task description.                            |
| `status`      | VARCHAR(20)    | NOT NULL; allowed values are `Todo`, `In Progress`, and `Done`. |
| `created_at`  | TIMESTAMPTZ    | Creation timestamp.                                             |
| `updated_at`  | TIMESTAMPTZ    | Last-update timestamp.                                          |

There are no relationships to other tables in the initial scope.

### 3.3 Data Integrity

- The backend validates that the title is not empty or whitespace-only.
- The backend validates that status is one of the allowed values.
- A database `CHECK` constraint is proposed for the allowed status values, so invalid statuses are also rejected at the database level.
- `created_at` is set when a task is created.
- `updated_at` is refreshed when a task is updated.

The final SQLAlchemy model and exact timestamp/default behavior will be confirmed during implementation.

## 4. REST API Contract

**Base URL (development):** `http://localhost:8000`

| Method | Endpoint      | Purpose                        |
| ------ | ------------- | ------------------------------ |
| GET    | `/tasks`      | Retrieve all tasks.            |
| POST   | `/tasks`      | Create a task.                 |
| PUT    | `/tasks/{id}` | Fully update an existing task. |
| DELETE | `/tasks/{id}` | Delete a task.                 |

### 4.1 GET `/tasks`

Returns all tasks.

Example response (`200 OK`):

```json
[
  {
    "id": 1,
    "title": "Build Task Tracker",
    "description": "Develop REST API",
    "status": "Todo",
    "created_at": "2026-11-13T08:00:00Z",
    "updated_at": "2026-11-13T08:00:00Z"
  }
]
```

### 4.2 POST `/tasks`

Creates a new task.

Example request:

```json
{
  "title": "Build REST API",
  "description": "Implement CRUD endpoints",
  "status": "Todo"
}
```

Example response (`201 Created`):

```json
{
  "id": 2,
  "title": "Build REST API",
  "description": "Implement CRUD endpoints",
  "status": "Todo",
  "created_at": "2026-11-13T08:00:00Z",
  "updated_at": "2026-11-13T08:00:00Z"
}
```

### 4.3 PUT `/tasks/{id}`

Fully updates an existing task. The frontend sends all editable fields, even when the user only changes the status.

Example request:

```json
{
  "title": "Build Task Tracker",
  "description": "Implement all CRUD endpoints",
  "status": "In Progress"
}
```

Successful response: `200 OK`, containing the updated task.

### 4.4 DELETE `/tasks/{id}`

Permanently deletes the task (hard delete).

Successful response: `204 No Content`, with no response body.

### 4.5 HTTP Status Codes

| Status | Meaning / Use                  |
| ------ | ------------------------------ |
| 200    | Request succeeded.             |
| 201    | Resource created.              |
| 204    | Resource deleted successfully. |
| 404    | Task does not exist.           |
| 422    | Request validation failed.     |
| 500    | Unexpected server error.       |

The backend should return clear, consistent error responses. Exact error response schemas can be finalized during implementation.

## 5. Project Structure

The project will use a single Git repository (monorepo) with separate frontend and backend applications.

```text
task-tracker/
├── docs/
│   ├── requirements.md
│   └── system-design.md
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── TaskCard.tsx
│       │   ├── TaskForm.tsx
│       │   └── TaskList.tsx
│       ├── api/
│       │   └── taskApi.ts
│       ├── types/
│       │   └── task.ts
│       ├── App.tsx
│       └── main.tsx
│
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   └── task.py
│   │   ├── schemas/
│   │   │   └── task.py
│   │   ├── routers/
│   │   │   └── task.py
│   │   ├── services/
│   │   │   └── task.py
│   │   ├── database.py
│   │   └── main.py
│   ├── .env.example
│   └── requirements.txt
│
├── .gitignore
└── README.md
```

### Backend Modules

| Module        | Responsibility                                                  |
| ------------- | --------------------------------------------------------------- |
| `models/`     | SQLAlchemy database models.                                     |
| `schemas/`    | Pydantic request and response schemas.                          |
| `routers/`    | HTTP route definitions and request/response handling.           |
| `services/`   | Business logic and orchestration of database operations.        |
| `database.py` | Database engine, session factory, and dependency setup.         |
| `main.py`     | FastAPI application creation, CORS, and startup initialization. |

### Frontend Modules

| Module        | Responsibility                   |
| ------------- | -------------------------------- |
| `components/` | Reusable UI components.          |
| `services/`   | API communication using Axios.   |
| `types/`      | TypeScript interfaces and types. |
| `App.tsx`     | Main application component.      |
| `main.tsx`    | React application entry point.   |

This structure is a starting point and may be adjusted if implementation reveals a clear need.

## 6. Frontend State Management

The initial application does not require Redux or Zustand. React Hooks are sufficient.

| Hook        | Responsibility                                        |
| ----------- | ----------------------------------------------------- |
| `useState`  | Stores task data, form values, and relevant UI state. |
| `useEffect` | Fetches the initial task list when the page loads.    |

### State Update Policy

- Fetch tasks when the application page is initialized.
- After a successful create, update the displayed task list.
- After a successful update, reflect the updated task data.
- After a successful delete, remove the task from the displayed list.
- If an API operation fails, show an error and do not falsely represent the operation as successful.

A local state update or a refetch after a successful mutation may be used. The implementation should remain simple and consistent.

## 7. Development Environment and Configuration

### 7.1 Local Services

| Component            | Development address          |
| -------------------- | ---------------------------- |
| React + Vite         | `http://localhost:5173`      |
| FastAPI              | `http://localhost:8000`      |
| FastAPI OpenAPI docs | `http://localhost:8000/docs` |
| PostgreSQL           | `localhost:5432`             |

### 7.2 Backend Environment Variables

Example `backend/.env`:

```env
DATABASE_URL=postgresql+psycopg://task_user:password@localhost:5432/task_tracker
```

Example `backend/.env.example`:

```env
DATABASE_URL=postgresql+psycopg://task_user:your_password@localhost:5432/task_tracker
```

### 7.3 Frontend Environment Variables

Example `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### 7.4 Configuration and Security Rules

- Load database credentials from environment variables.
- Do not hard-code credentials in source code.
- Add actual `.env` files to `.gitignore`.
- Commit `.env.example` with placeholder values only.
- Configure FastAPI CORS to allow the frontend development origin (`http://localhost:5173`).

## 8. Technology Decisions

| Layer                   | Technology                   | Reason / Responsibility                       |
| ----------------------- | ---------------------------- | --------------------------------------------- |
| Frontend                | React                        | Component-based UI.                           |
| Frontend tooling        | Vite                         | Frontend development and build tooling.       |
| Language                | TypeScript                   | Static typing for frontend code.              |
| Styling                 | Tailwind CSS                 | UI styling and responsive layouts.            |
| HTTP client             | Axios                        | HTTP communication with the API.              |
| Backend                 | FastAPI                      | Python REST API framework.                    |
| ORM                     | SQLAlchemy 2.0               | Database mapping and access.                  |
| Validation              | Pydantic                     | Request and response validation.              |
| Database                | PostgreSQL                   | Relational data persistence.                  |
| Driver                  | Psycopg 3                    | Python PostgreSQL connectivity.               |
| Configuration           | Environment variables        | Externalized application configuration.       |
| API documentation       | FastAPI OpenAPI / Swagger UI | Interactive API documentation.                |
| Database initialization | SQLAlchemy `create_all()`    | Create missing tables at application startup. |

Alembic is not required for the initial implementation. It may be introduced if schema evolution becomes more complex. `create_all()` creates missing tables but does not automatically migrate existing tables when their definitions change.

## 9. Design Constraints and Out of Scope

### In Scope

- Task listing.
- Task creation.
- Task updates.
- Task status changes.
- Task deletion.
- PostgreSQL integration.
- Backend validation.
- Frontend/backend integration.
- Basic responsive UI.
- Setup and execution documentation.

### Out of Scope

- Authentication and registration.
- Multiple users and role-based access control.
- Notifications and reminders.
- WebSocket-based real-time updates.
- Drag-and-drop task management.
- Advanced analytics and reporting.

Additional features should only be considered after all required features are implemented and tested.

## 10. Implementation Notes and Open Decisions

The following details should be confirmed during implementation:

1. Whether the status is represented as a Python enum or a validated string, while preserving the exact API values.
2. The exact database defaults and timestamp update behavior.
3. The consistent API error response format.
4. Whether the frontend updates local state or refetches the task list after successful mutations.
5. The final UI layout and responsive behavior.

These decisions should not change the required endpoints or the technical test's core behavior.

## 11. Design Summary

The proposed solution is a small full-stack application using:

- React + Vite + TypeScript for the frontend.
- FastAPI for REST API endpoints.
- Pydantic for input validation.
- SQLAlchemy 2.0 for database access.
- PostgreSQL for persistent storage.
- Axios for frontend/backend communication.
- React Hooks for client-side state management.

The design prioritizes correctness, maintainability, clear separation of responsibilities, and completion of the technical test requirements without unnecessary complexity.
