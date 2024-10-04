from databases import Database
from typing import Optional, List
from datetime import datetime, timedelta

POSTGRES_USER = "temp"
POSTGRES_PASSWORD = "temp"
POSTGRES_DB = "advcompro"
POSTGRES_HOST = "db"

DATABASE_URL = f"postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}/{POSTGRES_DB}"

database = Database(DATABASE_URL)


async def connect_db():
    await database.connect()
    print("Database connected")


async def disconnect_db():
    await database.disconnect()
    print("Database disconnected")


# Function to insert a new user into the users table
async def insert_user(username: str, password_hash: str, email: str):
    query = """
    INSERT INTO users (username, password_hash, email)
    VALUES (:username, :password_hash, :email)
    RETURNING user_id, username, password_hash, email, created_at
    """
    values = {"username": username, "password_hash": password_hash, "email": email}
    return await database.fetch_one(query=query, values=values)


# Function to select a user by user_id from the users table
async def get_all_users_from_db():
    query = "SELECT * FROM users"
    return await database.fetch_all(query)


# Function to select a user by user_id from the users table
async def get_user(user_id: int):
    query = "SELECT * FROM users WHERE user_id = :user_id"
    return await database.fetch_one(query=query, values={"user_id": user_id})


# Function to select a user by email from the users table
async def get_user_by_email(email: str, password_hash: str):
    query = (
        "SELECT * FROM users WHERE email = :email and password_hash = :password_hash"
    )
    return await database.fetch_one(
        query=query, values={"email": email, "password_hash": password_hash}
    )


async def get_user_by_username(username: str):
    query = "SELECT * FROM users WHERE username = :username"
    return await database.fetch_one(query=query, values={"username": username})


async def get_user_by_email_2(email: str):
    query = "SELECT * FROM users WHERE email = :email"
    return await database.fetch_one(query=query, values={"email": email})


async def update_user(
    username,
    email,
    password_hash,
    user_id,
):
    query = """
    UPDATE users 
    SET username = :username, password_hash = :password_hash, email = :email
    WHERE user_id = :user_id
    RETURNING username, password_hash, email, user_id
    """
    values = {
        "user_id": user_id,
        "username": username,
        "password_hash": password_hash,
        "email": email,
    }
    return await database.fetch_one(query=query, values=values)


# Function to delete a user from the users table
async def delete_user(user_id: int):
    query = "DELETE FROM users WHERE user_id = :user_id RETURNING *"
    return await database.fetch_one(query=query, values={"user_id": user_id})


# Function to select all products from the products table
async def get_all_products_from_db():
    query = """
    SELECT p.product_id, p.product_name, p.product_quantity, p.image_url, p.product_description, p.pro_category_id, c.category_name
    FROM products p
    JOIN productcategory c ON p.pro_category_id = c.pro_category_id
    """
    return await database.fetch_all(query)


# Function to select a user by user_id from the users table
async def get_product(product_id: int):
    query = "SELECT * FROM products WHERE product_id = :product_id"
    return await database.fetch_one(query=query, values={"product_id": product_id})


async def insert_product(
    product_name: str,
    product_quantity: int,
    pro_category_id: int,
    image_url: str,
    product_description: str,
):
    # Example implementation to insert the product into the database
    query = """INSERT INTO products (product_name, product_quantity, pro_category_id, image_url, product_description)
    VALUES (:product_name,  :product_quantity, :pro_category_id, :image_url, :product_description)
    RETURNING product_id, product_name, product_quantity, pro_category_id, image_url, product_description,created_at"""
    values = {
        "product_name": product_name,
        "product_quantity": product_quantity,
        "pro_category_id": pro_category_id,
        "image_url": image_url,
        "product_description": product_description,
    }
    return await database.fetch_one(query=query, values=values)


