from sqlalchemy import MetaData, Table, Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func

metadata = MetaData()


stuff = Table(
    "stuff",
    metadata,
    Column("id", Integer, primary_key=True, nullable=False),
    Column("username", String(50), nullable=False),
    Column("password", String(50), nullable=False),
    Column("is_blocked", Boolean, nullable=False, default=False),
    Column("is_admin", Boolean, nullable=False, default=False),
    Column("created_at", DateTime(timezone=True), server_default=func.now(), nullable=False)
)