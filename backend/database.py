"""
VeraFi Database Layer
---------------------
SQLite persistence using SQLAlchemy ORM for Ledgers, Transactions, and Loans.
"""

from sqlalchemy import create_engine, Column, String, Float, Integer, ForeignKey, Text
from sqlalchemy.orm import DeclarativeBase, sessionmaker, relationship

import config

engine = create_engine(
    config.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in config.DATABASE_URL else {}
)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


class Base(DeclarativeBase):
    pass


class LedgerRecord(Base):
    """Stores uploaded financial ledgers."""
    __tablename__ = "ledgers"

    id = Column(String, primary_key=True, index=True)
    merchant_name = Column(String, nullable=False)
    business_type = Column(String, default="General Merchant")
    location = Column(String, default="Local Market")
    period = Column(String, default="Recent")
    currency = Column(String, default="INR")
    total_inflow = Column(Float, default=0.0)
    total_outflow = Column(Float, default=0.0)
    net_balance = Column(Float, default=0.0)
    total_transactions = Column(Integer, default=0)
    active_days = Column(Integer, default=0)
    verascore = Column(Integer, default=300)
    risk_level = Column(String, default="Moderate Risk")

    # Relationship to transactions
    transactions = relationship("TransactionRecord", back_populates="ledger", cascade="all, delete-orphan")


class TransactionRecord(Base):
    """Stores individual digitized transactions from a ledger."""
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, index=True)
    ledger_id = Column(String, ForeignKey("ledgers.id"), nullable=False, index=True)
    date = Column(String, nullable=False)
    customer_name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # 'jama' or 'udhar'
    amount = Column(Float, nullable=False)
    balance = Column(Float, nullable=True)
    category = Column(String, default="sales")
    note = Column(String, default="")

    ledger = relationship("LedgerRecord", back_populates="transactions")


class LoanApplication(Base):
    """Stores microloan applications submitted by borrowers or created from ledgers."""
    __tablename__ = "loans"

    id = Column(String, primary_key=True, index=True)
    merchant_name = Column(String, nullable=False)
    business_type = Column(String, default="Retail")
    location = Column(String, default="India")
    requested_amount = Column(Float, default=25000.0)
    approved_amount = Column(Float, nullable=True)
    verascore = Column(Integer, default=300)
    risk_level = Column(String, default="Moderate Risk")
    monthly_turnover = Column(Float, default=0.0)
    status = Column(String, default="pending")  # 'pending', 'approved', 'rejected'
    applied_at = Column(String, default="Just now")
    ledger_id = Column(String, nullable=True)


def get_db():
    """FastAPI dependency for yielding database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initializes SQLite database tables and seeds demo lender data if empty."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(LoanApplication).count() == 0:
            demo_loans = [
                LoanApplication(
                    id="loan_101",
                    merchant_name="Sharma Ji Kirana Store",
                    business_type="Grocery & Essentials",
                    location="Lucknow, UP",
                    requested_amount=25000.0,
                    approved_amount=25000.0,
                    verascore=745,
                    risk_level="Low Risk",
                    monthly_turnover=42500.0,
                    status="pending",
                    applied_at="2 hours ago",
                    ledger_id="ledg_demo_101"
                ),
                LoanApplication(
                    id="loan_102",
                    merchant_name="Raju Chai & Snacks Corner",
                    business_type="Tea & Street Food",
                    location="Kanpur, UP",
                    requested_amount=15000.0,
                    approved_amount=15000.0,
                    verascore=685,
                    risk_level="Moderate Risk",
                    monthly_turnover=26800.0,
                    status="pending",
                    applied_at="5 hours ago",
                    ledger_id="ledg_demo_102"
                ),
                LoanApplication(
                    id="loan_103",
                    merchant_name="Verma Dairy & Sweets",
                    business_type="Dairy Farm",
                    location="Varanasi, UP",
                    requested_amount=35000.0,
                    approved_amount=None,
                    verascore=590,
                    risk_level="High Risk",
                    monthly_turnover=19000.0,
                    status="rejected",
                    applied_at="1 day ago",
                    ledger_id="ledg_demo_103"
                )
            ]
            db.add_all(demo_loans)
            db.commit()
    finally:
        db.close()
