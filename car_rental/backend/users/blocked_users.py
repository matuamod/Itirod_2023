from sqlalchemy import MetaData, Table, Column, Integer, String, Boolean

metadata = MetaData()


blocked_user = Table(
    "blocked_user",
    metadata,
    Column("id", Integer, primary_key=True, nullable=False),
    Column("email", String(100), nullable=False),
    Column("telephone", String(13), nullable=False),
    Column("license", String(10), nullable=False)
)