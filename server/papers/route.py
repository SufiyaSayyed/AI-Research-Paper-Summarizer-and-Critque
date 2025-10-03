from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from ..auth.route import authenticate
from .vectorstore import load_vectorstore
import uuid
from typing import List
from ..config.db import research_paper_collection

router = APIRouter(prefix="/papers", tags=["papers"])


@router.post("/upload")
async def upload_papers(user=Depends(authenticate), files: List[UploadFile] = File(...)):
    doc_id=str(uuid.uuid64())
    await load_vectorstore(files, uploaded=user["username"], doc_id=doc_id)
    return {"message": "Uploaded and indexed", "doc_id": doc_id}