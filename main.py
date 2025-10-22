from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import psycopg
import os
from pathlib import Path

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get the correct paths
base_dir = Path(__file__).parent
html_dir = base_dir / "Trainpilot.ai-main"

print(f"Base directory: {base_dir}")
print(f"HTML directory: {html_dir}")

# Serve static files
app.mount("/css", StaticFiles(directory=html_dir / "css"), name="css")
app.mount("/js", StaticFiles(directory=html_dir / "js"), name="js")
app.mount("/img", StaticFiles(directory=html_dir / "img"), name="img")

# Serve HTML files
@app.get("/")
async def read_root():
    employee_html_path = html_dir / "Employee.html"
    if employee_html_path.exists():
        return FileResponse(employee_html_path)
    else:
        return {"error": "Employee.html not found", "path": str(employee_html_path)}

@app.get("/{page_name}")
async def read_page(page_name: str):
    if page_name.endswith('.html') or '.' not in page_name:
        if not page_name.endswith('.html'):
            page_name += '.html'
        
        page_path = html_dir / page_name
        if page_path.exists():
            return FileResponse(page_path)
        else:
            raise HTTPException(status_code=404, detail=f"Page {page_name} not found")
    raise HTTPException(status_code=404, detail="Page not found")

# Database connection - CONNECT TO train_info DATABASE
def get_db_connection():
    try:
        conn = psycopg.connect(
            host="localhost",
            dbname="train_info",  # CHANGED: Connect to train_info database
            user="postgres",
            password="postgres",
            port="5432"
        )
        print("✅ Database connected successfully to train_info")
        return conn
    except Exception as e:
        print(f"❌ Database connection error: {e}")
        return None

# API endpoint to get train data - SIMPLIFIED since we know the table name
@app.get("/api/train/{train_number}")
async def get_train_data(train_number: str):
    print(f"🔍 Searching for train: {train_number}")
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        cursor = conn.cursor()
        
        # We know the table is train_data in train_info database
        table_name = "train_data"
        
        # Query to get train data
        query = """
            SELECT 
                train_num,
                train_name,
                arrival_time,
                departure_time,
                passenger_percentage,
                speed,
                route,
                train_running
            FROM train_data 
            WHERE train_num = %s
        """
        
        print(f"📝 Executing query: {query}")
        print(f"🔢 With parameter: {train_number}")
        
        cursor.execute(query, (train_number,))
        result = cursor.fetchone()
        
        if not result:
            raise HTTPException(status_code=404, detail=f"Train {train_number} not found in database")
        
        # Convert to dictionary
        columns = [desc[0] for desc in cursor.description]
        train_dict = dict(zip(columns, result))
        
        print(f"✅ Found train data: {train_dict}")
        
        # Convert time objects to strings
        if train_dict.get('arrival_time'):
            train_dict['arrival_time'] = str(train_dict['arrival_time'])
        if train_dict.get('departure_time'):
            train_dict['departure_time'] = str(train_dict['departure_time'])
            
        return train_dict
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Database error: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        cursor.close()
        conn.close()

# API endpoint to get all running trains
# @app.get("/api/trains")
# async def get_all_trains():
#     print("🔍 Getting all running trains")
    
#     conn = get_db_connection()
#     if not conn:
#         raise HTTPException(status_code=500, detail="Database connection failed")
    
#     try:
#         cursor = conn.cursor()
        
#         query = """
#             SELECT 
#                 train_num,
#                 train_name,
#                 arrival_time,
#                 departure_time,
#                 route,
#                 train_running
#             FROM train_data 
#             WHERE train_running = 'yes'
#             ORDER BY arrival_time
#             LIMIT 10
#         """
        
#         print(f"📝 Executing query: {query}")
        
#         cursor.execute(query)
#         results = cursor.fetchall()
        
#         # Convert to list of dictionaries
#         columns = [desc[0] for desc in cursor.description]
#         trains_list = []
#         for result in results:
#             train_dict = dict(zip(columns, result))
#             # Convert time objects to strings
#             if train_dict.get('arrival_time'):
#                 train_dict['arrival_time'] = str(train_dict['arrival_time'])
#             if train_dict.get('departure_time'):
#                 train_dict['departure_time'] = str(train_dict['departure_time'])
#             trains_list.append(train_dict)
        
#         print(f"✅ Found {len(trains_list)} running trains")
#         return trains_list
        
#     except Exception as e:
#         print(f"❌ Database error: {e}")
#         return []
#     finally:
#         cursor.close()
#         conn.close()

# Debug endpoint to verify database connection
@app.get("/api/debug/database")
async def debug_database():
    conn = get_db_connection()
    if not conn:
        return {"error": "Database connection failed"}
    
    try:
        cursor = conn.cursor()
        
        # Check if train_data table exists and get sample data
        cursor.execute("""
            SELECT COUNT(*) as total_trains FROM train_data
        """)
        total_trains = cursor.fetchone()[0]
        
        # Get sample train numbers
        cursor.execute("""
            SELECT train_num, train_name 
            FROM train_data 
            LIMIT 5
        """)
        sample_trains = cursor.fetchall()
        
        # Get table structure
        cursor.execute("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'train_data'
            ORDER BY ordinal_position
        """)
        table_structure = cursor.fetchall()
        
        return {
            "database": "train_info",
            "table": "train_data",
            "total_trains": total_trains,
            "sample_trains": [{"number": train[0], "name": train[1]} for train in sample_trains],
            "table_structure": [{"column": col[0], "type": col[1]} for col in table_structure],
            "message": "Try these train numbers in your search: " + ", ".join([train[0] for train in sample_trains])
        }
        
    except Exception as e:
        return {"error": str(e)}
    finally:
        cursor.close()
        conn.close()

# Health check endpoint
@app.get("/api/health")
async def health_check():
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT 1")
            db_status = "connected"
            conn.close()
        except:
            db_status = "error"
    else:
        db_status = "disconnected"
    
    return {
        "status": "healthy",
        "database": db_status,
        "database_name": "train_info",
        "table": "train_data",
        "message": "Trainpilot API is running"
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Trainpilot Server...")
    print("📍 Access the application at: http://localhost:8000")
    print("🗄️ Connected to database: train_info")
    print("📊 Table: train_data")
    print("🔧 Debug endpoints:")
    print("   - http://localhost:8000/api/health")
    print("   - http://localhost:8000/api/debug/database")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)