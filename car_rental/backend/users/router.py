from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy import select, insert, update, delete, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import exc
from database import get_async_session
from .users import user
from .blocked_users import blocked_user
from .reset_passwords import reset_password
from .schemas import UserInfo, UserCreate, UserUpdate, UserLogin, BlockedUserData, ResetPasswordsData, PasswordResetCreate
from typing import List
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import random
import string

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
    
    
@router.get("/get_blocked_data", response_model=List[BlockedUserData])
async def get_blocked_data(session: AsyncSession = Depends(get_async_session)):
    try:
        count_blocked_users = await session.scalar(select(func.count()).select_from(blocked_user))
        
        if count_blocked_users == 0:
            return JSONResponse(content=[{"message": "There are no blocked users in the system"}], status_code=200)
        else:
            blocked_users_query = select(blocked_user)
            
            result = await session.execute(blocked_users_query)
            blocked_user_list = [dict(r._mapping) for r in result]
            
            return JSONResponse(content={"data": blocked_user_list}, status_code=200)
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)
    
    
@router.get("/get_reset_passwords_data", response_model=List[ResetPasswordsData])
async def get_reset_passwords_data(session: AsyncSession = Depends(get_async_session)):
    try:
        count_reset_passwords = await session.scalar(select(func.count()).select_from(reset_password))
        
        if count_reset_passwords == 0:
            return JSONResponse(content=[{"message": "There are no reset passwords in the system"}], status_code=200)
        else:
            reset_passwords_query = select(reset_password)
            
            result = await session.execute(reset_passwords_query)
            reset_password_list = [dict(r._mapping) for r in result]
            
            return JSONResponse(content={"data": reset_password_list}, status_code=200)
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)
    
    
@router.post("/set_reset_password")
async def set_reset_password(new_password_reset: PasswordResetCreate, session: AsyncSession = Depends(get_async_session)):
    try:
        user_exists_query = select(user).where(
            (user.c.username == new_password_reset.username) &
            (user.c.email == new_password_reset.email)
        )
        user_exists_result = await session.execute(user_exists_query)
        existing_user = user_exists_result.scalar()
        
        if existing_user is None:
            raise HTTPException(
                status_code=400,
                detail="This user with such data is not registered in the system"
            )
        
        stmt = insert(reset_password).values(**new_password_reset.model_dump())
        await session.execute(stmt)
        await session.commit()
        
        query = select(reset_password).where(reset_password.c.username == new_password_reset.username)
        result = await session.execute(query)
        password_dict = [dict(r._mapping) for r in result][0]
        reset_password_username = password_dict.get('username')
    except HTTPException as e:
        return JSONResponse(content={"message": e.detail}, status_code=e.status_code)
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)
    if(reset_password_username == new_password_reset.username):
        return JSONResponse(content={"message": "Reset data succesfully created. Check your email with new password"}, status_code=200)
    

def generate_random_password(length=8):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))


async def send_email(recipient_email, new_password):
    sender_email = "matua.models2003@gmail.com"
    sender_password = "nxsa rvqr oknx vtfa"
    subject = "Your New Password in Car Rental Site"
    message = f"Your new password is: {new_password}"

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = subject
    msg.attach(MIMEText(message, 'plain'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, recipient_email, msg.as_string())
        server.quit()
        print("Email sent successfully")
    except Exception as e:
        print("Failed to send email")
        print(str(e))

    
@router.put("/update_user_password_data/{reset_password_id}")
async def update_user_password_data(reset_password_id: int, session: AsyncSession = Depends(get_async_session)):
    try:
        query = select(reset_password).where(reset_password.c.id == reset_password_id)
        result = await session.execute(query)
        reset_password_dict = [dict(r._mapping) for r in result][0]
        user_email = reset_password_dict.get('email')
        
        random_password = generate_random_password()
        
        stmt = update(user).where(user.c.email == user_email).values(password = random_password)
        await session.execute(stmt)
        await session.commit()                
        await send_email(user_email, random_password)
        return JSONResponse(content={"message": "User random password updated"}, status_code=200)
    except IndexError as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Wrong reset_password_id, this data doesn't exist"}, status_code=400)
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)
    

@router.delete("/reject_reset_password_data/{reset_password_id}")
async def reject_reset_password_data(reset_password_id: int, session: AsyncSession = Depends(get_async_session)):
    try:
        count_before = await session.scalar(select(func.count()).select_from(reset_password))
        stmt = delete(reset_password).where(reset_password.c.id == reset_password_id)
        await session.execute(stmt)
        await session.commit()
        count_after = await session.scalar(select(func.count()).select_from(reset_password))
        
        if count_before == count_after:
            raise Exception
        
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)
    return JSONResponse(content={"message": "Password reset succesfully rejected"}, status_code=200)

    
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


@router.delete("/delete_blocked_data/{blocked_user_id}")
async def delete_blocked_data(blocked_user_id: int, session: AsyncSession = Depends(get_async_session)):
    try:
        count_before = await session.scalar(select(func.count()).select_from(blocked_user))
        stmt = delete(blocked_user).where(blocked_user.c.id == blocked_user_id)
        await session.execute(stmt)
        await session.commit()
        count_after = await session.scalar(select(func.count()).select_from(blocked_user))
        
        if count_before == count_after:
            raise Exception
        
    except Exception as e:
        print(type(e))
        print(e)
        return JSONResponse(content={"message": "Error"}, status_code=400)
    return JSONResponse(content={"message": "Blocked data succesfully deleted"}, status_code=200)


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
