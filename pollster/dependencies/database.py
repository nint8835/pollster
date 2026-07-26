from collections.abc import AsyncGenerator
from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from pollster.db import async_session


async def get_db() -> AsyncGenerator[AsyncSession]:
    async with async_session() as session:
        yield session


DatabaseSession = Annotated[AsyncSession, Depends(get_db)]


__all__ = ["DatabaseSession", "get_db"]
