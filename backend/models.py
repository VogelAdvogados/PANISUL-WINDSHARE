from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String)
    price = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship with ProductionBatch
    production_batches = relationship("ProductionBatch", back_populates="product")
    # Relationship with Sale
    sales = relationship("Sale", back_populates="product")

class RawMaterial(Base):
    __tablename__ = "raw_materials"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    unit = Column(String)  # kg, g, l, ml
    quantity = Column(Float)
    minimum_quantity = Column(Float)
    last_purchase_price = Column(Float)
    last_purchase_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship with ProductionBatch
    production_batches = relationship("ProductionBatch", back_populates="raw_material")

class ProductionBatch(Base):
    __tablename__ = "production_batches"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    raw_material_id = Column(Integer, ForeignKey("raw_materials.id"))
    quantity = Column(Float)
    losses = Column(Float)
    production_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String)  # completed, failed, in_progress
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    product = relationship("Product", back_populates="production_batches")
    raw_material = relationship("RawMaterial", back_populates="production_batches")

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    phone = Column(String)
    email = Column(String)
    address = Column(String)
    total_purchases = Column(Float, default=0)
    total_returns = Column(Float, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    sales = relationship("Sale", back_populates="client")
    credits = relationship("Credit", back_populates="client")
    history = relationship("ClientHistory", back_populates="client")

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=True)
    quantity = Column(Float)
    payment_type = Column(String)  # cash, credit
    payment_date = Column(DateTime)
    sale_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String)  # completed, returned
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    product = relationship("Product", back_populates="sales")
    client = relationship("Client", back_populates="sales")
    credit = relationship("Credit", back_populates="sale", uselist=False)

class Credit(Base):
    __tablename__ = "credits"

    id = Column(Integer, primary_key=True, index=True)
    sale_id = Column(Integer, ForeignKey("sales.id"))
    client_id = Column(Integer, ForeignKey("clients.id"))
    amount = Column(Float)
    due_date = Column(DateTime)
    status = Column(String)  # pending, approved, rejected
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    sale = relationship("Sale", back_populates="credit")
    client = relationship("Client", back_populates="credits")

class ClientHistory(Base):
    __tablename__ = "client_history"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    event_type = Column(String)  # purchase, return, credit
    description = Column(String)
    amount = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    client = relationship("Client", back_populates="history")
