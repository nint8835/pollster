"""Add field to allow opting in to showing results to users

Revision ID: ad3c2d856b53
Revises: 56f717a43418
Create Date: 2025-03-22 14:38:22.757038

"""

import enum
import typing
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column

# revision identifiers, used by Alembic.
revision: str = "ad3c2d856b53"
down_revision: Union[str, None] = "56f717a43418"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


class Base(AsyncAttrs, DeclarativeBase):
    type_annotation_map = {
        enum.Enum: sa.Enum(enum.Enum, native_enum=False),
        typing.Literal: sa.Enum(enum.Enum, native_enum=False),
    }


class Poll(Base):
    __tablename__ = "polls"

    id: Mapped[int] = mapped_column(primary_key=True)
    allow_users_to_view_results: Mapped[bool]


def upgrade() -> None:
    bind = op.get_bind()
    session = Session(bind=bind)

    with op.batch_alter_table("polls", schema=None) as batch_op:
        batch_op.add_column(
            sa.Column("allow_users_to_view_results", sa.Boolean(), nullable=True)
        )

    session.execute(sa.update(Poll).values(allow_users_to_view_results=False))
    session.commit()

    with op.batch_alter_table("polls", schema=None) as batch_op:
        batch_op.alter_column(
            "allow_users_to_view_results", existing_type=sa.Boolean(), nullable=False
        )


def downgrade() -> None:
    with op.batch_alter_table("polls", schema=None) as batch_op:
        batch_op.drop_column("allow_users_to_view_results")
