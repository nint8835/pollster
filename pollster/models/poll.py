from enum import Enum

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from pollster.db import Base


class PollStatus(Enum):
    Pending = "pending"
    Open = "open"
    Closed = "closed"


class Poll(Base):
    __tablename__ = "polls"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    status: Mapped[PollStatus]
    allow_users_to_view_results: Mapped[bool]

    owner_id: Mapped[str]

    options: Mapped[list["PollOption"]] = relationship(
        back_populates="poll", lazy="raise"
    )


class PollOption(Base):
    __tablename__ = "poll_options"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]

    poll_id: Mapped[int] = mapped_column(ForeignKey("polls.id"))
    poll: Mapped[Poll] = relationship(back_populates="options", lazy="raise")


class Vote(Base):
    __tablename__ = "votes"

    id: Mapped[int] = mapped_column(primary_key=True)
    poll_id: Mapped[int] = mapped_column(ForeignKey("polls.id"))
    user_id: Mapped[str]
    vote: Mapped[str]
    poll: Mapped[Poll] = relationship(lazy="raise")


__all__ = ["Poll", "PollStatus", "PollOption", "Vote"]
