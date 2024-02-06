from pydantic import BaseModel

class RentalDeal(BaseModel):
    user_id : int
    car_id : int
    start_date : str
    end_date : str
    reception_point : str
    issue_point : str
    total_price : float
    
    
class RentalDealInfo(BaseModel):
    start_date : str
    end_date : str
    reception_point : str
    issue_point : str
    total_price : float


class StuffRentalDeal(BaseModel):
    id: int
    username: str
    brand: str
    model: str
    car_id: int
    registration_plate: str
    start_date : str
    end_date : str
    reception_point : str
    issue_point : str
    total_price : float
    
    
class StuffCreateRentalDeal(BaseModel):
    username: str
    registration_plate: str
    start_date : str
    end_date : str
    reception_point : str
    issue_point : str
    total_price : float