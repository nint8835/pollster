from typing import Sequence

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from pollster.dependencies.auth import require_discord_user
from pollster.dependencies.database import get_db
from pollster.models.vote import Vote
from pollster.schemas.votes import Vote as VoteSchema

votes_router = APIRouter(tags=["Votes"], dependencies=[Depends(require_discord_user)])


@votes_router.get("/", response_model=list[VoteSchema])
async def list_votes(db: AsyncSession = Depends(get_db)) -> Sequence[Vote]:
    return (
        (await db.execute(select(Vote).options(joinedload(Vote.options))))
        .scalars()
        .all()
    )


__all__ = ["votes_router"]
