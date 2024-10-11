from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone, timedelta, date
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


# Pydantic model for daily revenue response
class DailyRevenue(BaseModel):
    sale_date: Optional[str]
    daily_revenue: int


# Pydantic model for most rented categories response
class MostRentedCategory(BaseModel):
    category_name: str
    rental_count: int


class MostRentedCategoriesResponse(BaseModel):
    categories: List[MostRentedCategory]


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


# @router.get("/sales/revenue")
# async def read_revenue(start_date: str, end_date: str):
#     total_revenue = await get_revenue_by_date(start_date, end_date)
#     return {"total_revenue": total_revenue}


@router.get("/sales/daily-revenue", response_model=List[DailyRevenue])
async def read_daily_revenue(start_date: str, end_date: str):
    # Validate date format
    try:
        start_date_obj = datetime.strptime(
            start_date, "%Y-%m-%d"
        ).date()  # Convert to date
        end_date_obj = datetime.strptime(end_date, "%Y-%m-%d").date()  # Convert to date
        if start_date_obj > end_date_obj:
            raise ValueError("Start date must be before end date.")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Pass date objects to the query
    daily_revenue = await get_daily_revenue(start_date_obj, end_date_obj)

    if not daily_revenue:
        raise HTTPException(
            status_code=404, detail="No revenue data found for the given date range."
        )

    # Convert the sale_date to string in the result
    formatted_revenue = [
        {
            "sale_date": record["sale_date"].strftime("%Y-%m-%d"),
            "daily_revenue": record["daily_revenue"],
        }
        for record in daily_revenue
    ]

    return formatted_revenue


@router.get(
    "/sales/most-rented-categories", response_model=MostRentedCategoriesResponse
)
async def most_rented_categories():
    categories = await get_most_rented_categories()  # Call the database function
    if not categories:
        raise HTTPException(status_code=404, detail="No rented categories found")
    return {
        "categories": [MostRentedCategory(**category) for category in categories]
    }  # Return the categories in the expected format
