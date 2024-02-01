from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy import func, select, insert, update, delete, join
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import exc
from database import get_async_session
from .stuff import stuff as stuff
from reviews import review as review
from users import user as user
from cars import car as car
from .schemas import Stuff, StuffStatus, StuffInfo
from typing import List


router = APIRouter(
    prefix="/stuff",
    tags=["Stuff"]
)


@router.get("/managers", response_model=List[StuffInfo])
async def get_managers(session: AsyncSession = Depends(get_async_session)):
    try:
        query = select(stuff.c.id, stuff.c.username, stuff.c.password).where(stuff.c.is_admin == False)
        result = await session.execute(query)
        
        managers_list = [dict(r._mapping) for r in result]
        
        return JSONResponse(content={"message": "Stuff data received", "data": managers_list}, status_code=200)  
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)


@router.get("/{stuff_id}", response_model=Stuff)
async def get_manager(stuff_id: int, session: AsyncSession = Depends(get_async_session)):
    try:
        query = select(stuff.c.username, stuff.c.password).where(stuff.c.id == stuff_id)
        result = await session.execute(query)
        stuff_dict = [dict(r._mapping) for r in result][0]
        return JSONResponse(content={"message": "Stuff data received", "data": stuff_dict}, status_code=200)  
    except IndexError as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Wrong stuff_id, this stuff doesn't exist"}, status_code=400)
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)


@router.get("/info/{stuff_id}", response_model=StuffStatus)
async def get_stuff_info(stuff_id: int, session: AsyncSession = Depends(get_async_session)):
    try:
        query = select(stuff.c.username, stuff.c.is_admin).where(stuff.c.id == stuff_id)
        result = await session.execute(query)
        stuff_dict = [dict(r._mapping) for r in result][0]
        return JSONResponse(content={"message": "Stuff data received", "data": stuff_dict}, status_code=200)  
    except IndexError as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Wrong stuff_id, this stuff doesn't exist"}, status_code=400)
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)


@router.post("/login")
async def login_stuff(stuff_login: Stuff, session: AsyncSession = Depends(get_async_session)):
    try:
        query = select(stuff).where(stuff.c.username == stuff_login.username)
        result = await session.execute(query)
        stuff_dict = [dict(r._mapping) for r in result][0]
        
        password = stuff_dict.get("password")
        
        if(password == stuff_login.password):
            return JSONResponse(content={"message": "Successful login", "id": stuff_dict.get("id")}, status_code=200)  
        else:
            return JSONResponse(content={"message": "Wrong password"}, status_code=400)
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "No such stuff with this username"}, status_code=400)


@router.post("/manager_registration")
async def register_manager(new_manager: Stuff, session: AsyncSession = Depends(get_async_session)):
    try:
        query = select(stuff).where(stuff.c.username == new_manager.username)
        result = await session.execute(query)
        manager_list = [dict(r._mapping) for r in result]
        
        if manager_list:
            raise exc.IntegrityError(None, None, None, None)
        
        stmt = insert(stuff).values(**new_manager.model_dump())
        await session.execute(stmt)
        await session.commit()
    except exc.IntegrityError as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "This manager already registered"}, status_code=400)
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)
    return JSONResponse(content={"message": "Manager succesfully created"}, status_code=200)
   
   
@router.put("/manager_update/{manager_id}")
async def update_manager(manager_id: int, manager_update: Stuff, session: AsyncSession = Depends(get_async_session)):
    try:
        stmt = update(stuff).where(stuff.c.id == manager_id).values(**manager_update.model_dump())
        await session.execute(stmt)
        await session.commit()
        return JSONResponse(content={"message": "Manager data updated"}, status_code=200)
    except IndexError as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Wrong manager_id, this manager doesn't exist"}, status_code=400)
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)
        
    
@router.delete("/manager_delete/{manager_id}")
async def delete_manager(manager_id: int, session: AsyncSession = Depends(get_async_session)):
    try:
        count_before = await session.scalar(select(func.count()).select_from(stuff))
        stmt = delete(stuff).where(stuff.c.id == manager_id)
        await session.execute(stmt)
        await session.commit()
        count_after = await session.scalar(select(func.count()).select_from(stuff))
        
        if count_before == count_after: raise Exception
        
        return JSONResponse(content={"message": "Manager succesfully deleted"}, status_code=200)
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error occured"}, status_code=400)