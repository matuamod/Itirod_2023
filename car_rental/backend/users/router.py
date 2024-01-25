from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy import select, insert, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import exc
from database import get_async_session
from .users import user
from .schemas import UserCreate, UserUpdate, UserLogin

router = APIRouter(
    prefix="/users",
    tags=["User"]
)


@router.post("/registration")
async def register_user(new_user: UserCreate, session: AsyncSession = Depends(get_async_session)):
    try:
        stmt = insert(user).values(**new_user.dict())
        await session.execute(stmt)
        await session.commit()
        
        query = select(user).where(user.c.username == new_user.username)
        result = await session.execute(query)
        user_dict = [dict(r._mapping) for r in result][0]
        password = user_dict.get('password')
    except exc.IntegrityError as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "This email already registered"}, status_code=400)
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)
    if(password == new_user.password):
        return JSONResponse(content={"message": "User succesfully created", "id": user_dict.get('id')}, status_code=200)


@router.post("/login")
async def login_user(user_login: UserLogin , session: AsyncSession = Depends(get_async_session)):
    try:
        query = select(user).where(user.c.username == user_login.username)
        result = await session.execute(query)
        user_dict = [dict(r._mapping) for r in result][0]
        
        password = user_dict.get('password')
        
        if(password == user_login.password):
            return JSONResponse(content={"message": "Successful login", "id": user_dict.get('id')}, status_code=200)  
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Wrong username or password"}, status_code=400)
    return JSONResponse(content={"message": "Wrong username or password"}, status_code=400)


@router.put("/update_user/{user_id}")
async def update_user(user_id: int, update_user: UserUpdate , session: AsyncSession = Depends(get_async_session)):
    try:
        query = select(user).where(user.c.id == user_id)
        result = await session.execute(query)
        user_dict = [dict(r._mapping) for r in result][0]
        password = user_dict.get('password')
        if password == update_user.old_password:
            stmt = update(user).where(user.c.id == user_id).values(
                username = update_user.username,
                password = update_user.new_password,
                is_landlord = update_user.is_landlord
                )
            await session.execute(stmt)
            await session.commit()
            print(stmt)
            return JSONResponse(content={"message": "User data updated"}, status_code=200)
    except exc.IntegrityError as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "This username already registered"}, status_code=400)
    except IndexError as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Wrong user_id, this user doesn't exist"}, status_code=400)
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)
    return JSONResponse(content={"message": "Wrong password"}, status_code=400)



@router.get("/{user_id}")
async def get_user(user_id: int, session: AsyncSession = Depends(get_async_session)):
    try:
        query = select(user).where(user.c.id == user_id)
        result = await session.execute(query)
        user_dict = [dict(r._mapping) for r in result][0]
        return JSONResponse(content={"message": "User data received", 
                                     "username": user_dict.get('username'), 
                                     "password": user_dict.get('password'), 
                                     "email": user_dict.get('email'), 
                                     "telephone": user_dict.get('telephone'), 
                                     "date_of_birth": user_dict.get('date_of_birth'),
                                     "is_landlord": user_dict.get('is_landlord')}, status_code=200)  
    except IndexError as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Wrong user_id, this user doesn't exist"}, status_code=400)
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)
