from fastapi import FastAPI

app = FastAPI()


@app.post("/api/execute")
def fetch_data():
    pass
