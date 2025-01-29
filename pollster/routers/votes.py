from typing import Sequence

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from pollster.config import config
from pollster.dependencies.auth import require_discord_user
from pollster.dependencies.database import get_db
from pollster.models.vote import Vote, VoteOption, VoteStatus
from pollster.schemas import ErrorResponse
from pollster.schemas.discord_user import DiscordUser
from pollster.schemas.votes import CreateVote, CreateVoteOption, EditVoteOption
from pollster.schemas.votes import Vote as VoteSchema
from pollster.schemas.votes import VoteOption as VoteOptionSchema

votes_router = APIRouter(tags=["Votes"], dependencies=[Depends(require_discord_user)])


@votes_router.get(
    "/",
    response_model=list[VoteSchema],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Unauthorized",
            "model": ErrorResponse,
        }
    },
)
async def list_votes(db: AsyncSession = Depends(get_db)) -> Sequence[Vote]:
    """List all votes."""
    return (
        (await db.execute(select(Vote).options(joinedload(Vote.options))))
        .unique()
        .scalars()
        .all()
    )


@votes_router.get(
    "/{vote_id}",
    response_model=VoteSchema,
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Unauthorized",
            "model": ErrorResponse,
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Vote not found",
            "model": ErrorResponse,
        },
    },
)
async def get_vote(vote_id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve a vote by ID."""
    try:
        int_vote_id = int(vote_id)
    except ValueError:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content=ErrorResponse(detail="Vote not found.").model_dump(),
        )

    vote = (
        (
            await db.execute(
                select(Vote)
                .where(Vote.id == int_vote_id)
                .options(joinedload(Vote.options))
            )
        )
        .unique()
        .scalar_one_or_none()
    )

    if vote is None:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content=ErrorResponse(detail="Vote not found.").model_dump(),
        )

    return vote


@votes_router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=VoteSchema,
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Unauthorized",
            "model": ErrorResponse,
        },
        status.HTTP_403_FORBIDDEN: {"description": "Forbidden", "model": ErrorResponse},
    },
)
async def create_vote(
    vote: CreateVote,
    db: AsyncSession = Depends(get_db),
    user: DiscordUser = Depends(require_discord_user),
):
    """Create a new vote."""
    if user.id != config.owner_id:
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content=ErrorResponse(
                detail="You do not have permission to create new votes."
            ).model_dump(),
        )

    async with db.begin():
        new_vote = Vote(
            name=vote.name, status=VoteStatus.Pending, owner_id=user.id, options=[]
        )
        db.add(new_vote)
        await db.commit()

    return new_vote


@votes_router.post(
    "/{vote_id}/options",
    status_code=status.HTTP_201_CREATED,
    response_model=VoteOptionSchema,
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Unauthorized",
            "model": ErrorResponse,
        },
        status.HTTP_403_FORBIDDEN: {"description": "Forbidden", "model": ErrorResponse},
        status.HTTP_404_NOT_FOUND: {
            "description": "Vote not found",
            "model": ErrorResponse,
        },
    },
)
async def create_vote_option(
    vote_id: str,
    option: CreateVoteOption,
    db: AsyncSession = Depends(get_db),
    user: DiscordUser = Depends(require_discord_user),
):
    """Create a new option for a vote."""
    try:
        int_vote_id = int(vote_id)
    except ValueError:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content=ErrorResponse(detail="Vote not found.").model_dump(),
        )

    async with db.begin():
        vote = (
            (
                await db.execute(
                    select(Vote)
                    .where(Vote.id == int_vote_id)
                    .options(joinedload(Vote.options))
                )
            )
            .unique()
            .scalar_one_or_none()
        )

        if vote is None:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content=ErrorResponse(detail="Vote not found.").model_dump(),
            )

        if user.id != config.owner_id:
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content=ErrorResponse(
                    detail="You do not have permission to create new options for this vote."
                ).model_dump(),
            )

        new_option = VoteOption(vote_id=vote.id, name=option.name)
        db.add(new_option)
        await db.commit()

    return new_option


@votes_router.patch(
    "/{vote_id}/options/{option_id}",
    response_model=VoteOptionSchema,
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Unauthorized",
            "model": ErrorResponse,
        },
        status.HTTP_403_FORBIDDEN: {"description": "Forbidden", "model": ErrorResponse},
        status.HTTP_404_NOT_FOUND: {
            "description": "Vote or option not found",
            "model": ErrorResponse,
        },
    },
)
async def edit_vote_option(
    vote_id: str,
    option_id: str,
    option: EditVoteOption,
    db: AsyncSession = Depends(get_db),
    user: DiscordUser = Depends(require_discord_user),
):
    """Edit an option for a vote."""
    try:
        int_vote_id = int(vote_id)
        int_option_id = int(option_id)
    except ValueError:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content=ErrorResponse(detail="Vote or option not found.").model_dump(),
        )

    async with db.begin():
        option_model = (
            await db.execute(
                select(VoteOption)
                .where(VoteOption.vote_id == int_vote_id)
                .where(VoteOption.id == int_option_id)
            )
        ).scalar_one_or_none()

        if option_model is None:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content=ErrorResponse(detail="Vote or option not found.").model_dump(),
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


__all__ = ["votes_router"]
