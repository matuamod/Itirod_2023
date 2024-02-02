from pydantic import BaseModel

class ReviewCreate(BaseModel):
    user_id : int
    car_id : int
    message : str
    
    
class ReviewInfo(BaseModel):
    id : int
    username : str
    brand : str
    model : str
    registration_plate : str
    message : str