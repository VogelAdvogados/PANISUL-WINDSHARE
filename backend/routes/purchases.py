from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from services.purchase_service import PurchaseService
from database import get_db

router = APIRouter()

@router.get("/")
async def get_purchases(db: Session = Depends(get_db)):
    service = PurchaseService(db)
    return service.get_purchases()

@router.get("/{purchase_id}")
async def get_purchase(purchase_id: int, db: Session = Depends(get_db)):
    service = PurchaseService(db)
    purchase = service.get_purchase(purchase_id)
    if purchase is None:
        raise HTTPException(status_code=404, detail="Compra não encontrada")
    return purchase

@router.post("/")
async def create_purchase(purchase_data: dict, db: Session = Depends(get_db)):
    service = PurchaseService(db)
    return service.create_purchase(purchase_data)

@router.post("/suppliers")
async def create_supplier(supplier_data: dict, db: Session = Depends(get_db)):
    service = PurchaseService(db)
    return service.create_supplier(supplier_data)

@router.post("/import")
async def import_purchase_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    service = PurchaseService(db)
    return service.import_purchase_document(file)
