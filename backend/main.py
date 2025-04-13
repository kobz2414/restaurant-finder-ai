import requests
import os
import logging

from openai import OpenAI
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from urllib.parse import urlencode

from utils.common import extract_json_from_markdown

from models.page import PageLinkInput
from models.user import UserInput

app = FastAPI()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
        You are a helpful assistant that analyze and converts user input into a JSON command.

        The user primarily wants to search for a specific type of business or service.
        Some examples but not limited to are: 
            "Find me a coffee shop in New York City" 
            "Where can I get sushi in Tokyo that's affordable?"
            "Find me a cheap sushi restaurant in downtown Los Angeles that's open now and has at least a 4-star rating."

        Your task is to strictly convert this user input into a structured JSON command and nothing else.
        You should not include any additional text or explanation in your response.

        The JSON command should contain the following fields: 
        - action: A string representing the action to be performed. It should be "search" if the user is looking for a business or service.
        - parameters: A dictionary containing the following keys:
            - query: A string to be matched against all content for this place, including but not limited to venue name, category, telephone number, taste, and tips.
            - near: The location or context for the search, if applicable. Can be a city, country, or specific address. Ex. Canada, Los Angeles, 123 Main St.
            - max_price: A string representing the maximum price range for the search. Valid values range between 1 (most affordable) to 4 (most expensive), inclusive.
            - min_price: A string representing the minimum price range for the search. Valid values range between 1 (most affordable) to 4 (most expensive), inclusive.
            - open_now: A boolean indicating whether to filter results by open status. If not specified, leave it out.

        Leverage the internet to ensure all relevant details in the user's query are accurately captured. Example, if the user mentions a place, does it exist?

        The user may ask for various things that are not related to searching for a business or service.
        If the user's search is not related to looking for a business or service, you should respond with the action set to "invalid_search_query" and the parameters set to an empty object.

        Some examples but not limited to are:
            "What is the weather like today?"
            "Tell me a joke."
            "How do I make a cake?"
            "Can you create a new recipe for me?"
            "Can you code a simple calculator?"

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

        response_data = response.choices[0].message.content.strip()
        cleaned_response = extract_json_from_markdown(response_data)
    except Exception as e:
        logger.error(f"OpenAI API Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong while analyzing your message. Please try again.",
        )

    logger.info(f"OpenAI Response: {cleaned_response}")

    # Check if the search action is valid
    # If not, return early to avoid unnecessary Foursquare API call
    if cleaned_response.get("action") == "invalid_search_query":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sorry, we couldn't understand your request. Please try again with a query related to a business or service you'd like to find.",
        )

    filtered_params = {
        key: value
        for key, value in cleaned_response["parameters"].items()
        if value is not None and value != ""
    }

    try:
        query_string = urlencode(filtered_params)
        base_url = "https://api.foursquare.com/v3/places/search"
        full_url = f"{base_url}?{query_string}"

        headers = {
            "Accept": "application/json",
            "Authorization": os.getenv("FOURSQUARE_API_KEY"),
        }

        response = requests.get(full_url, headers=headers)
        response.raise_for_status()
    except Exception as e:
        logger.error(f"Foursquare API Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Oops! Something went wrong while trying to find places. Please try again in a little while."
        )

    return {
        "data": response.json(),
        "next_page": response.headers.get("Link", ""),
    }


@app.post("/api/fetch-page")
def fetch_data(page_link: PageLinkInput):
    headers = {
        "Accept": "application/json",
        "Authorization": os.getenv("FOURSQUARE_API_KEY"),
    }

    try:
        response = requests.get(page_link.link, headers=headers)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        logger.error(f"Fetch Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Sorry, we couldn't fetch the data. Please try again shortly.",
        )

    return {
        "data": response.json(),
        "next_page": response.headers.get("Link", ""),
    }
