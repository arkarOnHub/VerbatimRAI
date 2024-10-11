from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone, timedelta
from database import *

router = APIRouter()


class MostRentedProduct(BaseModel):
    product_id: int
    product_name: str


class MostRentedProductsResponse(BaseModel):
    products: List[MostRentedProduct]


class TotalSalesResponse(BaseModel):
    total_sales: int


class SalesCountResponse(BaseModel):
    count: int


@router.get("/total-sales", response_model=TotalSalesResponse)
async def total_sales():
    total = await get_total_sales()
    return {"total_sales": total}


@router.get("/sales/count", response_model=SalesCountResponse)
async def get_sale_count_endpoint():
    # Call the database function to fetch the count of categories
    count = await get_sale_count()  # Ensure this function is defined properly
    if count is None:  # Adjust this check based on your implementation
        raise HTTPException(status_code=404, detail="Sales not found")
    return {"count": count}  # Return the count in a dictionary


# Route to get most rented products
@router.get("/sales/most-rented-products", response_model=MostRentedProductsResponse)
async def most_rented_products():
    products = await get_most_rented_products()  # Call the database function
    if not products:
        raise HTTPException(status_code=404, detail="No rented products found")
    return {
        "products": [MostRentedProduct(**product) for product in products]
    }  # Return the products in the expected format
