from pydantic import BaseModel


class Stuff(BaseModel):
    username : str
    password : str
    
    
class StuffInfo(BaseModel):
    id : int
    username : str
    password : str
    
    
class StuffStatus(BaseModel):
    username : str
    is_admin : bool

