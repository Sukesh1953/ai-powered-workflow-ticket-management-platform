from app.database.db import engine
from sqlalchemy import text

with engine.connect() as conn:
    result = conn.execute(text("""
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'tickets';
    """))

    print("\nColumns in tickets table:\n")

    for row in result:
        print(row[0])