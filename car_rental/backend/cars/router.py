from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy import func, select, insert, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import exc
from sqlalchemy import desc
from database import get_async_session
from .cars import car
from .schemas import CarCreate, CarRead


router = APIRouter(
    prefix="/cars",
    tags=["Car"]
)


@router.post("/")
async def create_car(new_car: CarCreate, session: AsyncSession = Depends(get_async_session)):
    try:
        stmt = insert(car).values(**new_car.dict())
        await session.execute(stmt)
        await session.commit()
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)
    return JSONResponse(content={"message": "Car succesfully created"}, status_code=200)


@router.put("/update_car/{car_id}")
async def update_car(car_id: int, car_update: CarCreate , session: AsyncSession = Depends(get_async_session)):
    try:
        stmt = update(car).where(car.c.id == car_id).values(**car_update.dict())
        await session.execute(stmt)
        await session.commit()
        print(stmt)
        return JSONResponse(content={"message": "Car data updated"}, status_code=200)
    except IndexError as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Wrong car_id, this car doesn't exist"}, status_code=400)
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)



@router.delete("/{car_id}")
async def delete_car(car_id: int, session: AsyncSession = Depends(get_async_session)):
    try:
        count_before = await session.scalar(select(func.count()).select_from(car))
        stmt = delete(car).where(car.c.id == car_id)
        await session.execute(stmt)
        await session.commit()
        count_after = await session.scalar(select(func.count()).select_from(car))
        if count_before == count_after:
            raise Exception
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error occured"}, status_code=400)
    return JSONResponse(content={"message": "Car succesfully deleted"}, status_code=200)



@router.get("/{car_id}", response_model = CarRead)
async def get_car(car_id: int, session: AsyncSession = Depends(get_async_session)):
    try:
        query = select(car).where(car.c.id == car_id)
        result = await session.execute(query)
        car_dict = [dict(r._mapping) for r in result][0]
        res = {"message": "Flat data received"}
        del car_dict["owner_id"]
        res.update(car_dict)
        return JSONResponse(content=res, status_code=200)  
    except IndexError as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Wrong car_id, this car doesn't exist"}, status_code=400)
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)
    
    

@router.get("/user/{user_id}")
async def get_cars_created_by_user(user_id: int, brand="", model="", category="", fuel="", color="", price=0, session: AsyncSession = Depends(get_async_session)):
    try:
        query = select(car).where(car.c.owner_id == user_id)
        result = await session.execute(query)
        count_cars = await session.scalar(select(func.count()).select_from(car).where(car.c.owner_id == user_id))
        if count_cars == 0:
            return JSONResponse(content=[{"message": "User has 0 cars"}], status_code=200)
        
        if brand and model and category and fuel and color and price:
            query = select(car).where(car.c.brand == brand, car.c.model == model,
                                      car.c.category == category, car.c.fuel_type == fuel,
                                      car.c.color == color, car.c.day_price <= int(price))
        elif brand and model and price:
            query = select(car).where(car.c.brand == brand, car.c.model == model, car.c.day_price <= int(price))
        elif brand and price:
            query = select(car).where(car.c.brand == brand, car.c.day_price <= int(price))
        else:
            query = select(car)
        result = await session.execute(query)
        carlist = [dict(r._mapping) for r in result]
        for item in carlist:
            del item["owner_id"]
            del item["seats_count"]
            del item["registration_plate"]
        res = [{"message": "Cars data received"}]
        res.extend(carlist)
        if len(res) == 1:
            return JSONResponse(content=[{"message": "0 cars"}], status_code=200)  
        return JSONResponse(content=res, status_code=200)  
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)
    
    
@router.get("/")
async def get_all_cars(brand="", model="", category="", fuel="", color="", price=0, session: AsyncSession = Depends(get_async_session)):
    try:
        count_cars = await session.scalar(select(func.count()).select_from(car))
        if count_cars == 0:
            return JSONResponse(content=[{"message": "There is 0 cars available"}], status_code=200)
        
        if brand and model and category and fuel and color and price:
            query = select(car).where(car.c.brand == brand, car.c.model == model,
                                      car.c.category == category, car.c.fuel_type == fuel,
                                      car.c.color == color, car.c.day_price <= int(price))
        elif brand and model and price:
            query = select(car).where(car.c.brand == brand, car.c.model == model, car.c.day_price <= int(price))
        elif brand and price:
            query = select(car).where(car.c.brand == brand, car.c.day_price <= int(price))
        else:
            query = select(car)
        result = await session.execute(query)
        carlist = [dict(r._mapping) for r in result]
        for item in carlist:
            del item["owner_id"]
            del item["seats_count"]
            del item["registration_plate"]
        res = [{"message": "Cars data received"}]
        res.extend(carlist)
        if len(res) == 1:
            return JSONResponse(content=[{"message": "0 cars"}], status_code=200)  
        return JSONResponse(content=res, status_code=200)  
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)
