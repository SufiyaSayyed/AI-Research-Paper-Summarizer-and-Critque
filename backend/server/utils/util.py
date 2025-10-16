import fitz  
from pathlib import Path

def pdf_to_image(pdf_path: str, output_dir: str, doc_id: str) -> str:
    """
    Converts the first page of a PDF to an image and saves it.
    Returns the saved image path.
    """
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    doc = fitz.open(pdf_path)
    page = doc.load_page(0)  # first page only
    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))  # 2x zoom for better resolution
    output_path = Path(output_dir) / f"{doc_id}_preview.jpg"
    pix.save(output_path)
    doc.close()
    return str(output_path)