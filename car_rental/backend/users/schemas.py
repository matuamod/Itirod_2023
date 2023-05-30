from pydantic import BaseModel

class UserCreate(BaseModel):
    username : str
    password : str
    email : str
    telephone : str
    date_of_birth : str
    is_landlord : bool


class UserUpdate(BaseModel):
    username : str
    old_password : str
    new_password : str
    is_landlord : bool
    

class UserLogin(BaseModel):
    username : str
    password : str