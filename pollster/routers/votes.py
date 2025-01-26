from typing import Sequence

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from pollster.config import config
from pollster.dependencies.auth import require_discord_user
from pollster.dependencies.database import get_db
from pollster.models.vote import Vote, VoteStatus
from pollster.schemas import ErrorResponse
from pollster.schemas.discord_user import DiscordUser
from pollster.schemas.votes import CreateVote
from pollster.schemas.votes import Vote as VoteSchema

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
        .scalars()
        .all()
    )


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


__all__ = ["votes_router"]
