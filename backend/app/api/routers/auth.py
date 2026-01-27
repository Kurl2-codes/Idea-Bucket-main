from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.db.mongodb import get_database
from app.core.security import verify_password, create_access_token, get_password_hash
from pydantic import BaseModel
from datetime import timedelta

router = APIRouter()

class UserCreate(BaseModel):
    email: str
    password: str
    name: str
    department: str
    userLevel: int = 2 # 1=Admin, 2=User


class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

@router.post("/register", response_model=Token)
async def register(user: UserCreate):
    try:
        db = await get_database()
        if db is None:
             raise HTTPException(status_code=500, detail="Database connection not initialized")
             
        existing_user = await db.users.find_one({"email": user.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        hashed_password = get_password_hash(user.password)
        new_user = {
            "email": user.email,
            "hashed_password": hashed_password,
            "name": user.name,
            "department": user.department,
            "userLevel": user.userLevel,
            "id": user.email # Simple ID for now
        }

        
        await db.users.insert_one(new_user)
        
        access_token = create_access_token(data={"sub": user.email})
        return {
            "access_token": access_token, 
            "token_type": "bearer", 
            "user": {
                "id": new_user["id"], 
                "name": new_user["name"], 
                "department": new_user["department"],
                "userLevel": new_user["userLevel"]
            }
        }

    except Exception as e:
        print(f"Register Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    db = await get_database()
    user = await db.users.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user["email"]})
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user": {
            "id": user["id"], 
            "name": user["name"], 
            "department": user["department"],
            "userLevel": user.get("userLevel", 2)
        }
    }


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    # Simple decoding for now - real app should verify signature properly with jose
    # But since we use same secret, we can reuse logic or just trust for this prototype if verified elsewhere
    # Proper way:
    from jose import jwt, JWTError
    from app.core.config import settings
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
        
    db = await get_database()
    user = await db.users.find_one({"email": email})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
        
    return user

@router.get("/users")
async def list_users(current_user: dict = Depends(get_current_user)):
    if current_user.get("userLevel") != 1:
        raise HTTPException(status_code=403, detail="Not authorized. Admin only.")
    
    db = await get_database()
    cursor = db.users.find()
    users = await cursor.to_list(length=100)
    
    # Sanitize: remove hashed_password
    sanitized_users = []
    for u in users:
        sanitized_users.append({
            "id": u["id"],
            "name": u["name"],
            "email": u["email"],
            "department": u["department"],
            "userLevel": u.get("userLevel", 2)
        })
    return sanitized_users

@router.patch("/users/{user_id}/level")
async def update_user_level(user_id: str, level: int, current_user: dict = Depends(get_current_user)):
    if current_user.get("userLevel") != 1:
        raise HTTPException(status_code=403, detail="Not authorized. Admin only.")
    
    db = await get_database()
    result = await db.users.update_one({"id": user_id}, {"$set": {"userLevel": level}})
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
        
    return {"status": "success", "userLevel": level}

@router.delete("/users/{user_id}")
async def delete_user(user_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("userLevel") != 1:
        raise HTTPException(status_code=403, detail="Not authorized. Admin only.")
    
    db = await get_database()
    result = await db.users.delete_one({"id": user_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
        
    return {"status": "success"}

class UserUpdate(BaseModel):
    name: str | None = None
    email: str | None = None
    department: str | None = None
    password: str | None = None

@router.patch("/users/{user_id}")
async def update_user_details(user_id: str, user_update: UserUpdate, current_user: dict = Depends(get_current_user)):
    if current_user.get("userLevel") != 1:
        raise HTTPException(status_code=403, detail="Not authorized. Admin only.")
    
    db = await get_database()
    update_data = {k: v for k, v in user_update.dict().items() if v is not None}
    
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
        
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    # If email is being updated, check for uniqueness
    if "email" in update_data:
        existing = await db.users.find_one({"email": update_data["email"]})
        if existing and existing["id"] != user_id:
             raise HTTPException(status_code=400, detail="Email already in use")

    result = await db.users.update_one({"id": user_id}, {"$set": update_data})
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
        
    return {"status": "success", "updated_fields": list(update_data.keys())}


