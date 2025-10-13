from pydantic import BaseModel


class SummaryRequest(BaseModel):
    docId: str
    query: str = "Please summarize and critique this research paper"