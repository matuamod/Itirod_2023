from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy import func, select, insert, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import exc
from database import get_async_session
from .rental_deal import rental_deal
from users import user
from cars import car as car
from .schemas import RentalDealInfo, StuffRentalDeal, RentalDeal
from .stripe import create_rental_plan
from typing import List


router = APIRouter(
    prefix="/rental_deal",
    tags=["RentalDeal"]
)


@router.get("/get_rental_deal/{rental_deal_id}", response_model=RentalDealInfo)
async def get_rental_deal(rental_deal_id: int, session: AsyncSession = Depends(get_async_session)):
    try:
        query = select(rental_deal).where(rental_deal.c.id == rental_deal_id)
        result = await session.execute(query)
        rental_deal_dict = [dict(r._mapping) for r in result][0]
        del rental_deal_dict["id"]
        del rental_deal_dict["user_id"]
        del rental_deal_dict["car_id"]
        
        return JSONResponse(content={"data": rental_deal_dict}, status_code=200)
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)


@router.post("/")
async def create_rental_deal(new_rent: RentalDeal, session: AsyncSession = Depends(get_async_session)):
    try:
        stmt = insert(rental_deal).values(**new_rent.dict())
        print(stmt)
        plan_id = create_rental_plan(int(new_rent.total_price*100))
        print(plan_id)
        await session.execute(stmt)
        await session.commit()
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)
    return JSONResponse(content={"message": "Rental deal succesfully created", "plan_id": plan_id}, status_code=200)


@router.put("/update_rental_deal/{rental_deal_id}")
async def update_rental_deal(rental_deal_id: int, rent_update: RentalDealInfo , session: AsyncSession = Depends(get_async_session)):
    try:
        stmt = update(rental_deal).where(rental_deal.c.id == rental_deal_id).values(**rent_update.model_dump())
        await session.execute(stmt)
        await session.commit()
        print(stmt)
        return JSONResponse(content={"message": "Rental deal data updated"}, status_code=200)
    except IndexError as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Wrong rental_deal_id, this rental deal doesn't exist"}, status_code=400)
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)



@router.delete("/{car_id}")
async def delete_rental_deal(car_id: int, session: AsyncSession = Depends(get_async_session)):
    try:
        count_before = await session.scalar(select(func.count()).select_from(rental_deal))
        stmt = delete(rental_deal).where(rental_deal.c.car_id == car_id)
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


@router.delete("/delete_rental_deal/{rental_deal_id}")
async def stuff_delete_rental_deal(rental_deal_id: int, session: AsyncSession = Depends(get_async_session)):
    try:
        count_before = await session.scalar(select(func.count()).select_from(rental_deal))
        stmt = delete(rental_deal).where(rental_deal.c.id == rental_deal_id)
        await session.execute(stmt)
        await session.commit()
        count_after = await session.scalar(select(func.count()).select_from(rental_deal))
        
        if count_before == count_after:
            raise Exception
        
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)
    return JSONResponse(content={"message": "Rental deal was deleted"}, status_code=200)



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
        return JSONResponse(content={"data": res}, status_code=200)  
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)
    
    
@router.get("/", response_model=List[StuffRentalDeal])
async def get_all_rental_deals(session: AsyncSession = Depends(get_async_session)):
    try:
        count_rental_deals = await session.scalar(select(func.count()).select_from(rental_deal))
        
        if count_rental_deals == 0:
            return JSONResponse(content=[{"message": "There is 0 rental deals now"}], status_code=200)
        
        rental_query = select(
            rental_deal.c.id,
            user.c.username,
            car.c.id.label("car_id"),
            car.c.brand,
            car.c.model,
            car.c.registration_plate,
            rental_deal.c.start_date,
            rental_deal.c.end_date,
            rental_deal.c.reception_point,
            rental_deal.c.issue_point,
            rental_deal.c.total_price
        ).select_from(
            rental_deal
            .join(user, user.c.id == rental_deal.c.user_id)
            .join(car, car.c.id == rental_deal.c.car_id)
        )
        
        rental_result = await session.execute(rental_query)
        rental_list = [dict(r._mapping) for r in rental_result]
    
        return JSONResponse(content={"data": rental_list}, status_code=200)  
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)
