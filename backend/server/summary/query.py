import os
import asyncio
from dotenv import load_dotenv
from pinecone import Pinecone
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from ..config.config import settings


load_dotenv()

PINECONE_API_KEY = settings.PINECONE_API_KEY
PINECONE_INDEX_NAME = settings.PINECONE_INDEX_NAME
GOOGLE_API_KEY = settings.GOOGLE_API_KEY

os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX_NAME)

embed_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.2,
    google_api_key=GOOGLE_API_KEY
)

prompt = PromptTemplate.from_template("""
You are a research assistant specialized in academic paper analysis.
Using only the provided context (chunks from the paper), analyze the content and return your response as a JSON object
with the following format:

{{
  "title": "string (if extractable, else null)",
  "summary": "Concise summary of the paper (methods, results, and conclusions).",
  "strengths": ["list of strong points"],
  "limitations": ["list of weaknesses or gaps"],
  "future_directions": ["list of potential next steps for research"],
  "novelty_score": "number between 1 and 10 indicating originality",
  "technical_depth_score": "number between 1 and 10 indicating method rigor",
  "clarity_score": "number between 1 and 10 indicating writing clarity",
  "practical_impact_score": "number between 1 and 10 indicating real-world relevance",
  "domain": "main field or discipline (AI, Medicine, etc.)",
  "keywords": ["list of 3-7 important keywords extracted from context"],
  "sources": ["list of source files or paper names provided"]
}}

Guidelines:
- Keep sentences concise and academic.
- Use bullet-style phrasing in list fields.
- Do not include markdown formatting like ### or **.
- Return *only* valid JSON (no quotes, no markdown).

Context:
{context}

User query/request:
{query}
""")

rag_chain = prompt | llm


async def research_paper_summary(user: str, doc_id: str, query: str):
    print("in summary fetch: ")
    # embed the query
    embed_query = await asyncio.to_thread(embed_model.embed_query, query)

    # search the embeded query from pincone vectordb
    results = await asyncio.to_thread(index.query, vector=embed_query, top_k=5, include_metadata=True)

    # filter from results based on doc_id matches
    context = []
    soruces_set = set()
    for match in results.get("matches", []):
        md = match.get("metadata", {})
        if md.get("doc_id") == doc_id:
            # extract text snippet from that doc_id chunk
            text_snippet = md.get("text") or ""
            context.append(text_snippet)
            soruces_set.add(md.get("source"))

    if not context:
        return {"summary": None, "explanation": "No content indexed for this doc_id"}

    # limit context length
    context_text = "\n\n".join(context[:5])

    # final call for llm rag chain
    final = await asyncio.to_thread(rag_chain.invoke, {"context": context_text, "query": query})
    
    print("llm response: ", final)

    return {"summary": final.content, "sources": list(soruces_set)}
