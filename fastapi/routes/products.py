# fastapi_app.py (or wherever your FastAPI routes are)
from fastapi import APIRouter, FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from database import *

router = APIRouter()


# Pydantic model for user creation
class ProductCreate(BaseModel):
    product_name: str
    product_quantity: int
    pro_category_id: int  # Ensure this is included
    image_url: str
    product_description: Optional[str]
    # category_name: str


# Pydantic model for Product update
class ProductUpdate(BaseModel):
    product_name: Optional[str]
    product_quantity: Optional[int]
    product_description: Optional[str]
    pro_category_id: Optional[int]


# Define a model to represent the product
class Product(BaseModel):
    product_id: int
    product_name: str
    product_quantity: int
    image_url: str
    product_description: Optional[str]
    pro_category_id: int
    # category_name: str


# Create a FastAPI route to fetch products from the database
@router.get("/products", response_model=List[Product])
async def get_products():
    products = await get_all_products_from_db()
    if products is None:
        raise HTTPException(status_code=404, detail="Products not found")
    return products


# Endpoint to get a Product by user_id
@router.get("/products/{product_id}", response_model=Product)
async def read_product(product_id: int):
    result = await get_product(product_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return result


# Endpoint to update a user
@router.put("/products/{product_id}", response_model=Product)
async def update_product_endpoint(product_id: int, product: ProductUpdate):
    print(f"Updating product {product_id} with data: {product.dict()}")
    result = await update_product(
        product_id,
        product.product_name,
        product.product_quantity,
        product.image_url,
        product.product_description,
        product.pro_category_id,
    )
    if result is None:
        raise HTTPException(status_code=404, detail="product not found")
    return result


# Endpoint to create a new product
@router.post("/products/create", response_model=Product)
async def create_product(product: ProductCreate):
    result = await insert_product(
        product.product_name,
        product.product_quantity,
        product.pro_category_id,  # Include category ID
        product.image_url,  # Include image URL
        product.product_description,
    )
    if result is None:
        raise HTTPException(
            status_code=400, detail="Error creating product"
        )  # Change error message
    return result


# Endpoint to delete a user
@router.delete("/products/{product_id}")
async def delete_product_endpoint(product_id: int):
    result = await delete_product(product_id)
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted"}
