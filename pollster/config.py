from pydantic_settings import BaseSettings, SettingsConfigDict


class Config(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="pollster_", env_file=".env")

    log_level: str = "INFO"

    bind_host: str = "0.0.0.0"
    bind_port: int = 8000
    behind_reverse_proxy: bool = False

    client_id: str
    client_secret: str
    session_secret: str = "change_me"
    guild_ids: list[str]
    owner_id: str

    db_path: str = "pollster.sqlite"
    db_log_queries: bool = False

    @property
    def async_db_connection_uri(self) -> str:
        return f"sqlite+aiosqlite:///{self.db_path}"

    @property
    def sync_db_connection_uri(self) -> str:
        return f"sqlite:///{self.db_path}"


config = Config()  # type: ignore - Pyright doesn't know about pydantic_settings

__all__ = ["config"]
