from fastapi import FastAPI
from users import router as router_user
from cars import router as router_car
from rental_deal import router as router_rental_deal
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Car Rental"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(router_user)
app.include_router(router_car)
app.include_router(router_rental_deal)

