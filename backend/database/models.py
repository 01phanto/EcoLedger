"""
Database Models for EcoLedger Platform
"""
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import json

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)  # 'NGO', 'ADMIN', 'COMPANY'
    organization_name = Column(String(200), nullable=True)
    wallet_address = Column(String(42), nullable=True)  # Ethereum address
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    projects = relationship("Project", back_populates="user")
    transactions = relationship("Transaction", back_populates="user")

class Project(Base):
    __tablename__ = 'projects'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(String(50), unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    ngo_name = Column(String(200), nullable=False)
    project_name = Column(String(200), nullable=False)
    location = Column(String(200), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    description = Column(Text, nullable=False)
    trees_planted = Column(Integer, nullable=False)
    area_hectares = Column(Float, nullable=False)
    
    # File paths
    ground_images = Column(Text, nullable=True)  # JSON array of file paths
    satellite_images = Column(Text, nullable=True)  # JSON array of file paths
    iot_data_file = Column(String(500), nullable=True)
    
    # AI Verification Results
    yolo_tree_count = Column(Integer, nullable=True)
    yolo_confidence = Column(Float, nullable=True)
    ndvi_score = Column(Float, nullable=True)
    iot_score = Column(Float, nullable=True)
    co2_absorbed = Column(Float, nullable=True)
    final_verification_score = Column(Float, nullable=True)
    
    # Status and Timestamps
    status = Column(String(50), default='PENDING')  # PENDING, UNDER_REVIEW, VERIFIED, REJECTED
    submitted_at = Column(DateTime, default=datetime.utcnow)
    reviewed_at = Column(DateTime, nullable=True)
    verified_at = Column(DateTime, nullable=True)
    
    # Blockchain Integration
    blockchain_tx_hash = Column(String(66), nullable=True)
    carbon_credits_issued = Column(Float, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="projects")
    verification_logs = relationship("VerificationLog", back_populates="project")
    carbon_credits = relationship("CarbonCredit", back_populates="project")

class VerificationLog(Base):
    __tablename__ = 'verification_logs'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey('projects.id'), nullable=False)
    verification_type = Column(String(50), nullable=False)  # 'YOLO', 'NDVI', 'IOT', 'ADMIN'
    result_data = Column(Text, nullable=False)  # JSON result
    confidence_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    project = relationship("Project", back_populates="verification_logs")

class CarbonCredit(Base):
    __tablename__ = 'carbon_credits'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    credit_id = Column(String(50), unique=True, nullable=False)
    project_id = Column(Integer, ForeignKey('projects.id'), nullable=False)
    total_credits = Column(Float, nullable=False)
    available_credits = Column(Float, nullable=False)
    price_per_credit = Column(Float, nullable=False)
    vintage_year = Column(Integer, nullable=False)
    verification_standard = Column(String(50), nullable=False)
    
    # Blockchain
    blockchain_token_id = Column(String(100), nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    project = relationship("Project", back_populates="carbon_credits")
    transactions = relationship("Transaction", back_populates="carbon_credit")

class Transaction(Base):
    __tablename__ = 'transactions'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    transaction_id = Column(String(50), unique=True, nullable=False)
    carbon_credit_id = Column(Integer, ForeignKey('carbon_credits.id'), nullable=False)
    buyer_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    seller_id = Column(Integer, nullable=False)  # NGO user ID
    
    quantity = Column(Float, nullable=False)
    price_per_credit = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)
    
    # Blockchain
    blockchain_tx_hash = Column(String(66), nullable=False)
    
    # Status
    status = Column(String(20), default='PENDING')  # PENDING, COMPLETED, FAILED
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    carbon_credit = relationship("CarbonCredit", back_populates="transactions")
    user = relationship("User", back_populates="transactions")

class SystemLog(Base):
    __tablename__ = 'system_logs'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    log_type = Column(String(50), nullable=False)  # 'AI_PROCESSING', 'BLOCKCHAIN', 'USER_ACTION'
    message = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    project_id = Column(Integer, ForeignKey('projects.id'), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# Database configuration
DATABASE_URL = "sqlite:///ecoledger.db"  # Use PostgreSQL in production

# Create engine and session
engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)

def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Helper functions for JSON fields
def set_json_field(obj, field_name, data):
    """Set JSON field"""
    setattr(obj, field_name, json.dumps(data) if data else None)

def get_json_field(obj, field_name):
    """Get JSON field"""
    value = getattr(obj, field_name)
    return json.loads(value) if value else None