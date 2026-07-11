from sqlalchemy import text
from app.database.db import engine
from app.models.ticket_models import Ticket
from app.database.db import Base

with engine.connect() as conn:
    conn.execute(text("DROP TABLE IF EXISTS tickets CASCADE;"))
    conn.commit()

print("Old tickets table deleted.")

Base.metadata.create_all(bind=engine)

print("New tickets table created.")