from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone, timedelta, date
from database import *
import csv
import io

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


@router.get("/sales/total/{user_id}", response_model=TotalSalesResponse)
async def get_total_sales_endpoint(user_id: int):
    total_sales = await get_total_sales_by_id(user_id)
    if total_sales is None:
        raise HTTPException(status_code=404, detail="No sales found for this user")
    return {"total_sales": total_sales}


@router.get("/sales/count/{user_id}", response_model=SalesCountResponse)
async def get_sale_count_by_id_endpoint(user_id: int):
    # Call the database function to fetch the count of categories
    count = await get_sale_count_by_id(
        user_id
    )  # Ensure this function is defined properly
    if count is None:  # Adjust this check based on your implementation
        raise HTTPException(status_code=404, detail="Sales not found")
    return {"count": count}  # Return the count in a dictionary


# Route to get the most rented product name by user_id
@router.get("/sales/most-rented-product/{user_id}", response_model=str)
async def most_rented_product_by_id_endpoint(user_id: int):
    product = await get_most_rented_products_by_id(
        user_id
    )  # Call the database function
    if not product:
        raise HTTPException(status_code=404, detail="No rented products found")

    # Return only the product_name
    return product["product_name"]


# Route to get the most rented category name by user_id
@router.get("/sales/most-rented-category/{user_id}", response_model=str)
async def most_rented_category_by_user_id_endpoint(user_id: int):
    category = await get_most_rented_category_by_user_id(
        user_id
    )  # Call the database function
    if not category:
        raise HTTPException(
            status_code=404, detail="No rented categories found for this user"
        )

    # Return only the category_name
    return category["category_name"]


@router.get("/sales/report/download")
async def download_sales_report(
    report_type: str,
    start_date: str,
    end_date: str,
    file_format: str,
):
    # Validate date inputs
    try:
        start_date_obj = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_date_obj = datetime.strptime(end_date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(
            status_code=400, detail="Invalid date format. Use YYYY-MM-DD."
        )

    # Fetch data based on report type
    if report_type == "total-sales":
        data = await get_total_sales_report(start_date_obj, end_date_obj)
    elif report_type == "sales-by-product":
        data = await get_sales_by_product(start_date_obj, end_date_obj)
    elif report_type == "sales-by-category":
        data = await get_sales_by_category(start_date_obj, end_date_obj)
    elif report_type == "user-sales":
        data = await get_user_sales(start_date_obj, end_date_obj)
    else:
        raise HTTPException(status_code=400, detail="Invalid report type")

    if file_format == "csv":
        # Generate CSV file
        output = io.StringIO()
        writer = csv.writer(output)

        # Write headers
        if data:
            writer.writerow(data[0].keys())  # Write headers from the first row

            # Write data rows
            for row in data:
                writer.writerow(row.values())

        output.seek(0)

        return StreamingResponse(
            output,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=sales_report.csv"},
        )

    # elif file_format == "pdf":
    #     # Implement PDF generation here
    #     pdf_content = generate_pdf(data)  # Call your PDF generation function
    #     return StreamingResponse(
    #         io.BytesIO(pdf_content),
    #         media_type="application/pdf",
    #         headers={"Content-Disposition": "attachment; filename=sales_report.pdf"},
    #     )

    else:
        raise HTTPException(
            status_code=400, detail="Invalid file format. Use 'csv' or 'pdf'."
        )
