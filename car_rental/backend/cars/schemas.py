from pydantic import BaseModel

    
class CarCreate(BaseModel):
    owner_id : int
    first_image_url : str
    sec_image_url : str
    third_image_url : str
    brand : str
    model : str
    category : str
    fuel_type : str
    seats_count : int
    color : str
    registration_plate : str
    day_price : int
    description : str


class CarUpdate(BaseModel):
    brand : str
    model : str
    category : str
    fuel_type : str
    seats_count : int
    color : str
    registration_plate : str
    day_price : int
    first_image_url : str
    sec_image_url : str
    third_image_url : str
    description : str
    
    
class CarCreate(BaseModel):
    owner_id : int
    first_image_url : str
    sec_image_url : str
    third_image_url : str
    brand : str
    model : str
    category : str
    fuel_type : str
    seats_count : int
    color : str
    registration_plate : str
    day_price : int
    description : str


class CarRead(BaseModel):
    first_image_url : str
    sec_image_url : str
    third_image_url : str
    brand : str
    model : str
    day_price : int
    description : str
    owner_address : str


class StuffCar(BaseModel):
    id : int
    username : int
    brand : str
    model : str
    category : str
    fuel_type : str
    seats_count : int
    color : str
    registration_plate : str
    day_price : int
    description : str
