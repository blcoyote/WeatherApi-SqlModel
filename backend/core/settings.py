from pydantic import BaseSettings
from functools import lru_cache
import datetime

ERROR_LOG_FILENAME = "./log/access.log"
VERSION = "0.1.5"


class Settings(BaseSettings):
    DEBUG_MODE: bool
    ACCESSCTL: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    WINDY_ENABLED: bool
    WINDYKEY: str
    PG_URL: str

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()


def decrypt_env():
    print("decripting")
