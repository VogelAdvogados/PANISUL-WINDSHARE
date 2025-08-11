from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from . import models
from .database import engine, get_db
from pydantic import BaseModel

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="BreadCraft Manager API")

# Product Models
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Raw Material Models
class RawMaterialBase(BaseModel):
    name: str
    unit: str
    quantity: float
    minimum_quantity: float
    last_purchase_price: float
    last_purchase_date: Optional[datetime] = None

class RawMaterialCreate(RawMaterialBase):
    pass

class RawMaterial(RawMaterialBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Production Batch Models
class ProductionBatchBase(BaseModel):
    product_id: int
    raw_material_id: int
    quantity: float
    losses: float
    status: str

class ProductionBatchCreate(ProductionBatchBase):
    pass

class ProductionBatch(ProductionBatchBase):
    id: int
    production_date: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Client Models
class ClientBase(BaseModel):
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class Client(ClientBase):
    id: int
    total_purchases: float
    total_returns: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Sale Models
class SaleBase(BaseModel):
    product_id: int
    client_id: Optional[int] = None
    quantity: float
    payment_type: str
    payment_date: datetime
    status: str

class SaleCreate(SaleBase):
    pass

class Sale(SaleBase):
    id: int
    sale_date: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Routes
@app.post("/products/", response_model=Product)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.get("/products/", response_model=List[Product])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    products = db.query(models.Product).offset(skip).limit(limit).all()
    return products

@app.get("/products/{product_id}", response_model=Product)
def read_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.post("/raw-materials/", response_model=RawMaterial)
def create_raw_material(material: RawMaterialCreate, db: Session = Depends(get_db)):
    db_material = models.RawMaterial(**material.model_dump())
    db.add(db_material)
    db.commit()
    db.refresh(db_material)
    return db_material

@app.post("/production-batches/", response_model=ProductionBatch)
def create_production_batch(batch: ProductionBatchCreate, db: Session = Depends(get_db)):
    db_batch = models.ProductionBatch(**batch.model_dump())
    db.add(db_batch)
    db.commit()
    db.refresh(db_batch)
    return db_batch

@app.post("/clients/", response_model=Client)
def create_client(client: ClientCreate, db: Session = Depends(get_db)):
    db_client = models.Client(**client.model_dump())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

@app.post("/sales/", response_model=Sale)
def create_sale(sale: SaleCreate, db: Session = Depends(get_db)):
    db_sale = models.Sale(**sale.model_dump())
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    return db_sale

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
