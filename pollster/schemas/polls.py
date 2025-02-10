from pydantic import BaseModel, ConfigDict

from pollster.models.poll import PollStatus


class PollOption(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str


class Poll(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    status: PollStatus
    owner_id: str
    options: list[PollOption]


class CreatePoll(BaseModel):
    name: str


class EditPoll(BaseModel):
    name: str | None = None
    status: PollStatus | None = None


class CreatePollOption(BaseModel):
    name: str


class EditPollOption(BaseModel):
    name: str


__all__ = [
    "Poll",
    "PollOption",
    "CreatePoll",
    "EditPoll",
    "CreatePollOption",
    "EditPollOption",
]