async def update_product(
    product_name,
    product_quantity,
    pro_category_id,
    image_url,
    product_description,
    product_id,
):
    query = """
    UPDATE products
    SET product_name = :product_name,
        product_quantity = :product_quantity,
        pro_category_id = :pro_category_id,
        image_url = :image_url,
        product_description = :product_description
    WHERE product_id = :product_id
    RETURNING *;
    """
    values = {
        "product_id": product_id,
        "product_name": product_name,
        "product_quantity": product_quantity,
        "pro_category_id": pro_category_id,
        "image_url": image_url,
        "product_description": product_description,
    }
    return await database.fetch_one(query, values)


# Function to delete a user from the users table
async def delete_product(product_id: int):
    query = "DELETE FROM products WHERE product_id = :product_id RETURNING *"
    return await database.fetch_one(query=query, values={"product_id": product_id})


# Function to select all products from the products table
async def get_all_categories_from_db():
    query = """
    SELECT * FROM productcategory
    """
    return await database.fetch_all(query)


# database.py (or wherever your database functions are defined)


async def get_products_by_category(category_name: str):
    query = """
    SELECT p.product_id, p.product_name, p.product_quantity, p.image_url, p.product_description, p.pro_category_id, c.category_name
    FROM products p
    JOIN productcategory c ON p.pro_category_id = c.pro_category_id
    WHERE c.category_name = :category_name
    """
    async with database.transaction():
        products = await database.fetch_all(
            query=query, values={"category_name": category_name}
        )
    return products


async def get_products_by_category_id(pro_category_id: int):
    query = """
    SELECT p.product_name, p.product_quantity, p.pro_category_id
    FROM products p
    WHERE p.pro_category_id = :pro_category_id
    """
    async with database.transaction():
        products = await database.fetch_all(
            query=query, values={"pro_category_id": pro_category_id}
        )
    return products


# Insert a new rent record
async def insert_rent(
    user_id: int,
    product_id: int,
):
    query = """
    INSERT INTO rent (user_id, product_id)
    VALUES (:user_id, :product_id)
    RETURNING rent_id, user_id, product_id, rental_date, return_date
    """
    async with database.transaction():
        rent = await database.fetch_one(
            query=query,
            values={
                "user_id": user_id,
                "product_id": product_id,
            },
        )
    return rent


# Fetch the current product quantity
async def get_product_quantity(product_id: int):
    query = """SELECT product_quantity FROM products WHERE product_id = :product_id"""
    async with database.transaction():
        products = await database.fetch_one(
            query=query, values={"product_id": product_id}
        )
    return products["product_quantity"]


# Decrement the product quantity by 1
async def decrement_product_quantity(product_id: int):
    query = """
    UPDATE products
    SET product_quantity = product_quantity - 1
    WHERE product_id = :product_id AND product_quantity > 0
    RETURNING product_quantity
    """
    async with database.transaction():
        updated_product = await database.fetch_all(
            query=query, values={"product_id": product_id}
        )
    return updated_product


async def get_current_rentals_by_id(user_id: int):
    query = """
    SELECT r.rent_id, r.user_id, r.product_id, p.product_name, pc.category_name
    FROM rent r
    JOIN products p ON r.product_id = p.product_id
    JOIN productcategory pc ON p.pro_category_id = pc.pro_category_id
    WHERE r.user_id = :user_id
    """
    async with database.transaction():
        current_rent = await database.fetch_all(
            query=query, values={"user_id": user_id}
        )
    return current_rent


# Function to delete rent record from the rent table
async def delete_rent(rent_id: int):
    query = "DELETE FROM rent WHERE rent_id = :rent_id RETURNING *"
    return await database.fetch_one(query=query, values={"rent_id": rent_id})


# Function to increment the product quantity
async def increment_product_quantity(product_id: int):
    query = """
    UPDATE products
    SET product_quantity = product_quantity + 1
    WHERE product_id = :product_id
    RETURNING product_quantity
    """
    return await database.fetch_one(query=query, values={"product_id": product_id})
