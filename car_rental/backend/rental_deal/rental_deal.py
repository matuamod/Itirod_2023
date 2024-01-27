from sqlalchemy import MetaData, Table, Date, Column, Integer, String, ForeignKey, Float
from users import user
from cars import car

metadata = MetaData()


rental_deal = Table(
    "rental_deal",
    metadata,
    Column("id", Integer, primary_key=True, nullable=False),
    Column("user_id", Integer, ForeignKey(user.c.id, ondelete="CASCADE"), nullable=False),
    Column("car_id", Integer, ForeignKey(car.c.id, ondelete="CASCADE"), nullable=False),
    Column("start_date", String(10), nullable=False),
    Column("end_date", String(10), nullable=False),
    Column("reception_point", String(100), nullable=False),
    Column("issue_point", String(100), nullable=False),
    Column("total_price", Float),
)