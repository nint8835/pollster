# ruff: noqa: F401

# Utility file to ensure all models are imported for Alembic auto-generation.
# Should not be imported outside of pollster.migrations.env

from .vote import Vote  # type: ignore
