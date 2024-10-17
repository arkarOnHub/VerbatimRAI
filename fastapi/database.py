from databases import Database
from typing import Optional, List
from datetime import datetime, timedelta, date

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


async def get_user_count():
    query = "SELECT COUNT(*) FROM users"  # Query to count the total categories
    count = await database.fetch_one(query=query)  # Fetch the result
    return count[0]  # Return the count value


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
    SELECT p.product_id, p.product_name, p.product_quantity, p.product_price, p.image_url, p.product_description, p.pro_category_id, c.category_name
    FROM products p
    JOIN productcategory c ON p.pro_category_id = c.pro_category_id
    """
    return await database.fetch_all(query)


# Function to select a user by user_id from the users table
async def get_product(product_id: int):
    query = "SELECT * FROM products WHERE product_id = :product_id"
    return await database.fetch_one(query=query, values={"product_id": product_id})


async def get_product_count():
    query = "SELECT COUNT(*) FROM products"  # Query to count the total categories
    count = await database.fetch_one(query=query)  # Fetch the result
    return count[0]  # Return the count value


async def get_product_price(product_id: int):
    query = "SELECT product_price FROM products WHERE product_id = :product_id"

    # Using a dictionary for parameters
    values = {
        "product_id": product_id,
    }

    result = await database.fetch_one(query=query, values=values)
    return result["product_price"] if result else None


async def insert_product(
    product_name: str,
    product_quantity: int,
    pro_category_id: int,
    product_price: int,
    image_url: str,
    product_description: str,
):
    # Example implementation to insert the product into the database
    query = """INSERT INTO products (product_name, product_quantity, pro_category_id, product_price, image_url, product_description)
    VALUES (:product_name,  :product_quantity, :pro_category_id, :product_price, :image_url, :product_description)
    RETURNING product_id, product_name, product_quantity, pro_category_id, product_price, image_url, product_description,created_at"""
    values = {
        "product_name": product_name,
        "product_quantity": product_quantity,
        "pro_category_id": pro_category_id,
        "product_price": product_price,
        "image_url": image_url,
        "product_description": product_description,
    }
    return await database.fetch_one(query=query, values=values)


async def update_product(
    product_name,
    product_quantity,
    pro_category_id,
    product_price,
    image_url,
    product_description,
    product_id,
):
    query = """
    UPDATE products
    SET product_name = :product_name,
        product_quantity = :product_quantity,
        pro_category_id = :pro_category_id,
        product_price = :product_price,
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
        "product_price": product_price,
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


async def get_category_count():
    query = (
        "SELECT COUNT(*) FROM productcategory"  # Query to count the total categories
    )
    count = await database.fetch_one(query=query)  # Fetch the result
    return count[0]  # Return the count value


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


async def get_current_rentals():
    query = """
    SELECT r.rent_id, r.user_id, r.product_id, p.product_name, pc.category_name
    FROM rent r
    JOIN products p ON r.product_id = p.product_id
    JOIN productcategory pc ON p.pro_category_id = pc.pro_category_id
    """
    return await database.fetch_all(query)


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


async def get_rent_count():
    query = "SELECT COUNT(*) FROM rent"  # Query to count the total categories
    count = await database.fetch_one(query=query)  # Fetch the result
    return count[0]  # Return the count value


async def insert_sales(user_id: int, product_id: int, sale_price: int):
    query = """
    INSERT INTO sales (user_id, product_id, sale_price)
    VALUES (:user_id, :product_id, :sale_price)
    RETURNING sale_id, user_id, product_id, sale_price
    """

    values = {
        "user_id": user_id,
        "product_id": product_id,
        "sale_price": sale_price,
    }

    return await database.fetch_one(query=query, values=values)


async def get_total_sales():
    query = "SELECT SUM(sale_price) AS total_sales FROM sales"
    result = await database.fetch_one(query)
    return result["total_sales"] if result else 0


async def get_sale_count():
    query = "SELECT COUNT(*) FROM sales"  # Query to count the total categories
    count = await database.fetch_one(query=query)  # Fetch the result
    return count[0]  # Return the count value


async def get_most_rented_products():
    query = """
    SELECT p.product_id, p.product_name, COUNT(s.sale_id) AS rental_count
    FROM sales s
    JOIN products p ON s.product_id = p.product_id
    GROUP BY p.product_id, p.product_name
    ORDER BY rental_count DESC
    LIMIT 5;  -- Adjust the limit as needed
    """

    # Execute the query and fetch results
    return await database.fetch_all(query)


# Function to get total revenue for a specific date range
async def get_revenue_by_date(start_date: str, end_date: str):
    query = """
    SELECT SUM(sale_price) AS total_revenue
    FROM sales
    WHERE sale_date BETWEEN :start_date AND :end_date
    """
    result = await database.fetch_one(
        query=query, values={"start_date": start_date, "end_date": end_date}
    )
    return result["total_revenue"] if result else 0


