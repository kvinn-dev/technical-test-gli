from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


class TaskStatus(str, Enum):
    """Enumeration of allowed task status values."""

    TODO = "Todo"
    IN_PROGRESS = "In Progress"
    DONE = "Done"


class TaskBase(BaseModel):
    """Shared properties across task schemas."""

    title: str = Field(
        ...,
        max_length=255,
        description="Title of the task (cannot be empty or whitespace only)",
    )
    description: Optional[str] = Field(
        default=None,
        description="Optional description providing more detail about the task",
    )

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        """Ensure title is not empty or composed solely of whitespace."""
        if not value or not value.strip():
            raise ValueError("Title cannot be empty or contain only whitespace")
        return value.strip()


class TaskCreate(TaskBase):
    """Schema for creating a new task."""

    status: TaskStatus = Field(
        default=TaskStatus.TODO,
        description="Initial status of the task. Defaults to 'Todo'.",
    )


class TaskUpdate(TaskBase):
    """Schema for updating an existing task."""

    status: TaskStatus = Field(
        default=TaskStatus.TODO,
        description="Updated status of the task ('Todo', 'In Progress', or 'Done').",
    )


class TaskResponse(TaskBase):
    """Schema for task response returned to API clients."""

    id: int = Field(..., description="Unique identifier for the task")
    status: TaskStatus = Field(..., description="Current status of the task")
    created_at: datetime = Field(..., description="Timestamp when task was created")
    updated_at: datetime = Field(..., description="Timestamp when task was last updated")

    model_config = ConfigDict(from_attributes=True)

