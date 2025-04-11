import os

from openai import OpenAI
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class UserInput(BaseModel):
    message: str


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
        return response
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"User search analysis failed: {str(e)}"
        )
