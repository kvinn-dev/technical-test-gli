"""add_task_status_check_constraint

Revision ID: 511849a1feae
Revises: 1bc2d0e7f5b9
Create Date: 2026-11-14 09:45:57.613642

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '511849a1feae'
down_revision: Union[str, Sequence[str], None] = '1bc2d0e7f5b9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema: add check constraint on status column."""
    op.create_check_constraint(
        "ck_tasks_status",
        "tasks",
        "status IN ('Todo', 'In Progress', 'Done')",
    )


def downgrade() -> None:
    """Downgrade schema: remove check constraint on status column."""
    op.drop_constraint("ck_tasks_status", "tasks", type_="check")
