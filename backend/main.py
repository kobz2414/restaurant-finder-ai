from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class UserInput(BaseModel):
    message: str


@app.post("/api/execute")
def fetch_data(user_input: UserInput):
    pass
