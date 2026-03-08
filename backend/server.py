from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ============ Models ============

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    service: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    service: Optional[str] = None
    message: str

class PortfolioItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    category: str  # systems, experience, academy
    description: str
    image_url: Optional[str] = None
    tags: List[str] = []
    featured: bool = False
    order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PortfolioItemCreate(BaseModel):
    title: str
    category: str
    description: str
    image_url: Optional[str] = None
    tags: List[str] = []
    featured: bool = False
    order: int = 0

# ============ Routes ============

@api_router.get("/")
async def root():
    return {"message": "ATARAXIA TECH LAB API", "status": "active"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

# Contact Routes
@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(input: ContactMessageCreate):
    contact_dict = input.model_dump()
    contact_obj = ContactMessage(**contact_dict)
    
    doc = contact_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.contact_messages.insert_one(doc)
    return contact_obj

@api_router.get("/contact", response_model=List[ContactMessage])
async def get_contact_messages():
    messages = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    for msg in messages:
        if isinstance(msg['created_at'], str):
            msg['created_at'] = datetime.fromisoformat(msg['created_at'])
    
    return messages

# Portfolio Routes
@api_router.post("/portfolio", response_model=PortfolioItem)
async def create_portfolio_item(input: PortfolioItemCreate):
    portfolio_dict = input.model_dump()
    portfolio_obj = PortfolioItem(**portfolio_dict)
    
    doc = portfolio_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.portfolio_items.insert_one(doc)
    return portfolio_obj

@api_router.get("/portfolio", response_model=List[PortfolioItem])
async def get_portfolio_items(category: Optional[str] = None, featured: Optional[bool] = None):
    query = {}
    if category:
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    
    items = await db.portfolio_items.find(query, {"_id": 0}).sort("order", 1).to_list(100)
    
    for item in items:
        if isinstance(item['created_at'], str):
            item['created_at'] = datetime.fromisoformat(item['created_at'])
    
    return items

@api_router.get("/portfolio/{item_id}", response_model=PortfolioItem)
async def get_portfolio_item(item_id: str):
    item = await db.portfolio_items.find_one({"id": item_id}, {"_id": 0})
    
    if not item:
        raise HTTPException(status_code=404, detail="Portfolio item not found")
    
    if isinstance(item['created_at'], str):
        item['created_at'] = datetime.fromisoformat(item['created_at'])
    
    return item

@api_router.delete("/portfolio/{item_id}")
async def delete_portfolio_item(item_id: str):
    result = await db.portfolio_items.delete_one({"id": item_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Portfolio item not found")
    
    return {"message": "Portfolio item deleted successfully"}

# Services data endpoint
@api_router.get("/services")
async def get_services():
    return {
        "divisions": [
            {
                "id": "systems",
                "name": "ATARAXIA SYSTEMS",
                "tagline": "Precision. Structure. Results.",
                "description": "Soluciones técnicas y digitales con enfoque en eficiencia y resultados medibles.",
                "services": [
                    "Soporte IT y reparación",
                    "Diseño gráfico y montaje",
                    "Optimización de procesos",
                    "Branding y desarrollo conceptual"
                ],
                "icon": "cpu"
            },
            {
                "id": "experience",
                "name": "ATARAXIA EXPERIENCE",
                "tagline": "Sensation. Emotion. Memory.",
                "description": "Experiencias sensoriales que generan impacto emocional y rentabilidad.",
                "services": [
                    "Mixología conceptual",
                    "Diseño de conceptos gastronómicos",
                    "Activaciones sensoriales",
                    "Desarrollo de marcas para bares/restaurantes"
                ],
                "icon": "flask"
            },
            {
                "id": "academy",
                "name": "ATARAXIA ACADEMY",
                "tagline": "Knowledge. Growth. Mastery.",
                "description": "Transferencia real de conocimiento para el desarrollo profesional.",
                "services": [
                    "Cursos técnicos especializados",
                    "Formación en mixología y gastronomía",
                    "Capacitación profesional",
                    "Mentorías estratégicas"
                ],
                "icon": "graduation"
            }
        ]
    }

# Include the router
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
