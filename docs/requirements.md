# Requirements — Simple Task/Project Tracker

## 1. Project Overview

**Project name:** Simple Task/Project Tracker  
**Project type:** Full-stack web application  
**Purpose:** A simple application for recording tasks, viewing the task list, updating task information and status, and deleting tasks.

The application consists of:

- **Frontend:** React (with Vite and TypeScript)
- **Backend:** Python with FastAPI
- **Database:** PostgreSQL

The frontend communicates with the backend through a REST API. The backend validates incoming data and persists task records in PostgreSQL.

## 2. Objectives

The application is intended to demonstrate the ability to:

1. Build a REST API using Python.
2. Consume the API from a React frontend.
3. Implement Create, Read, Update, and Delete (CRUD) operations.
4. Integrate the backend with PostgreSQL.
5. Manage frontend state after successful API operations.
6. Apply input validation and maintain clean, understandable code.

## 3. Users and Assumptions

### 3.1 User

The initial scope assumes a single general user interacting with the application.

### 3.2 Assumptions

The following are implementation decisions for this project, not additional requirements explicitly stated in the test brief:

- Authentication and user accounts are out of scope.
- A task must have a title.
- A task description is optional.
- A new task defaults to the `Todo` status when no status is supplied.
- Deleting a task permanently removes its record (hard delete).
- Task status is limited to `Todo`, `In Progress`, or `Done`.

## 4. Functional Requirements

| ID    | Requirement         | Description                                                               |
| ----- | ------------------- | ------------------------------------------------------------------------- |
| FR-01 | View Tasks          | The user can retrieve and view all tasks stored in the database.          |
| FR-02 | Create Task         | The user can create a task by providing a title, description, and status. |
| FR-03 | Update Task         | The user can update an existing task's title, description, or status.     |
| FR-04 | Delete Task         | The user can delete an existing task by its ID.                           |
| FR-05 | Display Task Status | The task list displays each task's current status.                        |

## 5. API Requirements

The backend must expose the following REST API endpoints:

| Method | Endpoint      | Purpose              |
| ------ | ------------- | -------------------- |
| GET    | `/tasks`      | Retrieve all tasks.  |
| POST   | `/tasks`      | Create a new task.   |
| PUT    | `/tasks/{id}` | Update a task by ID. |
| DELETE | `/tasks/{id}` | Delete a task by ID. |

### 5.1 Create Task Payload

```json
{
  "title": "Build REST API",
  "description": "Create task endpoints",
  "status": "Todo"
}
```

### 5.2 Validation Rules

- `title` must not be empty or contain only whitespace.
- `status` must be one of: `Todo`, `In Progress`, or `Done`.
- `description` may be empty or omitted if the implementation treats it as optional.
- The backend must validate incoming request data before performing database operations.
- The API should return appropriate HTTP status codes and clear error responses.

## 6. Database Requirements

### 6.1 Database Technology

- PostgreSQL is mandatory.
- Database connection settings must be read from environment variables.
- Database credentials must not be hard-coded in application source code.
- The application must be able to create the required database table(s) automatically when it starts, as required by the technical test.

### 6.2 Initial Data Model

**Table: `tasks`**

| Column        | Suggested type | Constraints / Description              |
| ------------- | -------------- | -------------------------------------- |
| `id`          | Integer        | Primary key; generated automatically.  |
| `title`       | VARCHAR(255)   | Required; task title.                  |
| `description` | TEXT           | Optional; task description.            |
| `status`      | VARCHAR(20)    | Required; one of the allowed statuses. |
| `created_at`  | TIMESTAMP      | Time the record was created.           |
| `updated_at`  | TIMESTAMP      | Time the record was last updated.      |

The final schema will be confirmed during system design.

## 7. Frontend Requirements

- Use React to build the user interface.
- Use `fetch` or Axios to send HTTP requests to the backend.
- Display tasks retrieved from the backend API.
- Provide a form to create tasks without reloading the page.
- Provide a control to update a task's status.
- Provide a button to delete a task.
- Update the displayed state after a successful POST, PUT, or DELETE request.
- Provide clear loading, empty, success, and error states where appropriate.
- Make the interface clean, responsive, and easy to use.

