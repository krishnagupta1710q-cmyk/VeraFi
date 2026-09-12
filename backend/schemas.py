"""
VeraFi Data Validation Schemas (Pydantic Models)
-----------------------------------------------
Defines request and response schemas matching the API specification.
"""

from typing import List, Optional, Literal
from pydantic import BaseModel, Field


class TransactionSchema(BaseModel):
    id: str = Field(..., description="Unique transaction ID (e.g. tx_1)")
    date: str = Field(..., description="Date formatted as YYYY-MM-DD")
    customer_name: str = Field(..., description="Customer or supplier name")
    type: Literal["jama", "udhar"] = Field(
        ...,
        description="'jama' = credit/inflow/received, 'udhar' = debit/outflow/credit extended"
    )
    amount: float = Field(..., ge=0, description="Amount in INR")
    balance: Optional[float] = Field(None, description="Recorded running balance")
    category: Optional[str] = Field("general", description="Category: sales, inventory, etc.")
    note: Optional[str] = Field("", description="Remarks or items purchased")


class LedgerSummarySchema(BaseModel):
    total_inflow: float = Field(..., ge=0, description="Sum of Jama amounts")
    total_outflow: float = Field(..., ge=0, description="Sum of Udhar amounts")
    net_balance: float = Field(..., description="Inflow minus Outflow")
    total_transactions: int = Field(..., ge=0)
    active_days: int = Field(..., ge=0)


class VeraScoreFactorsSchema(BaseModel):
    volume_score: int = Field(..., ge=0, le=100)
    consistency_score: int = Field(..., ge=0, le=100)
    diversity_score: int = Field(..., ge=0, le=100)
    cadence_score: int = Field(..., ge=0, le=100)


class VeraScoreResultSchema(BaseModel):
    score: int = Field(..., ge=300, le=850, description="Score from 300 to 850")
    grade: str = Field(..., description="Credit grade: A, B+, B, C")
    risk_level: str = Field(..., description="Low Risk, Moderate Risk, High Risk")
    max_eligible_loan: int = Field(..., ge=0, description="Max recommended loan in INR")
    factors: VeraScoreFactorsSchema
    recommendation: str
    flags: List[str] = Field(default_factory=list, description="Warning flags or math discrepancies")


class LedgerResponse(BaseModel):
    ledger_id: str
    merchant_name: str
    period: str
    currency: str = "INR"
    summary: LedgerSummarySchema
    transactions: List[TransactionSchema]
    verascore: VeraScoreResultSchema


class CalculateScoreRequest(BaseModel):
    transactions: List[TransactionSchema]
    requested_amount: Optional[float] = 25000.0


class LoanApplicationSchema(BaseModel):
    id: str
    merchant_name: str
    business_type: str
    location: str
    requested_amount: float
    verascore: int
    risk_level: str
    monthly_turnover: float
    status: Literal["pending", "approved", "rejected"] = "pending"
    applied_at: str
    ledger_id: Optional[str] = None


class LoanActionRequest(BaseModel):
    action: Literal["approve", "reject"]
    approved_amount: Optional[float] = 25000.0
    interest_rate_monthly: Optional[float] = 1.2
    tenure_months: Optional[int] = 3


class LoanActionResponse(BaseModel):
    success: bool
    loan_id: str
    status: str
    message: str
