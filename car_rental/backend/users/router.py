from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy import select, insert, update, delete, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import exc
from database import get_async_session
from .users import user
from .blocked_users import blocked_user
from .schemas import UserInfo, UserCreate, UserUpdate, UserLogin
from typing import List

router = APIRouter(
    prefix="/users",
    tags=["User"]
)


@router.get("/get_user/{user_id}", response_model=UserCreate)
async def get_user(user_id: int, session: AsyncSession = Depends(get_async_session)):
    try:
        query = select(user).where(user.c.id == user_id)
        result = await session.execute(query)
        user_dict = [dict(r._mapping) for r in result][0]
        del user_dict["id"]
        
        return JSONResponse(content={"data": user_dict}, status_code=200)
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)


@router.get("/get_users", response_model=List[UserInfo])
async def get_users(session: AsyncSession = Depends(get_async_session)):
    try:
        count_users = await session.scalar(select(func.count()).select_from(user))
        
        if count_users == 0:
            return JSONResponse(content=[{"message": "There are no users in the system"}], status_code=200)
        else:
            users_query = select(user)
            
            result = await session.execute(users_query)
            user_list = [dict(r._mapping) for r in result]
            
            return JSONResponse(content={"data": user_list}, status_code=200)
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)
    
    
@router.put("/stuff_update_user/{user_id}")
async def stuff_update_user(user_id: int, user_update: UserCreate , session: AsyncSession = Depends(get_async_session)):
    try:
        stmt = update(user).where(user.c.id == user_id).values(**user_update.model_dump())
        await session.execute(stmt)
        await session.commit()
        print(stmt)
        return JSONResponse(content={"message": "User data updated"}, status_code=200)
    except IndexError as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Wrong user_id, this user doesn't exist"}, status_code=400)
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)
    
    
@router.delete("/delete_user/{user_id}")
async def delete_user(user_id: int, session: AsyncSession = Depends(get_async_session)):
    try:
        count_before = await session.scalar(select(func.count()).select_from(user))
        stmt = delete(user).where(user.c.id == user_id)
        await session.execute(stmt)
        await session.commit()
        count_after = await session.scalar(select(func.count()).select_from(user))
        
        if count_before == count_after:
            raise Exception
        
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)
    return JSONResponse(content={"message": "User succesfully deleted"}, status_code=200)


@router.post("/block_user/{user_id}")
async def block_user(user_id: int, session: AsyncSession = Depends(get_async_session)):
    try:
        query = select(user).where(user.c.id == user_id)
        result = await session.execute(query)
        user_dict = [dict(r._mapping) for r in result][0]
        
        blocked_user_data = {
            "email": user_dict["email"],
            "telephone": user_dict["telephone"],
            "license": user_dict["license"],
        }
        
        await session.execute(insert(blocked_user).values(blocked_user_data))
        
        await session.execute(delete(user).where(user.c.id == user_id))
        await session.commit()

    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)
    return JSONResponse(content={"message": "User succesfully blocked"}, status_code=200)


@router.post("/registration")
async def register_user(new_user: UserCreate, session: AsyncSession = Depends(get_async_session)):
    try:
        user_exists_query = select(user).where(
            (user.c.username == new_user.username) |
            (user.c.email == new_user.email) |
            (user.c.telephone == new_user.telephone) |
            (user.c.license == new_user.license)
        )
        user_exists_result = await session.execute(user_exists_query)
        existing_user = user_exists_result.scalar()
        
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="This user with such data is registered"
            )
        
        blocked_user_query = select(blocked_user).where(
            (blocked_user.c.email == new_user.email) |
            (blocked_user.c.telephone == new_user.telephone) |
            (blocked_user.c.license == new_user.license)
        )
        blocked_user_result = await session.execute(blocked_user_query)
        existing_blocked_user = blocked_user_result.scalar()

        if existing_blocked_user:
            raise HTTPException(
                status_code=400,
                detail="This user is blocked"
            )
        
        stmt = insert(user).values(**new_user.model_dump())
        await session.execute(stmt)
        await session.commit()
        
        query = select(user).where(user.c.username == new_user.username)
        result = await session.execute(query)
        user_dict = [dict(r._mapping) for r in result][0]
        password = user_dict.get('password')
    except HTTPException as e:
        return JSONResponse(content={"message": e.detail}, status_code=e.status_code)
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
