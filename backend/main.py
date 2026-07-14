import os
from fastapi import FastAPI, HTTPException, responses
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

LICHESS_TOKEN = os.getenv("LICHESS_TOKEN")

API_BASE_URL = "https://lichess.org"

@app.get("/api/openings/masters")
def get_masters_openings():
    if not LICHESS_TOKEN:
        raise HTTPException(status_code=500, detail="No Lichess token on the backend")

    url = API_BASE_URL + "/masters"
    headers = {"Accept": "application/json", "Authorization": f"Bearer {LICHESS_TOKEN}"}

    try:
        response = requests.get(url=url, headers=headers)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

"""
Returns a list of 5 moves with the best evaluation.

Args:
    fen (str): FEN notation of the current position.
"""
@app.get("/api/openings/position")
def get_moves_from_position():
    if not LICHESS_TOKEN:
        raise HTTPException(status_code=500, detail="No Lichess token on the backend")

    # I need to somehow pass the current position and put it as a param
    url = API_BASE_URL + "/lichess?variant=standard&moves=5"
    headers = {"Accept": "application/json", "Authorization": f"Bearer {LICHESS_TOKEN}"}

    try:
        response = requests.get(url=url, headers=headers)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class PositionRequest(BaseModel):
    fen: str

"""
Returns cloud evaluation of the current position

Args:
    fen (str): FEN notation of the current position.
"""
@app.post("/api/position/evaluation")
def evaluate_position(position: PositionRequest):
    if not LICHESS_TOKEN:
        raise HTTPException(status_code=500, detail="No Lichess token on the backend")

    fen = position.fen
    url = API_BASE_URL + "/api/cloud-eval"
    headers = {"Accept": "application/json"}

    try:
        response = requests.get(url=url, params={"fen": fen}, headers=headers)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    





if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
