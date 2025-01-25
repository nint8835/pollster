from enum import Enum

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from pollster.db import Base


class VoteStatus(Enum):
    Pending = "pending"
    Open = "open"
    Closed = "closed"


class Vote(Base):
    __tablename__ = "votes"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    status: Mapped[VoteStatus]

    owner_id: Mapped[str]

    options: Mapped[list["VoteOption"]] = relationship(
        back_populates="vote", lazy="raise"
    )


class VoteOption(Base):
    __tablename__ = "vote_options"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]

    vote_id: Mapped[int] = mapped_column(ForeignKey("votes.id"))
    vote: Mapped[Vote] = relationship(back_populates="options", lazy="raise")


__all__ = ["Vote", "VoteStatus", "VoteOption"]
