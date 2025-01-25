"""Create initial vote models

Revision ID: 38150b2cce0b
Revises:
Create Date: 2025-01-25 18:19:28.076151

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "38150b2cce0b"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "votes",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column(
            "status",
            sa.Enum("Pending", "Open", "Closed", name="votestatus", native_enum=False),
            nullable=False,
        ),
        sa.Column("owner_id", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "vote_options",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("vote_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["vote_id"],
            ["votes.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("vote_options")
    op.drop_table("votes")
