"""Create vote model

Revision ID: 56f717a43418
Revises: 6626d979599d
Create Date: 2025-02-22 15:15:50.710801

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "56f717a43418"
down_revision: Union[str, None] = "6626d979599d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "votes",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("poll_id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.String(), nullable=False),
        sa.Column("vote", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(
            ["poll_id"],
            ["polls.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("votes")
