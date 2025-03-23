import json
from typing import Sequence

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from pollster.config import config
from pollster.dependencies.auth import require_discord_user
from pollster.dependencies.database import get_db
from pollster.models.poll import Poll, PollOption, PollStatus, Vote
from pollster.schemas import ErrorResponse
from pollster.schemas.discord_user import DiscordUser
from pollster.schemas.polls import (
    CanVote,
    CreatePoll,
    CreatePollOption,
    EditPoll,
    EditPollOption,
)
from pollster.schemas.polls import (
    Poll as PollSchema,
)
from pollster.schemas.polls import (
    PollOption as PollOptionSchema,
)

polls_router = APIRouter(tags=["Polls"], dependencies=[Depends(require_discord_user)])


@polls_router.get(
    "/",
    response_model=list[PollSchema],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Unauthorized",
            "model": ErrorResponse,
        }
    },
)
async def list_polls(
    db: AsyncSession = Depends(get_db),
    user: DiscordUser = Depends(require_discord_user),
) -> Sequence[Poll]:
    """List all polls owned by the current user."""
    polls_query = select(Poll).options(joinedload(Poll.options))

    if not user.is_owner:
        polls_query = polls_query.filter_by(owner_id=user.id)

    return (await db.execute(polls_query)).unique().scalars().all()


