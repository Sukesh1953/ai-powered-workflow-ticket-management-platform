from sqlalchemy import Column, Integer, String
from app.database.db import Base

class Ticket(Base):

    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)

    summary = Column(String)
    priority = Column(String)
    category = Column(String)
    department = Column(String)

    assigned_to = Column(String)

    status = Column(
        String,
        default="Open"
    )