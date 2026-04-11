from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

# Load model once (global)
sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

class TextRequest(BaseModel):
    text: str

@app.post("/analyze")
def analyze_sentiment(request: TextRequest):
    result = sentiment_pipeline(request.text)[0]

    return {
        "label": result["label"],
        "score": float(result["score"])
    }