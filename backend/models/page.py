from pydantic import BaseModel

class PageLinkInput(BaseModel):
    link: str