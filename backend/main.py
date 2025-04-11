import requests
import os

from openai import OpenAI
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from urllib.parse import urlencode

from utils.common import extract_json_from_markdown

from models.page import PageLinkInput
from models.user import UserInput

app = FastAPI()

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/execute")
def fetch_data(user_input: UserInput):
    prompt = f"""
        You are a helpful assistant that converts user input into a JSON command.
        The user primarily wants to search for a specific type of business or service.
        Your task is to convert this user input into a structured JSON command.

        The JSON command should contain the following fields:
        - action: A string representing the action to be performed.
        - parameters: A dictionary containing the following keys:
            - query: A string representing the user's search query category only and no other description.
            - near: The location or context for the search, if applicable.
            - max_price: A string representing the maximum price range for the search. Valid values range between 1 (most affordable) to 4 (most expensive), inclusive.
            - min_price: A string representing the minimum price range for the search. Valid values range between 1 (most affordable) to 4 (most expensive), inclusive.
            - open_now: A boolean indicating whether to filter results by open status.

        Your task is to convert the user input strictly into this JSON format.
        You should not include any additional text or explanation in your response.

        Here is the user's input:
        "{user_input.message}"
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini-search-preview",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that outputs JSON.",
                },
                {"role": "user", "content": prompt},
            ],
            web_search_options={},
            max_tokens=150,
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"User search analysis failed: {str(e)}"
        )

    try:
        response_data = response.choices[0].message.content.strip()
        cleaned_response = extract_json_from_markdown(response_data)

        if "parameters" not in cleaned_response:
            raise HTTPException(
                status_code=400,
                detail="Missing search parameters after user search analysis",
            )

        filtered_params = {
            key: value
            for key, value in cleaned_response["parameters"].items()
            if value is not None and value != ""
        }
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Failed to parse user search JSON: {str(e)}"
        )

    try:
        query_string = urlencode(filtered_params)
        base_url = "https://api.foursquare.com/v3/places/search"
        full_url = f"{base_url}?{query_string}"

        headers = {
            "Accept": "application/json",
            "Authorization": os.getenv("FOURSQUARE_API_KEY"),
        }

        response = requests.get(full_url, headers=headers)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search request failed: {str(e)}")

    if response.status_code == 200:
        return response.json()
    else:
        raise HTTPException(
            status_code=response.status_code,
            detail=f"Search response error: {response.json().get('message', 'Unknown error')}",
        )
