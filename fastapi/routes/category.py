# fastapi_app.py (or wherever your FastAPI routes are)
from fastapi import APIRouter, FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from database import *

router = APIRouter()


class Product(BaseModel):
    product_name: str
    product_quantity: int
    pro_category_id: int


# Define a model to represent the product
class Category(BaseModel):
    category_name: str
    # number_of_products: int
    pro_category_id: int


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


@router.get("/products/categories/id/{pro_category_id}", response_model=List[Product])
async def fetch_products_by_category_id(pro_category_id: int):
    # Call the database function to fetch products by category ID
    products = await get_products_by_category_id(pro_category_id)
    if not products:
        raise HTTPException(status_code=404, detail="Products not found")
    return products
