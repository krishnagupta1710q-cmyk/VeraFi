from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from config import DATABASE_URL

# SQLite requires "check_same_thread": False in multithreaded environments like FastAPI.
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

# Create the database engine using the configured URL
engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args
)

# Factory for creating database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class that future database models will inherit from
Base = declarative_base()


def get_db():
    """Dependency that yields a database session per request and closes it when done."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
