from pydantic import BaseModel, ConfigDict

from pollster.models.vote import VoteStatus


class VoteOption(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str


class Vote(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    status: VoteStatus
    owner_id: str
    options: list[VoteOption]


class CreateVote(BaseModel):
    name: str


class CreateVoteOption(BaseModel):
    name: str


class EditVoteOption(BaseModel):
    name: str


__all__ = ["Vote", "VoteOption", "CreateVote", "CreateVoteOption", "EditVoteOption"]
