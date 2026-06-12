from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class WorkflowCreate(BaseModel):
    name: str
    description: str


class SummarizeRequest(BaseModel):
    text: str


# -------------------------
# Ticket Schemas
# -------------------------

class TicketUpdate(BaseModel):
    status: str


class TicketResponse(BaseModel):
    id: int
    summary: str
    priority: str
    category: str
    department: str
    status: str

    class Config:
        from_attributes = True