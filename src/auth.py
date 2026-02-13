"""
Authentication module for Resume.ai backend.
Uses SQLite for user storage and JWT for token-based auth.
"""

import os
import sqlite3
from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from jose import jwt, JWTError
from passlib.context import CryptContext

# ==================== CONFIG ====================
DATABASE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "users.db")
SECRET_KEY = os.getenv("JWT_SECRET", "resume-ai-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Passlib Context
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

# ==================== DATABASE ====================
def get_db():
    """Get a database connection, creating the table if needed."""
    os.makedirs(os.path.dirname(DATABASE_PATH), exist_ok=True)
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            hashed_password TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
    """)
    conn.commit()
    return conn

# ==================== HELPERS ====================
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# ==================== AUTH DEPENDENCY ====================
def get_current_user(authorization: str = Header(None)):
    """FastAPI dependency to extract current user from Authorization header."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Support "Bearer <token>" format
    token = authorization.replace("Bearer ", "").strip()
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        user_id: int = payload.get("id")
        if email is None or user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        return {"user_id": user_id, "email": email}
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

# ==================== MODELS ====================
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

# ==================== ENDPOINTS ====================
@router.post("/register")
def register(req: RegisterRequest):
    """Register a new user."""
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    
    conn = get_db()
    try:
        # Check if email exists
        existing = conn.execute("SELECT id FROM users WHERE email = ?", (req.email,)).fetchone()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create user
        hashed_password = get_password_hash(req.password)
        cursor = conn.execute(
            "INSERT INTO users (name, email, hashed_password) VALUES (?, ?, ?)",
            (req.name, req.email, hashed_password)
        )
        conn.commit()
        user_id = cursor.lastrowid
        
        # Generate token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": req.email, "id": user_id}, expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "name": req.name,
                "email": req.email
            }
        }
    finally:
        conn.close()

@router.post("/login")
def login(req: LoginRequest):
    """Authenticate a user and return a token."""
    conn = get_db()
    try:
        user = conn.execute(
            "SELECT id, name, email, hashed_password FROM users WHERE email = ?",
            (req.email,)
        ).fetchone()
        
        if not user or not verify_password(req.password, user["hashed_password"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user["email"], "id": user["id"]}, expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"]
            }
        }
    finally:
        conn.close()

@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    """Get current authenticated user info."""
    conn = get_db()
    try:
        user = conn.execute(
            "SELECT id, name, email, created_at FROM users WHERE id = ?",
            (current_user["user_id"],)
        ).fetchone()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "created_at": user["created_at"]
        }
    finally:
        conn.close()
