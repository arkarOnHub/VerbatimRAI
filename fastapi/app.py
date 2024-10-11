from typing import Union
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from database import *
from routes.users import router as users_router
from routes.products import router as products_router
from routes.category import router as category_router
from routes.rent import router as rent_router
from routes.sales import router as sales_router


app = FastAPI()

app.include_router(users_router, prefix="/api")
app.include_router(products_router, prefix="/api")
app.include_router(category_router, prefix="/api")
app.include_router(rent_router, prefix="/api")
app.include_router(sales_router, prefix="/api")


@app.on_event("startup")
async def startup():
    await connect_db()


@app.on_event("shutdown")
async def shutdown():
    await disconnect_db()
