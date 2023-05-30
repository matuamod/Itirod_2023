from sqlalchemy import MetaData, Table, Column, Integer, String, ForeignKey
from users import user

metadata = MetaData()


car = Table(
    "car", 
    metadata, 
    Column("id", Integer, primary_key=True, nullable=False),
    Column("owner_id", Integer, ForeignKey(user.c.id, ondelete="CASCADE"), nullable=False),
    Column("first_image_url", String(200), nullable=False),
    Column("sec_image_url", String(200), nullable=False),
    Column("third_image_url", String(200), nullable=False),
    Column("brand", String(50), nullable=False),
    Column("model", String(50), nullable=False),
    Column("category", String(50), nullable=False),
    Column("fuel_type", String(20), nullable=False),
    Column("seats_count", Integer, nullable=False),
    Column("color", String(50), nullable=False),
    Column("registration_plate", String(10), nullable=False),
    Column("day_price", Integer, nullable=False),
    Column("description", String(1000), nullable=False),
)