## 8. Non-Functional Requirements

| ID     | Requirement            | Description                                                                                 |
| ------ | ---------------------- | ------------------------------------------------------------------------------------------- |
| NFR-01 | Maintainability        | Organize code into clear modules with separation of concerns.                               |
| NFR-02 | Data Validation        | Validate input on the backend before processing it.                                         |
| NFR-03 | Configuration Security | Keep database credentials in environment variables and exclude `.env` from version control. |
| NFR-04 | Cross-Origin Access    | Configure CORS so the frontend can access the backend.                                      |
| NFR-05 | Usability              | Provide a clean, responsive, and understandable interface.                                  |
| NFR-06 | State Consistency      | Keep the frontend display consistent with successful backend operations.                    |
| NFR-07 | Documentation          | Provide clear setup and run instructions in the repository README.                          |

## 9. Acceptance Criteria

The application is considered functionally complete when the following conditions are met:

### Task List

- [ ] The application can retrieve tasks from the backend.
- [ ] The task list displays the task title, description, and status.
- [ ] An appropriate empty state is shown when there are no tasks.

### Create Task

- [ ] The user can submit a new task without a full page reload.
- [ ] A valid task is saved to PostgreSQL.
- [ ] An empty or whitespace-only title is rejected.
- [ ] An invalid status is rejected.
- [ ] The task list reflects the newly created task after success.

### Update Task

- [ ] The user can update a task's title, description, or status.
- [ ] The updated values are persisted in PostgreSQL.
- [ ] The task list reflects the updated values after success.
- [ ] A request for a non-existent task returns an appropriate error response.

### Delete Task

- [ ] The user can delete a task.
- [ ] The task is removed from PostgreSQL.
- [ ] The task disappears from the displayed list after success.
- [ ] A request for a non-existent task returns an appropriate error response.

### Integration and Delivery

- [ ] The React frontend can communicate with the FastAPI backend.
- [ ] CORS is configured for the frontend origin.
- [ ] Database configuration is loaded from environment variables.
- [ ] Required database tables are initialized automatically at application startup.
- [ ] The repository contains a README with prerequisites and setup instructions.

## 10. Scope and Limitations

### In Scope

- Task listing.
- Task creation.
- Task updates.
- Task status changes.
- Task deletion.
- PostgreSQL integration.
- Backend input validation.
- Frontend/backend integration.
- Basic responsive UI.
- Project setup documentation.

### Out of Scope

The following features are not required for the initial submission:

- User registration and authentication.
- Multiple users and role-based access control.
- Notifications and reminders.
- Real-time updates using WebSockets.
- Drag-and-drop task management.
- Advanced analytics or reporting.

These features should only be considered if all required functionality is complete and there is sufficient time.

## 11. Proposed Technology Stack

| Layer            | Technology                     | Responsibility                                 |
| ---------------- | ------------------------------ | ---------------------------------------------- |
| Frontend         | React                          | User interface and client-side state.          |
| Frontend tooling | Vite                           | Development server and production build.       |
| Language         | TypeScript                     | Static typing for frontend code.               |
| Styling          | Tailwind CSS                   | Responsive UI styling.                         |
| HTTP client      | Axios                          | API communication.                             |
| Backend          | FastAPI                        | REST API implementation.                       |
| ORM              | SQLAlchemy                     | Database access and object-relational mapping. |
| Validation       | Pydantic                       | Request and response validation.               |
| Database         | PostgreSQL                     | Persistent task storage.                       |
| Database driver  | Psycopg                        | Python-to-PostgreSQL connectivity.             |
| Configuration    | Environment variables (`.env`) | Local application configuration.               |

## 12. Delivery Requirements

The final submission must include:

- A Git repository hosted on GitHub or GitLab.
- Public repository access, or collaborator access granted to the evaluator.
- A root-level `README.md` containing comprehensive setup and execution instructions.
- Frontend and backend source code.
- An environment example file (for example, `.env.example`) without real credentials.
- No committed secrets, passwords, or local environment files.
