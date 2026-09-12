"""
SQLAlchemy Database Models for VeraFi
-------------------------------------
Defines tables for Ledgers, Transactions, and Loan Applications.
"""

from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base


class Ledger(Base):
    __tablename__ = "ledgers"

    id = Column(String, primary_key=True, index=True)
    merchant_name = Column(String, nullable=False)
    business_type = Column(String, default="Retail & Daily Needs")
    location = Column(String, default="Lucknow, UP")
    period = Column(String, default="Recent")
    currency = Column(String, default="INR")
    total_inflow = Column(Float, default=0.0)
    total_outflow = Column(Float, default=0.0)
    net_balance = Column(Float, default=0.0)
    total_transactions = Column(Integer, default=0)
    active_days = Column(Integer, default=0)
    verascore = Column(Integer, default=300)
    risk_level = Column(String, default="Moderate Risk")
    created_at = Column(DateTime, default=datetime.utcnow)

    transactions = relationship("Transaction", back_populates="ledger", cascade="all, delete-orphan")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, index=True)
    ledger_id = Column(String, ForeignKey("ledgers.id"), nullable=False, index=True)
    date = Column(String, nullable=False)
    customer_name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # "jama" or "udhar"
    amount = Column(Float, nullable=False)
    balance = Column(Float, nullable=True)
    category = Column(String, default="general")
    note = Column(Text, default="")

    ledger = relationship("Ledger", back_populates="transactions")


class Loan(Base):
    __tablename__ = "loans"

    id = Column(String, primary_key=True, index=True)
    merchant_name = Column(String, nullable=False)
    business_type = Column(String, default="Retail & Daily Needs")
    location = Column(String, default="Lucknow, UP")
    requested_amount = Column(Float, nullable=False)
    approved_amount = Column(Float, nullable=True)
    verascore = Column(Integer, nullable=False)
    risk_level = Column(String, nullable=False)
    monthly_turnover = Column(Float, default=0.0)
    status = Column(String, default="pending")  # "pending", "approved", "rejected"
    interest_rate_monthly = Column(Float, default=1.2)
    tenure_months = Column(Integer, default=3)
    applied_at = Column(String, default="Just now")
    ledger_id = Column(String, nullable=True)
