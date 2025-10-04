from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .auth.route import router as auth_router
from .papers.route import router as paper_router
from .summary.route import router as summary_router

app = FastAPI(title="Research Summarizer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth_router)
app.include_router(paper_router)
app.include_router(summary_router)