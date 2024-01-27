from pydantic import BaseModel

class RentalDeal(BaseModel):
    user_id : int
    car_id : int
    start_date : str
    end_date : str
    reception_point : str
    issue_point : str
    total_price : float