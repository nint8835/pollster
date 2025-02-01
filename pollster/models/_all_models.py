# ruff: noqa: F401

# Utility file to ensure all models are imported for Alembic auto-generation.
# Should not be imported outside of pollster.migrations.env

from .poll import Poll  # type: ignore
