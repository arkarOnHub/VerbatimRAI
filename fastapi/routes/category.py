# fastapi_app.py (or wherever your FastAPI routes are)
from fastapi import APIRouter, FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from database import *

router = APIRouter()


class Product(BaseModel):
    product_id: int  # Ensure this is included
    product_name: str
    product_quantity: int
    # pro_category_id: int
    image_url: str
    product_description: Optional[str]


class ProductByID(BaseModel):
    product_name: str
    product_quantity: int
    pro_category_id: int


class CategoryCountResponse(BaseModel):
    count: int


class Category(BaseModel):
    pro_category_id: int
    category_name: str
    # number_of_products: Optional[int]  # Uncomment if needed


@router.get("/categories", response_model=List[Category])
async def get_all_categories():
    products = await get_all_categories_from_db()
    if products is None:
        raise HTTPException(status_code=404, detail="Products not found")
    return products


# Create a FastAPI route to fetch products from the database
@router.get("/categories/products", response_model=List[Category])
async def get_all_products_by_category(category_name: str):
    products = await get_products_by_category(category_name)
    if products is None:
        raise HTTPException(status_code=404, detail="Products not found")
    return products


# # Endpoint to get a Product by user_id
# @router.get("/products/{product_id}", response_model=Product)
# async def read_product(product_id: int):
#     result = await get_product(product_id)
#     if result is None:
#         raise HTTPException(status_code=404, detail="Product not found")
#     return result


# category.py


@router.get("/products/categories/{category_name}", response_model=List[Product])
async def fetch_products_by_category(category_name: str):
    # Call the correct database function
    products = await get_products_by_category(category_name)
    if not products:
        raise HTTPException(status_code=404, detail="Products not found")
    return products


@router.get(
    "/products/categories/id/{pro_category_id}", response_model=List[ProductByID]
)
async def fetch_products_by_category_id(pro_category_id: int):
    # Call the database function to fetch products by category ID
    products = await get_products_by_category_id(pro_category_id)
    if not products:
        raise HTTPException(status_code=404, detail="Products not found")
    return products


@router.get("/categories/count", response_model=CategoryCountResponse)
async def get_category_count_endpoint():
    # Call the database function to fetch the count of categories
    count = await get_category_count()  # Ensure this function is defined properly
    if count is None:  # Adjust this check based on your implementation
        raise HTTPException(status_code=404, detail="Categories not found")
    return {"count": count}  # Return the count in a dictionary
