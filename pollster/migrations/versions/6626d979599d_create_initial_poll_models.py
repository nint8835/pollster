"""Create initial poll models

Revision ID: 6626d979599d
Revises:
Create Date: 2025-02-01 13:03:14.731528

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "6626d979599d"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "polls",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column(
            "status",
            sa.Enum("Pending", "Open", "Closed", name="pollstatus", native_enum=False),
            nullable=False,
        ),
        sa.Column("owner_id", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "poll_options",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("poll_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["poll_id"],
            ["polls.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("poll_options")
    op.drop_table("polls")
