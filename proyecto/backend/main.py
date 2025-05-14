from fastapi import FastAPI, HTTPException
from pydantic import BaseModel


app = FastAPI()
@app.get("/")
def read_root():
    return {"message": "¡Hola desde FastAPI en Docker!"}


