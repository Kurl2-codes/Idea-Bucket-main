from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

import hashlib

def verify_password(plain_password, hashed_password):
    # Pre-hash to handle long passwords (bcrypt limit 72 chars)
    # SHA256 produces 64 hex chars, which fits safely within 72 bounds
    hashed_plain = hashlib.sha256(plain_password.encode('utf-8')).hexdigest()
    return pwd_context.verify(hashed_plain, hashed_password)

def get_password_hash(password):
    hashed = hashlib.sha256(password.encode('utf-8')).hexdigest()
    return pwd_context.hash(hashed)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
