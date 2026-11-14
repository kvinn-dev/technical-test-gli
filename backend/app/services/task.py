from typing import List, Optional

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate


def get_all_tasks(db: Session) -> List[Task]:
    """
    Retrieve all tasks from the database ordered by creation date ascending.

    Args:
        db: Active SQLAlchemy database session.

    Returns:
        List of Task ORM instances.
    """
    stmt = select(Task).order_by(Task.id.asc())
    return list(db.scalars(stmt).all())


def get_task_by_id(db: Session, task_id: int) -> Optional[Task]:
    """
    Retrieve a single task by its primary key ID.

    Args:
        db: Active SQLAlchemy database session.
        task_id: Unique task identifier.

    Returns:
        Task instance if found, None otherwise.
    """
    return db.get(Task, task_id)


def create_task(db: Session, task_in: TaskCreate) -> Task:
    """
    Create and persist a new task in PostgreSQL.

    Args:
        db: Active SQLAlchemy database session.
        task_in: Validated task creation data.

    Returns:
        The newly created and refreshed Task instance.
    """
    db_task = Task(
        title=task_in.title,
        description=task_in.description,
        status=task_in.status.value,
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def update_task(db: Session, task_id: int, task_in: TaskUpdate) -> Optional[Task]:
    """
    Update an existing task by its ID.

    Args:
        db: Active SQLAlchemy database session.
        task_id: Unique task identifier to update.
        task_in: Validated task update payload.

    Returns:
        Updated Task instance, or None if the task does not exist.
    """
    db_task = get_task_by_id(db, task_id)
    if not db_task:
        return None

    db_task.title = task_in.title
    db_task.description = task_in.description
    db_task.status = task_in.status.value
    db_task.updated_at = func.now()

    db.commit()
    db.refresh(db_task)
    return db_task


def delete_task(db: Session, task_id: int) -> bool:
    """
    Hard delete a task by its ID from PostgreSQL.

    Args:
        db: Active SQLAlchemy database session.
        task_id: Unique task identifier to delete.

    Returns:
        True if the task was found and deleted, False if not found.
    """
    db_task = get_task_by_id(db, task_id)
    if not db_task:
        return False

    db.delete(db_task)
    db.commit()
    return True