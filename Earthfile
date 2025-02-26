VERSION 0.8

pip-lockfile:
    FROM ghcr.io/astral-sh/uv:python3.13-bookworm
    WORKDIR /pollster

    COPY pyproject.toml uv.lock ./
    RUN uv pip compile pyproject.toml -o requirements.txt

    SAVE ARTIFACT requirements.txt

python-deps:
    FROM python:3.13-bookworm
    WORKDIR /pollster

    ENV LANG=C.UTF-8
    ENV PYTHONDONTWRITEBYTECODE=1
    ENV PYTHONUNBUFFERED=1
    ENV PATH="/pollster/venv/bin:$PATH"

    RUN python -m venv /pollster/venv
    COPY +pip-lockfile/requirements.txt .

    RUN pip install --no-cache-dir -r requirements.txt

    SAVE ARTIFACT venv

node-deps:
    FROM cgr.dev/chainguard/node:latest
    WORKDIR /pollster

    COPY --chown=node:node package.json package-lock.json ./
    RUN npm install

    SAVE ARTIFACT node_modules


frontend:
    FROM cgr.dev/chainguard/node:latest
    WORKDIR /pollster

    COPY +node-deps/node_modules ./node_modules

    COPY --chown=node:node package.json package-lock.json postcss.config.js tailwind.config.js vite.config.ts tsconfig.json tsconfig.node.json tsconfig.app.json ./
    COPY --chown=node:node frontend frontend
    RUN npm run build

    SAVE ARTIFACT --keep-ts frontend/dist


app:
    FROM python:3.13-slim-bookworm
    WORKDIR /pollster

    ENV PYTHONUNBUFFERED=1
    ENV PATH="/pollster/venv/bin:$PATH"

    COPY +python-deps/venv /pollster/venv
    COPY --keep-ts +frontend/dist /pollster/frontend/dist
    COPY . .

    ENTRYPOINT ["python", "-m", "pollster"]
    CMD ["start"]

    SAVE IMAGE --push ghcr.io/nint8835/pollster:latest