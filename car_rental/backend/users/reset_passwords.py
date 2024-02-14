from sqlalchemy import MetaData, Table, Column, Integer, String, Boolean

metadata = MetaData()


reset_password = Table(
    "reset_password",
    metadata,
    Column("id", Integer, primary_key=True, nullable=False),
    Column("username", String(50), nullable=False),
    Column("email", String(100), nullable=False),
)