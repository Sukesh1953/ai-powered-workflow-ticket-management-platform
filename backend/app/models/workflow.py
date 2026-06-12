from sqlalchemy import Column, Integer, String, ForeignKey
from app.database.db import Base

class Workflow(Base):
    __tablename__ = "workflows"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    description = Column(String)

    owner_id = Column(Integer, ForeignKey("users.id"))