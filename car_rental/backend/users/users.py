from sqlalchemy import MetaData, Table, Column, Integer, String, Boolean

metadata = MetaData()


user = Table(
    "user",
    metadata,
    Column("id", Integer, primary_key=True, nullable=False),
    Column("username", String(50), nullable=False),
    Column("password", String(50), nullable=False),
    Column("email", String(100), nullable=False),
    Column("telephone", String(13), nullable=False),
    Column("address", String(100), nullable=False),
    Column("license", String(10), nullable=False),
    Column("date_of_birth", String(10), nullable=False),
    Column("is_landlord", Boolean, nullable=False)
)