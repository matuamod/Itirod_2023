from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy import func, select, insert, update, delete, join
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import exc
from database import get_async_session
from .reviews import review as review
from users import user as user
from cars import car as car
from .schemas import ReviewCreate, ReviewInfo, ReviewUpdate, StuffReviewCreate
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


@router.post("/stuff_review_create")
async def stuff_create_review(new_review: StuffReviewCreate, session: AsyncSession = Depends(get_async_session)):
    try:
        user_id_query = select(user.c.id).where(user.c.username == new_review.username)
        user_id_result = await session.execute(user_id_query)
        
        try:
            user_id = user_id_result.scalar_one()
        except exc.NoResultFound:
            raise HTTPException(
                status_code=400,
                detail="User not found"
            )
            
        car_id_query = select(car.c.id).where(car.c.registration_plate == new_review.registration_plate)
        car_id_result = await session.execute(car_id_query)
        
        try:
            car_id = car_id_result.scalar_one()
        except exc.NoResultFound:
            raise HTTPException(
                status_code=400,
                detail="Car with this registration plate doesn't exists."
            )

        review_insert = insert(review).values(
            user_id=user_id,
            car_id=car_id,
            message=new_review.message
        )
        await session.execute(review_insert)
        await session.commit()
    except HTTPException as e:
        return JSONResponse(content={"message": e.detail}, status_code=e.status_code)
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)
    return JSONResponse(content={"message": "Review succesfully created"}, status_code=200)


@router.get("/review/{review_id}")
async def get_review(review_id: int, session: AsyncSession = Depends(get_async_session)):
    try:
        query = select(review.c.message).where(review.c.id == review_id)
        result = await session.execute(query)
        message = [dict(r._mapping) for r in result][0]
        return JSONResponse(content={"data": message}, status_code=200)
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)


@router.put("/review_update/{review_id}")
async def update_review(review_id: int, new_message: ReviewUpdate, session: AsyncSession = Depends(get_async_session)):
    try:
        stmt = update(review).where(review.c.id == review_id).values(**new_message.model_dump() )
        await session.execute(stmt)
        await session.commit()
        return JSONResponse(content={"message": "Review data updated"}, status_code=200)
    except IndexError as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Wrong review_id, this review doesn't exist"}, status_code=400)
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)


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
            return JSONResponse(content={"message": "Car has 0 reviews yet..."}, status_code=200)
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
            
            return JSONResponse(content={"message": f"Car has {reviews_count} reviews:", "data": reviews_list}, status_code=200)
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

