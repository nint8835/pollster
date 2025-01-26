from pydantic import BaseModel, Field


class ErrorResponse(BaseModel):
    """A generic error response."""

    detail: str = Field(description="A description of the error.")


__all__ = ["ErrorResponse"]