@polls_router.get(
    "/{poll_id}",
    response_model=PollSchema,
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Unauthorized",
            "model": ErrorResponse,
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Poll not found",
            "model": ErrorResponse,
        },
    },
)
async def get_poll(poll_id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve a poll by ID."""
    try:
        int_poll_id = int(poll_id)
    except ValueError:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content=ErrorResponse(detail="Poll not found.").model_dump(),
        )

    poll = (
        (
            await db.execute(
                select(Poll)
                .where(Poll.id == int_poll_id)
                .options(joinedload(Poll.options))
            )
        )
        .unique()
        .scalar_one_or_none()
    )

    if poll is None:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content=ErrorResponse(detail="Poll not found.").model_dump(),
        )

    return poll


@polls_router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=PollSchema,
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Unauthorized",
            "model": ErrorResponse,
        },
        status.HTTP_403_FORBIDDEN: {"description": "Forbidden", "model": ErrorResponse},
    },
)
async def create_poll(
    poll: CreatePoll,
    db: AsyncSession = Depends(get_db),
    user: DiscordUser = Depends(require_discord_user),
):
    """Create a new poll."""
    async with db.begin():
        new_poll = Poll(
            name=poll.name, status=PollStatus.Pending, owner_id=user.id, options=[]
        )
        db.add(new_poll)
        await db.commit()

    return new_poll


@polls_router.patch(
    "/{poll_id}",
    response_model=PollSchema,
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Unauthorized",
            "model": ErrorResponse,
        },
        status.HTTP_403_FORBIDDEN: {"description": "Forbidden", "model": ErrorResponse},
        status.HTTP_404_NOT_FOUND: {
            "description": "Poll not found",
            "model": ErrorResponse,
        },
    },
)
async def edit_poll(
    poll_id: str,
    poll: EditPoll,
    db: AsyncSession = Depends(get_db),
    user: DiscordUser = Depends(require_discord_user),
):
    """Edit a poll."""
    try:
        int_poll_id = int(poll_id)
    except ValueError:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content=ErrorResponse(detail="Poll not found.").model_dump(),
        )

    async with db.begin():
        poll_model = (
            (
                await db.execute(
                    select(Poll)
                    .options(joinedload(Poll.options))
                    .where(Poll.id == int_poll_id)
                )
            )
            .unique()
            .scalar_one_or_none()
        )

        if poll_model is None:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content=ErrorResponse(detail="Poll not found.").model_dump(),
            )

        if user.id not in [poll_model.owner_id, config.owner_id]:
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content=ErrorResponse(
                    detail="You do not have permission to edit this poll."
                ).model_dump(),
            )

        if poll.name is not None:
            poll_model.name = poll.name
        if poll.status is not None:
            poll_model.status = poll.status
        if poll.allow_users_to_view_results is not None:
            poll_model.allow_users_to_view_results = poll.allow_users_to_view_results

        await db.commit()

    return poll_model


@polls_router.get(
    "/{poll_id}/can-vote",
    status_code=status.HTTP_200_OK,
    response_model=CanVote,
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Unauthorized",
            "model": ErrorResponse,
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Poll not found",
            "model": ErrorResponse,
        },
    },
)
async def can_vote(
    poll_id: str,
    db: AsyncSession = Depends(get_db),
    user: DiscordUser = Depends(require_discord_user),
):
    """Check whether the user can vote in a given poll."""
    try:
        int_poll_id = int(poll_id)
    except ValueError:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content=ErrorResponse(detail="Poll not found.").model_dump(),
        )

    poll = (
        (
            await db.execute(
                select(Poll)
                .where(Poll.id == int_poll_id)
                .options(joinedload(Poll.options))
            )
        )
        .unique()
        .scalar_one_or_none()
    )

    if poll is None:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content=ErrorResponse(detail="Poll not found.").model_dump(),
        )

    if poll.status == PollStatus.Pending:
        return CanVote(
            can_vote=False, reason="Voting for this poll has not yet opened."
        )
    elif poll.status == PollStatus.Closed:
        return CanVote(
            can_vote=False, reason="Voting for this poll has already closed."
        )

    existing_vote = (
        await db.execute(select(Vote).filter_by(poll_id=poll.id, user_id=user.id))
    ).scalar_one_or_none()

    if existing_vote is not None:
        return CanVote(can_vote=False, reason="You have already voted in this poll.")

    return CanVote(can_vote=True, reason="")


@polls_router.post(
    "/{poll_id}/votes",
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "description": "Bad Request",
            "model": ErrorResponse,
        },
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Unauthorized",
            "model": ErrorResponse,
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Poll not found",
            "model": ErrorResponse,
        },
        status.HTTP_409_CONFLICT: {
            "description": "Conflict",
            "model": ErrorResponse,
        },
    },
)
async def create_vote(
    poll_id: str,
    vote: list[str],
    db: AsyncSession = Depends(get_db),
    user: DiscordUser = Depends(require_discord_user),
):
    """Create a new vote for a poll."""
    try:
        int_poll_id = int(poll_id)
    except ValueError:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content=ErrorResponse(detail="Poll not found.").model_dump(),
        )

    try:
        parsed_vote = [int(v) for v in vote]
    except ValueError:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content=ErrorResponse(detail="Invalid vote.").model_dump(),
        )

    async with db.begin():
        poll = (
            (
                await db.execute(
                    select(Poll)
                    .where(Poll.id == int_poll_id)
                    .options(joinedload(Poll.options))
                )
            )
            .unique()
            .scalar_one_or_none()
        )

        if poll is None:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content=ErrorResponse(detail="Poll not found.").model_dump(),
            )

        if poll.status == PollStatus.Pending:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content=ErrorResponse(
                    detail="Voting for this poll has not yet opened."
                ).model_dump(),
            )
        elif poll.status == PollStatus.Closed:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content=ErrorResponse(
                    detail="Voting for this poll has already closed."
                ).model_dump(),
            )

        existing_vote = (
            await db.execute(select(Vote).filter_by(poll_id=poll.id, user_id=user.id))
        ).scalar_one_or_none()

        if existing_vote is not None:
            return JSONResponse(
                status_code=status.HTTP_409_CONFLICT,
                content=ErrorResponse(
                    detail="You have already voted in this poll."
                ).model_dump(),
            )

        vote_set = set(parsed_vote)
        option_set = set([o.id for o in poll.options])

        if vote_set != option_set or len(vote_set) != len(parsed_vote):
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content=ErrorResponse(detail="Invalid vote.").model_dump(),
            )

        new_vote = Vote(poll_id=poll.id, user_id=user.id, vote=json.dumps(parsed_vote))
        db.add(new_vote)
        await db.commit()

    return JSONResponse(status_code=status.HTTP_201_CREATED, content={})


@polls_router.get(
    "/{poll_id}/votes",
    response_model=dict[str, int],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Unauthorized",
            "model": ErrorResponse,
        },
        status.HTTP_403_FORBIDDEN: {"description": "Forbidden", "model": ErrorResponse},
        status.HTTP_404_NOT_FOUND: {
            "description": "Poll not found",
            "model": ErrorResponse,
        },
    },
)
async def list_votes(
    poll_id: str,
    db: AsyncSession = Depends(get_db),
    user: DiscordUser = Depends(require_discord_user),
):
    """List vote results for a poll."""
    try:
        int_poll_id = int(poll_id)
    except ValueError:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content=ErrorResponse(detail="Poll not found.").model_dump(),
        )

    async with db.begin():
        poll = (
            (
                await db.execute(
                    select(Poll)
                    .where(Poll.id == int_poll_id)
                    .options(joinedload(Poll.options))
                )
            )
            .unique()
            .scalar_one_or_none()
        )

        if poll is None:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content=ErrorResponse(detail="Poll not found.").model_dump(),
            )

        if (
            user.id not in [poll.owner_id, config.owner_id]
            and not poll.allow_users_to_view_results
        ):
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content=ErrorResponse(
                    detail="You do not have permission to view votes for this poll."
                ).model_dump(),
            )

        votes = (
            (await db.execute(select(Vote).filter_by(poll_id=poll.id))).scalars().all()
        )

    option_points = {str(option.id): 0 for option in poll.options}

    parsed_votes = [[str(v) for v in json.loads(vote.vote)] for vote in votes]
    for vote in parsed_votes:
        for i, option_id in enumerate(vote):
            option_points[option_id] += i + 1

    return option_points


@polls_router.post(
    "/{poll_id}/options",
    status_code=status.HTTP_201_CREATED,
    response_model=PollOptionSchema,
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Unauthorized",
            "model": ErrorResponse,
        },
        status.HTTP_403_FORBIDDEN: {"description": "Forbidden", "model": ErrorResponse},
        status.HTTP_404_NOT_FOUND: {
            "description": "Poll not found",
            "model": ErrorResponse,
        },
    },
)
async def create_poll_option(
    poll_id: str,
    option: CreatePollOption,
    db: AsyncSession = Depends(get_db),
    user: DiscordUser = Depends(require_discord_user),
):
    """Create a new option for a poll."""
    try:
        int_poll_id = int(poll_id)
    except ValueError:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content=ErrorResponse(detail="Poll not found.").model_dump(),
        )

    async with db.begin():
        poll = (
            (
                await db.execute(
                    select(Poll)
                    .where(Poll.id == int_poll_id)
                    .options(joinedload(Poll.options))
                )
            )
            .unique()
            .scalar_one_or_none()
        )

        if poll is None:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content=ErrorResponse(detail="Poll not found.").model_dump(),
            )

        if user.id not in [poll.owner_id, config.owner_id]:
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content=ErrorResponse(
                    detail="You do not have permission to create new options for this poll."
                ).model_dump(),
            )

        new_option = PollOption(poll_id=poll.id, name=option.name)
        db.add(new_option)
        await db.commit()

    return new_option


@polls_router.patch(
    "/{poll_id}/options/{option_id}",
    response_model=PollOptionSchema,
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Unauthorized",
            "model": ErrorResponse,
        },
        status.HTTP_403_FORBIDDEN: {"description": "Forbidden", "model": ErrorResponse},
        status.HTTP_404_NOT_FOUND: {
            "description": "Poll or option not found",
            "model": ErrorResponse,
        },
    },
)
async def edit_poll_option(
    poll_id: str,
    option_id: str,
    option: EditPollOption,
    db: AsyncSession = Depends(get_db),
    user: DiscordUser = Depends(require_discord_user),
):
    """Edit an option for a poll."""
    try:
        int_poll_id = int(poll_id)
        int_option_id = int(option_id)
    except ValueError:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content=ErrorResponse(detail="Poll or option not found.").model_dump(),
        )

    async with db.begin():
        option_model = (
            await db.execute(
                select(PollOption)
                .options(joinedload(PollOption.poll))
                .where(PollOption.poll_id == int_poll_id)
                .where(PollOption.id == int_option_id)
            )
        ).scalar_one_or_none()

        if option_model is None:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content=ErrorResponse(detail="Poll or option not found.").model_dump(),
            )

        if user.id not in [option_model.poll.owner_id, config.owner_id]:
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content=ErrorResponse(
                    detail="You do not have permission to edit this option."
                ).model_dump(),
            )

        option_model.name = option.name
        await db.commit()

    return option_model


@polls_router.delete(
    "/{poll_id}/options/{option_id}",
    # This should be a 204 No Content, but openapi-codegen explodes if it doesn't get back a response body
    # https://github.com/fabien0102/openapi-codegen/issues/257
    status_code=status.HTTP_202_ACCEPTED,
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Unauthorized",
            "model": ErrorResponse,
        },
        status.HTTP_403_FORBIDDEN: {"description": "Forbidden", "model": ErrorResponse},
        status.HTTP_404_NOT_FOUND: {
            "description": "Poll or option not found",
            "model": ErrorResponse,
        },
    },
)
async def delete_poll_option(
    poll_id: str,
    option_id: str,
    db: AsyncSession = Depends(get_db),
    user: DiscordUser = Depends(require_discord_user),
):
    """Delete an option for a poll."""
    try:
        int_poll_id = int(poll_id)
        int_option_id = int(option_id)
    except ValueError:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content=ErrorResponse(detail="Poll or option not found.").model_dump(),
        )

    async with db.begin():
        option_model = (
            await db.execute(
                select(PollOption)
                .options(joinedload(PollOption.poll))
                .where(PollOption.poll_id == int_poll_id)
                .where(PollOption.id == int_option_id)
            )
        ).scalar_one_or_none()

        if option_model is None:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content=ErrorResponse(detail="Poll or option not found.").model_dump(),
            )

        if user.id not in [option_model.poll.owner_id, config.owner_id]:
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content=ErrorResponse(
                    detail="You do not have permission to delete this option."
                ).model_dump(),
            )

        await db.delete(option_model)
        await db.commit()

    return JSONResponse(status_code=status.HTTP_202_ACCEPTED, content={})


__all__ = ["polls_router"]
