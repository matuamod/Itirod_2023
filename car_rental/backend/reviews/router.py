from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy import func, select, insert, update, delete, join
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import exc
from database import get_async_session
from .reviews import review as review
from users import user as user
from cars import car as car
from .schemas import ReviewCreate, ReviewInfo
from typing import List


router = APIRouter(
    prefix="/reviews",
    tags=["Reviews"]
)


@router.post("/")
async def create_review(new_review: ReviewCreate, session: AsyncSession = Depends(get_async_session)):
    try:
        stmt = insert(review).values(**new_review.dict())
        print(stmt)
        await session.execute(stmt)
        await session.commit()
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)
    return JSONResponse(content={"message": "Review succesfully created"}, status_code=200)


@router.get("/", response_model=List[ReviewInfo])
async def get_reviews(session: AsyncSession = Depends(get_async_session)):
    try:
        count_reviews = await session.scalar(select(func.count()).select_from(review))
        
        if count_reviews == 0:
            return JSONResponse(content=[{"message": "There is no reviews on any car"}], status_code=200)
        else:
            reviews_query = select(
                review.c.id,
                user.c.username.label("username"),
                car.c.brand,
                car.c.model,
                car.c.registration_plate,
                review.c.message
            ).select_from(
                review
                .join(user, user.c.id == review.c.user_id)
                .join(car, car.c.id == review.c.car_id)
            )
            
            result = await session.execute(reviews_query)
            reviews_info = []
            for row in result:
                reviews_info.append(dict(row._mapping))
            
            return JSONResponse(content={"data": reviews_info}, status_code=200)
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)


@router.get("/{car_id}")
async def get_car_reviews(car_id: int, session: AsyncSession = Depends(get_async_session)):
    try:
        reviews_count = await session.scalar(select(func.count()).select_from(review).where(review.c.car_id == car_id))
        
        if reviews_count == 0:
            return JSONResponse(content=[{"message": "Car has 0 reviews yet..."}], status_code=200)
        else:
            reviews_query = select(
                user.c.username,
                review.c.message,
                review.c.created_at
            ).select_from(
                join(user, review, user.c.id == review.c.user_id)
            ).where(
                review.c.car_id == car_id
            )

            reviews_result = await session.execute(reviews_query)
            reviews_list = [dict(r._mapping) for r in reviews_result]
            
            for review_item in reviews_list:
                review_item["created_at"] = review_item["created_at"].strftime("%H:%M %d-%m-%Y")
            
            res = [{"message": f"Car has {reviews_count} reviews:"}]
            res.extend(reviews_list)
            return JSONResponse(content=res, status_code=200)
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)
    
    
@router.delete("/{review_id}")
async def delete_review(review_id: int, session: AsyncSession = Depends(get_async_session)):
    try:
        count_before = await session.scalar(select(func.count()).select_from(review))
        stmt = delete(review).where(review.c.id == review_id)
        await session.execute(stmt)
        await session.commit()
        count_after = await session.scalar(select(func.count()).select_from(review))
        
        if count_before == count_after:
            raise Exception
        
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)
    return JSONResponse(content={"message": "Review succesfully deleted"}, status_code=200)

