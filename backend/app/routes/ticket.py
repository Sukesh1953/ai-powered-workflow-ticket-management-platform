from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.db import SessionLocal
from app.models.ticket_models import Ticket

router = APIRouter(prefix="/tickets", tags=["Tickets"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_tickets(db: Session = Depends(get_db)):
    return db.query(Ticket).all()


@router.post("/")
def create_ticket(ticket: dict, db: Session = Depends(get_db)):
    new_ticket = Ticket(
        summary=ticket.get("summary"),
        priority=ticket.get("priority", "Medium"),
        category=ticket.get("category", "General"),
        department=ticket.get("department", "Support"),
        resolution=ticket.get("resolution", ""),
        assigned_to=ticket.get("assigned_to", ""),
        status="Open",
    )

    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)

    return new_ticket


@router.put("/{ticket_id}")
def update_ticket(ticket_id: int, ticket: dict, db: Session = Depends(get_db)):
    db_ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()

    if not db_ticket:
        return {"message": "Ticket not found"}

    for key, value in ticket.items():
        setattr(db_ticket, key, value)

    db.commit()
    db.refresh(db_ticket)

    return db_ticket


@router.delete("/{ticket_id}")
def delete_ticket(ticket_id: int, db: Session = Depends(get_db)):
    db_ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()

    if not db_ticket:
        return {"message": "Ticket not found"}

    db.delete(db_ticket)
    db.commit()

    return {"message": "Ticket deleted"}

@router.get("/dashboard/stats")
def dashboard_stats(db: Session = Depends(get_db)):

    total = db.query(Ticket).count()

    open_tickets = db.query(Ticket).filter(
        Ticket.status == "Open"
    ).count()

    critical = db.query(Ticket).filter(
        Ticket.priority == "Critical"
    ).count()

    resolved = db.query(Ticket).filter(
        Ticket.status == "Resolved"
    ).count()

    return {
        "total": total,
        "open": open_tickets,
        "critical": critical,
        "resolved": resolved
    }