from typing import Sequence

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from pollster.config import config
from pollster.dependencies.auth import require_discord_user
from pollster.dependencies.database import get_db
from pollster.models.poll import Poll, PollOption, PollStatus
from pollster.schemas import ErrorResponse
from pollster.schemas.discord_user import DiscordUser
from pollster.schemas.polls import (
    CreatePoll,
    CreatePollOption,
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
async def list_polls(db: AsyncSession = Depends(get_db)) -> Sequence[Poll]:
    """List all polls."""
    return (
        (await db.execute(select(Poll).options(joinedload(Poll.options))))
        .unique()
        .scalars()
        .all()
    )


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
    if user.id != config.owner_id:
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content=ErrorResponse(
                detail="You do not have permission to create new polls."
            ).model_dump(),
        )

    async with db.begin():
        new_poll = Poll(
            name=poll.name, status=PollStatus.Pending, owner_id=user.id, options=[]
        )
        db.add(new_poll)
        await db.commit()

    return new_poll


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

        if user.id != config.owner_id:
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
                .where(PollOption.poll_id == int_poll_id)
                .where(PollOption.id == int_option_id)
            )
        ).scalar_one_or_none()

        if option_model is None:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content=ErrorResponse(detail="Poll or option not found.").model_dump(),
            )

        if user.id != config.owner_id:
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
    status_code=status.HTTP_204_NO_CONTENT,
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
                .where(PollOption.poll_id == int_poll_id)
                .where(PollOption.id == int_option_id)
            )
        ).scalar_one_or_none()

        if option_model is None:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content=ErrorResponse(detail="Poll or option not found.").model_dump(),
            )

        if user.id != config.owner_id:
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content=ErrorResponse(
                    detail="You do not have permission to delete this option."
                ).model_dump(),
            )

        await db.delete(option_model)
        await db.commit()


__all__ = ["polls_router"]
