from fastapi import FastAPI
from fastapi.routing import APIRoute
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.middleware.sessions import SessionMiddleware
from starlette.responses import Response
from starlette.types import Scope

from pollster.config import config
from pollster.routers import auth_router, polls_router


def generate_unique_id(route: APIRoute) -> str:
    return route.name


class SPAStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope: Scope) -> Response:
        try:
            return await super().get_response(path, scope)
        except StarletteHTTPException as exc:
            if exc.status_code == 404:
                return await super().get_response("index.html", scope)
            else:
                raise exc


app = FastAPI(
    title="Pollster",
    generate_unique_id_function=generate_unique_id,
)

app.add_middleware(SessionMiddleware, secret_key=config.session_secret)

app.include_router(auth_router, prefix="/auth")
app.include_router(polls_router, prefix="/api/polls")

app.mount("/", SPAStaticFiles(directory="frontend/dist", html=True), "frontend")

__all__ = ["app"]
