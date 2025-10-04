import os
import asyncio
from dotenv import load_dotenv
from pinecone import Pinecone
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")
GOOGLE_API_KEY = os.getenv("GOGOLE_API_KEY")

os.environ["GOGOLE_API_KEY"] = GOOGLE_API_KEY

pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX_NAME)

embed_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2")

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0.2,
    google_api_key=GOOGLE_API_KEY
)

prompt = PromptTemplate.from_template(
    """
You are a research assistant. Using only the provided context (chunks from the paper), produce:
1) **Summary**: A concise summary of the research paper (methods, results, and conclusions).
2) **Strengths**: Highlight the strong points of the paper.
3) **Limitations**: Critically analyze any weaknesses, gaps, or assumptions.
4) **Future Directions**: Suggest potential next steps for research.

Context:
{context}

User query/request:
{query}
    """
)

rag_chain = prompt | llm


async def research_paper_summary(user: str, doc_id: str, query: str):

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

    return {"summary": final.content, "sources": list(soruces_set)}
