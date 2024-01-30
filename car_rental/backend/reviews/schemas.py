from pydantic import BaseModel

class ReviewCreate(BaseModel):
    user_id : int
    car_id : int
    message : str