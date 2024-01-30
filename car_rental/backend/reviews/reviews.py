from sqlalchemy import MetaData, Table, Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from users import user
from cars import car

metadata = MetaData()


review = Table(
    "review",
    metadata,
    Column("id", Integer, primary_key=True, nullable=False),
    Column("user_id", Integer, ForeignKey(user.c.id, ondelete="CASCADE"), nullable=False),
    Column("car_id", Integer, ForeignKey(car.c.id, ondelete="CASCADE"), nullable=False),
    Column("message", String(1000), nullable=False),
    Column("created_at", DateTime(timezone=True), server_default=func.now(), nullable=False),
)