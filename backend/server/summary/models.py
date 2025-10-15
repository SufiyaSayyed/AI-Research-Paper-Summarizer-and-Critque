from pydantic import BaseModel


class GenerateSummaryRequest(BaseModel):
    docId: str
    query: str = "Please summarize and critique this research paper"
    