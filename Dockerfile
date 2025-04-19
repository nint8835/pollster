FROM ghcr.io/astral-sh/uv:python3.13-bookworm AS pip-lockfile
WORKDIR /pollster

COPY pyproject.toml uv.lock ./
RUN uv pip compile pyproject.toml -o requirements.txt

FROM python:3.13-bookworm AS venv
WORKDIR /pollster

ENV LANG=C.UTF-8
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PATH="/pollster/venv/bin:$PATH"

RUN python -m venv /pollster/venv
COPY --from=pip-lockfile /pollster/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

FROM cgr.dev/chainguard/node:latest AS frontend
WORKDIR /pollster

COPY --chown=node:node package.json package-lock.json ./
RUN npm install

COPY --chown=node:node package.json package-lock.json postcss.config.js tailwind.config.js vite.config.ts tsconfig.json tsconfig.node.json tsconfig.app.json ./
COPY --chown=node:node frontend frontend
RUN npm run build

FROM python:3.13-slim-bookworm AS app
WORKDIR /pollster

ENV PYTHONUNBUFFERED=1
ENV PATH="/pollster/venv/bin:$PATH"

COPY --from=venv /pollster/venv /pollster/venv
COPY --from=frontend /pollster/frontend/dist /pollster/frontend/dist
COPY . .

ENTRYPOINT ["python", "-m", "pollster"]
CMD ["start"]
