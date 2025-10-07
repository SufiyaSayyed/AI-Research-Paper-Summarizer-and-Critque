from fastapi import FastAPI

app = FastAPI()


@app.get("/health")
def heathCheck():
    return {"message": "ok"}


def main():
    print("Hello from ai-research-paper-summarizer!")


if __name__ == "__main__":
    main()
