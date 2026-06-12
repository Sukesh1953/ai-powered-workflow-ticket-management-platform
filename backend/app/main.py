from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from app.database.db import engine, Base, SessionLocal
from app.models.user import User
from app.models.schemas import UserCreate
from app.auth.security import hash_password
from sqlalchemy import select
from app.models.schemas import UserCreate, UserLogin
from app.auth.security import (
    hash_password,
    verify_password,
    create_access_token,
    verify_token
)
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models.workflow import Workflow
from app.models.schemas import WorkflowCreate
from app.models.schemas import SummarizeRequest
from app.services.ai_service import summarize_text

from app.database.db import engine
from app.database.db import SessionLocal
from app.models.ticket_models import Ticket
from app.models.schemas import TicketUpdate

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

Base.metadata.create_all(bind=engine)

# Database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def home():
    return {"message": "AI Workflow Automation Platform Running"}

# Register user
@app.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):

    hashed_pw = hash_password(user.password)

    new_user = User(
        username=user.username,
        email=user.email,
        password=hashed_pw
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user_id": new_user.id
    }

@app.post("/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user:
        return {"error": "User not found"}

    if not verify_password(
        user.password,
        db_user.password
    ):
        return {"error": "Invalid password"}

    access_token = create_access_token(
        data={"sub": db_user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@app.get("/profile")
def get_profile(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    email = verify_token(token)

    if not email:
        return {"error": "Invalid token"}

    return {
        "message": "Protected profile data",
        "user_email": email
    }

@app.post("/workflows")
def create_workflow(
    workflow: WorkflowCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):

    token = credentials.credentials

    email = verify_token(token)

    if not email:
        return {"error": "Invalid token"}

    db_user = db.query(User).filter(
        User.email == email
    ).first()

    new_workflow = Workflow(
        name=workflow.name,
        description=workflow.description,
        owner_id=db_user.id
    )

    db.add(new_workflow)
    db.commit()
    db.refresh(new_workflow)

    return {
        "message": "Workflow created",
        "workflow_id": new_workflow.id
    }

@app.get("/workflows")
def get_workflows(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):

    token = credentials.credentials

    email = verify_token(token)

    if not email:
        return {"error": "Invalid token"}

    db_user = db.query(User).filter(
        User.email == email
    ).first()

    workflows = db.query(Workflow).filter(
        Workflow.owner_id == db_user.id
    ).all()

    return workflows

@app.delete("/workflows/{workflow_id}")
def delete_workflow(
    workflow_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):

    token = credentials.credentials

    email = verify_token(token)

    if not email:
        return {"error": "Invalid token"}

    db_user = db.query(User).filter(
        User.email == email
    ).first()

    workflow = db.query(Workflow).filter(
        Workflow.id == workflow_id,
        Workflow.owner_id == db_user.id
    ).first()

    if not workflow:
        return {"error": "Workflow not found"}

    db.delete(workflow)

    db.commit()

    return {
        "message": "Workflow deleted successfully"
    }

@app.post("/ai/summarize")
def ai_summarize(
    request: SummarizeRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    email = verify_token(token)

    if not email:
        return {"error": "Invalid token"}

    return summarize_text(request.text)

@app.post("/tickets/create")
def create_ticket(
    request: SummarizeRequest,
    db: Session = Depends(get_db)
):

    ai_result = summarize_text(request.text)

    ticket = Ticket(
    summary=ai_result["summary"],
    priority=ai_result["priority"],
    category=ai_result["category"],
    department=ai_result["department"],
    assigned_to=ai_result["department"]
    )

    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    return {
    "ticket_id": ticket.id,
    "summary": ticket.summary,
    "priority": ticket.priority,
    "category": ticket.category,
    "department": ticket.department,
    "assigned_to": ticket.assigned_to,
    "status": ticket.status
}

@app.get("/tickets")
def get_tickets(
    db: Session = Depends(get_db)
):

    tickets = db.query(Ticket).all()

    return tickets
    



@app.put("/tickets/{ticket_id}")
def update_ticket(
    ticket_id: int,
    request: TicketUpdate,
    db: Session = Depends(get_db)
):

    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id
    ).first()

    if not ticket:
        return {"error": "Ticket not found"}

    ticket.status = request.status

    db.commit()
    db.refresh(ticket)

    return ticket

@app.get("/tickets/stats")
def ticket_stats(
    db: Session = Depends(get_db)
):

    total = db.query(Ticket).count()

    open_count = db.query(Ticket).filter(
        Ticket.status == "Open"
    ).count()

    closed_count = db.query(Ticket).filter(
        Ticket.status == "Closed"
    ).count()

    return {
        "total_tickets": total,
        "open_tickets": open_count,
        "closed_tickets": closed_count
    }

@app.get("/tickets/{ticket_id}")
def get_ticket(
    ticket_id: int,
    db: Session = Depends(get_db)
):

    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id
    ).first()

    if not ticket:
        return {"error": "Ticket not found"}

    return ticket

@app.put("/tickets/{ticket_id}/close")
def close_ticket(
    ticket_id: int,
    db: Session = Depends(get_db)
):

    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id
    ).first()

    if not ticket:
        return {"error": "Ticket not found"}

    ticket.status = "Closed"

    db.commit()
    db.refresh(ticket)

    return {
        "message": "Ticket closed successfully",
        "ticket_id": ticket.id
    }