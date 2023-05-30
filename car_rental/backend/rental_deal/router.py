from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy import func, select, insert, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import exc
from database import get_async_session
from .rental_deal import rental_deal
from users import user
from cars import car as car
from .schemas import RentalDeal


router = APIRouter(
    prefix="/rental_deal",
    tags=["RentalDeal"]
)


@router.post("/")
async def create_rental_deal(new_rent: RentalDeal, session: AsyncSession = Depends(get_async_session)):
    try:
        stmt = insert(rental_deal).values(**new_rent.dict())
        print(stmt)
        await session.execute(stmt)
        await session.commit()
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)
    return JSONResponse(content={"message": "Rental deal succesfully created"}, status_code=200)



@router.delete("/")
async def delete_car_from_rental_deal(curr_rent: RentalDeal, session: AsyncSession = Depends(get_async_session)):
    try:
        count_before = await session.scalar(select(func.count()).select_from(rental_deal))
        stmt = delete(rental_deal).where((rental_deal.c.car_id == curr_rent.car_id) & (rental_deal.c.user_id == curr_rent.user_id))
        await session.execute(stmt)
        await session.commit()
        count_after = await session.scalar(select(func.count()).select_from(rental_deal))
        
        if count_before == count_after:
            raise Exception
        
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)
    return JSONResponse(content={"message": "Car was deleted from rental deal"}, status_code=200)



@router.get("/{user_id}")
async def get_user_rental_deals(user_id: int, brand="", model="", category="", fuel="", color="", price=0, session: AsyncSession = Depends(get_async_session)):
    try:
        query_for_checking_user = select(user).where(user.c.id == user_id)
        result = await session.execute(query_for_checking_user)
        user_id_dict = [dict(r._mapping) for r in result]
        
        if len(user_id_dict) == 0:
            return JSONResponse(content=[{"message": "Wrong user_id, user doesn't exist"}], status_code=400)  
        
        query_car_id = select(rental_deal.c.car_id).where(rental_deal.c.user_id == user_id)
        result = await session.execute(query_car_id)
        car_id_dict = [dict(r._mapping) for r in result]
        car_id_list = []
        
        for car_item in car_id_dict:
            car_id_list.append(car_item.get('car_id'))
        
        query_total_price = select(rental_deal.c.total_price).where(rental_deal.c.user_id == user_id)
        result = await session.execute(query_total_price)
        total_price_dict = [dict(r._mapping) for r in result]
        total_price_list = []
        
        for rental_deal_item in total_price_dict:
            total_price_list.append(rental_deal_item.get('total_price'))
            
        if len(car_id_list) == 0:
            return JSONResponse(content=[{"message": "User has 0 rental deals"}], status_code=200)  
        
        count_cars = await session.scalar(select(func.count()).select_from(car))
        
        if count_cars == 0:
            return JSONResponse(content=[{"message": "There is 0 cars available"}], status_code=200)
        
        if brand and model and category and fuel and color and price:
            query = select(car).where(car.c.id.in_(car_id_list), 
                                      car.c.brand == brand, car.c.model == model,
                                      car.c.category == category, car.c.fuel_type == fuel,
                                      car.c.color == color, car.c.day_price <= int(price))
        elif brand and model and price:
            query = select(car).where(car.c.id.in_(car_id_list), car.c.brand == brand, 
                                      car.c.model == model, car.c.day_price <= int(price))
        elif brand and price:
            query = select(car).where(car.c.id.in_(car_id_list), car.c.brand == brand, 
                                      car.c.day_price <= int(price))
        else:
            query = select(car).where(car.c.id.in_(car_id_list))
        
        result = await session.execute(query)
        carlist = [dict(r._mapping) for r in result]
        
        for index, item in enumerate(carlist):
            del item["owner_id"]
            del item["category"]
            del item["fuel_type"]
            del item["seats_count"]
            del item["color"]
            del item["registration_plate"]
            item["day_price"] = total_price_list[index]
            
        res = [{"message": "User rental deal data received"}]
        res.extend(carlist)
        return JSONResponse(content=res, status_code=200)  
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)