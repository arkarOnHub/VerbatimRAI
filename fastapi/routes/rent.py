from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone, timedelta
from database import *

router = APIRouter()


# Pydantic model for rent creation
class RentCreate(BaseModel):
    user_id: int
    product_id: int
    # rental_date: Optional[datetime] = datetime.now(timezone.utc)


class RentedProduct(BaseModel):
    rent_id: int
    user_id: int
    product_id: int
    product_name: str
    category_name: str


class ReturnRentRequest(BaseModel):
    rent_id: int
    product_id: int


# Pydantic model to represent the rent response
class Rent(BaseModel):
    rent_id: int
    user_id: int
    product_id: int
    rental_date: datetime = datetime.now()
    return_date: datetime  # Add return_date to the response model


# Endpoint to create a new rent
@router.post("/rent/create", response_model=RentCreate)
async def create_rent(rent: RentCreate):
    # Fetch the current product quantity
    current_quantity = await get_product_quantity(rent.product_id)

    if current_quantity is None or current_quantity < 1:
        raise HTTPException(status_code=400, detail="Product is out of stock.")

    # Decrement product quantity by 1
    decrement_success = await decrement_product_quantity(rent.product_id)

    if not decrement_success:
        raise HTTPException(
            status_code=500, detail="Failed to update product quantity."
        )

    # Insert rent record in the database with both rental_date and return_date
    created_rent = await insert_rent(rent.user_id, rent.product_id)

    if not created_rent:
        raise HTTPException(status_code=500, detail="Failed to create rent.")

    return created_rent


# Add this function to your FastAPI app
@router.get("/rent/current/{user_id}", response_model=List[RentedProduct])
async def get_current_rentals_endpoint(user_id: int):
    current_rentals = await get_current_rentals_by_id(user_id)
    if current_rentals is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return current_rentals


@router.post("/rent/return")
async def return_rent(request: ReturnRentRequest):
    # Delete the rent record
    delete_success = await delete_rent(request.rent_id)
    if not delete_success:
        raise HTTPException(status_code=500, detail="Failed to delete rent record.")

    # Increment the product quantity
    increment_success = await increment_product_quantity(request.product_id)
    if not increment_success:
        raise HTTPException(
            status_code=500, detail="Failed to increment product quantity."
        )

    return {"message": "Product returned successfully."}
