from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate
from app.services import task as task_service


router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"],
)


@router.get(
    "",
    response_model=List[TaskResponse],
    summary="Get all tasks",
    description="Retrieve all tasks from the database. Returns an empty list if no tasks exist.",
)
@router.get(
    "/",
    response_model=List[TaskResponse],
    include_in_schema=False,
)
def get_tasks(db: Session = Depends(get_db)) -> List[TaskResponse]:
    """Retrieve all tasks from PostgreSQL."""
    return task_service.get_all_tasks(db=db)


@router.post(
    "",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new task",
    description="Create a new task record with title, optional description, and status (defaults to 'Todo').",
)
@router.post(
    "/",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False,
)
def create_task(
    task_in: TaskCreate,
    db: Session = Depends(get_db),
) -> TaskResponse:
    """Create a new task record."""
    return task_service.create_task(db=db, task_in=task_in)


@router.put(
    "/{id}",
    response_model=TaskResponse,
    summary="Update an existing task",
    description="Update a task's title, description, or status by its ID.",
)
def update_task(
    id: int,
    task_in: TaskUpdate,
    db: Session = Depends(get_db),
) -> TaskResponse:
    """Update task by ID. Returns 404 if the task is not found."""
    updated_task = task_service.update_task(db=db, task_id=id, task_in=task_in)
    if not updated_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {id} not found",
        )
    return updated_task


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a task",
    description="Permanently delete a task by its ID.",
)
def delete_task(
    id: int,
    db: Session = Depends(get_db),
) -> Response:
    """Delete task by ID. Returns 204 on success, 404 if not found."""
    deleted = task_service.delete_task(db=db, task_id=id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {id} not found",
        )
    return Response(status_code=status.HTTP_204_NO_CONTENT)