# Function to get daily revenue for a specific date range
async def get_daily_revenue(start_date: date, end_date: date):
    query = """
    SELECT sale_date, SUM(sale_price) AS daily_revenue
    FROM sales
    WHERE sale_date BETWEEN :start_date AND :end_date
    GROUP BY sale_date
    ORDER BY sale_date
    """
    return await database.fetch_all(
        query=query, values={"start_date": start_date, "end_date": end_date}
    )


# Function to get most rented categories from the sales table
async def get_most_rented_categories():
    query = """
    SELECT pc.category_name, COUNT(s.sale_id) AS rental_count
    FROM sales s
    JOIN products p ON s.product_id = p.product_id
    JOIN productcategory pc ON p.pro_category_id = pc.pro_category_id
    GROUP BY pc.category_name
    ORDER BY rental_count DESC
    LIMIT 5;  -- Adjust the limit as needed
    """

    # Execute the query and fetch the results
    return await database.fetch_all(query)


async def get_total_sales_by_id(user_id: int):
    query = """
    SELECT SUM(sale_price) AS total_sales
    FROM sales
    WHERE user_id = :user_id
    """
    result = await database.fetch_one(query, values={"user_id": user_id})
    return result["total_sales"] if result and result["total_sales"] is not None else 0


async def get_sale_count_by_id(user_id: int):
    query = """SELECT COUNT(*) FROM sales
    WHERE user_id = :user_id"""  # Query to count the total categories
    count = await database.fetch_one(
        query, values={"user_id": user_id}
    )  # Fetch the result
    return count[0]  # Return the count value


async def get_most_rented_products_by_id(user_id: int):
    query = """
    SELECT p.product_name, COUNT(s.sale_id) AS rental_count
    FROM sales s
    JOIN products p ON s.product_id = p.product_id
    WHERE s.user_id = :user_id
    GROUP BY p.product_name
    ORDER BY rental_count DESC
    LIMIT 1;
    """

    # Execute the query and fetch results
    return await database.fetch_one(
        query, values={"user_id": user_id}
    )  # Fetch a single result


# Function to get most rented category by user_id
async def get_most_rented_category_by_user_id(user_id: int):
    query = """
    SELECT pc.category_name, COUNT(s.sale_id) AS rental_count
    FROM sales s
    JOIN products p ON s.product_id = p.product_id
    JOIN productcategory pc ON p.pro_category_id = pc.pro_category_id
    WHERE s.user_id = :user_id
    GROUP BY pc.category_name
    ORDER BY rental_count DESC
    LIMIT 1;  -- Adjust the limit if needed
    """

    # Execute the query and fetch the result
    return await database.fetch_one(
        query, values={"user_id": user_id}
    )  # Fetch a single result


async def get_rental_history(user_id: int):
    query = """
    SELECT s.user_id, p.product_id, p.product_name, pc.category_name
    FROM sales s
    JOIN products p ON s.product_id = p.product_id
    JOIN productcategory pc ON p.pro_category_id = pc.pro_category_id
    WHERE s.user_id = :user_id;
    """

    # Execute the query and fetch results
    return await database.fetch_all(query, values={"user_id": user_id})


async def get_total_sales_report(start_date, end_date):
    query = """
    SELECT sale_date, SUM(sale_price) AS total_sales
    FROM sales
    WHERE sale_date BETWEEN :start_date AND :end_date
    GROUP BY sale_date
    ORDER BY sale_date;
    """
    # Using a dictionary to bind parameters
    params = {"start_date": start_date, "end_date": end_date}
    return await database.fetch_all(query, params)


async def get_sales_by_product(start_date, end_date):
    query = """
    SELECT p.product_name, SUM(s.sale_price) as total_sales
    FROM sales s
    JOIN products p ON s.product_id = p.product_id
    WHERE s.sale_date BETWEEN $1 AND $2
    GROUP BY p.product_name
    ORDER BY total_sales DESC;
    """
    return await database.fetch_all(query, [start_date, end_date])


async def get_sales_by_category(start_date, end_date):
    query = """
    SELECT c.category_name, SUM(s.sale_price) as total_sales
    FROM sales s
    JOIN products p ON s.product_id = p.product_id
    JOIN categories c ON p.category_id = c.category_id
    WHERE s.sale_date BETWEEN $1 AND $2
    GROUP BY c.category_name
    ORDER BY total_sales DESC;
    """
    return await database.fetch_all(query, [start_date, end_date])


async def get_user_sales(start_date, end_date):
    query = """
    SELECT u.username, SUM(s.sale_price) as total_sales
    FROM sales s
    JOIN users u ON s.user_id = u.user_id
    WHERE s.sale_date BETWEEN $1 AND $2
    GROUP BY u.username
    ORDER BY total_sales DESC;
    """
    return await database.fetch_all(query, [start_date, end_date])
