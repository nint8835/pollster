from pydantic import BaseModel, ConfigDict

from pollster.models.poll import PollStatus


class PollOption(BaseModel):
    model_config = ConfigDict(from_attributes=True, coerce_numbers_to_str=True)

    id: str
    name: str


class Poll(BaseModel):
    model_config = ConfigDict(from_attributes=True, coerce_numbers_to_str=True)

    id: str
    name: str
    status: PollStatus
    allow_users_to_view_results: bool
    owner_id: str
    options: list[PollOption]


class CreatePoll(BaseModel):
    name: str


class EditPoll(BaseModel):
    name: str | None = None
    status: PollStatus | None = None
    allow_users_to_view_results: bool | None = None


class CreatePollOption(BaseModel):
    name: str


class EditPollOption(BaseModel):
    name: str


class CanVote(BaseModel):
    can_vote: bool
    reason: str


__all__ = [
    "Poll",
    "PollOption",
    "CreatePoll",
    "EditPoll",
    "CreatePollOption",
    "EditPollOption",
    "CanVote",
]
