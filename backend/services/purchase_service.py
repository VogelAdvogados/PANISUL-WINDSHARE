from fastapi import HTTPException, UploadFile, File
from typing import List, Optional
from models.purchase import Supplier, Purchase, PurchaseItem
from datetime import datetime
from sqlalchemy.orm import Session
from xml.etree import ElementTree as ET
import pdfplumber
import re

class PurchaseService:
    def __init__(self, db: Session):
        self.db = db

    def get_purchases(self, skip: int = 0, limit: int = 100):
        return self.db.query(Purchase).offset(skip).limit(limit).all()

    def get_purchase(self, purchase_id: int):
        return self.db.query(Purchase).filter(Purchase.id == purchase_id).first()

    def create_purchase(self, purchase_data):
        purchase = Purchase(**purchase_data)
        self.db.add(purchase)
        self.db.commit()
        self.db.refresh(purchase)
        return purchase

    def create_supplier(self, supplier_data):
        supplier = Supplier(**supplier_data)
        self.db.add(supplier)
        self.db.commit()
        self.db.refresh(supplier)
        return supplier

    def import_purchase_document(self, file: UploadFile):
        if file.content_type == 'application/xml':
            return self._process_xml(file)
        elif file.content_type == 'application/pdf':
            return self._process_pdf(file)
        else:
            raise HTTPException(status_code=400, detail="Tipo de arquivo não suportado")

    def _process_xml(self, file):
        try:
            # Parse XML content
            xml_content = file.file.read()
            root = ET.fromstring(xml_content)

            # Extract supplier information
            supplier_data = {
                'name': root.find('.//{http://www.portalfiscal.inf.br/nfe}xNome').text,
                'cnpj': root.find('.//{http://www.portalfiscal.inf.br/nfe}CNPJ').text,
                'address': root.find('.//{http://www.portalfiscal.inf.br/nfe}xLgr').text,
                'phone': root.find('.//{http://www.portalfiscal.inf.br/nfe}fone').text,
            }

            # Extract purchase information
            purchase_data = {
                'document_type': 'xml',
                'document_number': root.find('.//{http://www.portalfiscal.inf.br/nfe}nNF').text,
                'total_value': float(root.find('.//{http://www.portalfiscal.inf.br/nfe}vNF').text),
                'status': 'pending'
            }

            # Extract items
            items = []
            for item in root.findall('.//{http://www.portalfiscal.inf.br/nfe}det'):
                item_data = {
                    'product_code': item.find('.//{http://www.portalfiscal.inf.br/nfe}cProd').text,
                    'product_name': item.find('.//{http://www.portalfiscal.inf.br/nfe}xProd').text,
                    'quantity': float(item.find('.//{http://www.portalfiscal.inf.br/nfe}qCom').text),
                    'unit': item.find('.//{http://www.portalfiscal.inf.br/nfe}uCom').text,
                    'unit_price': float(item.find('.//{http://www.portalfiscal.inf.br/nfe}vUnCom').text),
                    'total_price': float(item.find('.//{http://www.portalfiscal.inf.br/nfe}vProd').text)
                }
                items.append(item_data)

            return {
                'supplier': supplier_data,
                'purchase': purchase_data,
                'items': items
            }

        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Erro ao processar XML: {str(e)}")

    def _process_pdf(self, file):
        try:
            # Process PDF using pdfplumber
            with pdfplumber.open(file.file) as pdf:
                text = ""
                for page in pdf.pages:
                    text += page.extract_text()

            # Extract information using regex patterns
            supplier_data = self._extract_supplier_info(text)
            purchase_data = self._extract_purchase_info(text)
            items = self._extract_items(text)

            return {
                'supplier': supplier_data,
                'purchase': purchase_data,
                'items': items
            }

        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Erro ao processar PDF: {str(e)}")

    def _extract_supplier_info(self, text: str):
        # Implement regex patterns to extract supplier info
        # This is a simplified example - in production you would need more robust patterns
        supplier_pattern = r"Fornecedor:\s*(.*?)\n.*?CNPJ:\s*(\d{14})"
        match = re.search(supplier_pattern, text)
        if match:
            return {
                'name': match.group(1),
                'cnpj': match.group(2)
            }
        return {}

    def _extract_purchase_info(self, text: str):
        # Implement regex patterns to extract purchase info
        return {}

    def _extract_items(self, text: str):
        # Implement regex patterns to extract items
        return []
