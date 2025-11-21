from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(
    title="Library Management AI Service",
    description="AI-powered features for the Library Management System",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class BookRecommendation(BaseModel):
    book_id: str
    title: str
    author: str
    score: float
    reason: str

class SearchQuery(BaseModel):
    query: str
    user_id: Optional[str] = None
    limit: int = 10

class ChatMessage(BaseModel):
    message: str
    user_id: str
    context: Optional[dict] = None

class RecommendationRequest(BaseModel):
    user_id: str
    limit: int = 5
    preferences: Optional[dict] = None

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Library Management AI Service",
        "version": "1.0.0"
    }

# Book search endpoint
@app.post("/search", response_model=List[dict])
async def intelligent_search(search_query: SearchQuery):
    """
    Intelligent book search using NLP and semantic understanding
    """
    try:
        # TODO: Implement actual search logic with Elasticsearch and NLP
        # For now, return mock results

        mock_results = [
            {
                "id": "1",
                "title": "The Great Gatsby",
                "author": "F. Scott Fitzgerald",
                "genre": "Classic Fiction",
                "relevance_score": 0.95,
                "description": "A classic American novel"
            },
            {
                "id": "2",
                "title": "To Kill a Mockingbird",
                "author": "Harper Lee",
                "genre": "Classic Fiction",
                "relevance_score": 0.87,
                "description": "A gripping tale of racial injustice"
            }
        ]

        return mock_results[:search_query.limit]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

# Recommendations endpoint
@app.post("/recommendations/{user_id}", response_model=List[BookRecommendation])
async def get_recommendations(user_id: str, request: RecommendationRequest):
    """
    Get personalized book recommendations for a user
    """
    try:
        # TODO: Implement actual recommendation engine
        # For now, return mock recommendations

        mock_recommendations = [
            BookRecommendation(
                book_id="1",
                title="1984",
                author="George Orwell",
                score=0.92,
                reason="Based on your interest in dystopian fiction"
            ),
            BookRecommendation(
                book_id="2",
                title="Brave New World",
                author="Aldous Huxley",
                score=0.88,
                reason="Similar to other books you've enjoyed"
            ),
            BookRecommendation(
                book_id="3",
                title="Fahrenheit 451",
                author="Ray Bradbury",
                score=0.85,
                reason="Popular in your favorite genre"
            )
        ]

        return mock_recommendations[:request.limit]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get recommendations: {str(e)}")

# Chatbot endpoint
@app.post("/chatbot")
async def chatbot_interaction(message: ChatMessage):
    """
    AI chatbot for library queries and assistance
    """
    try:
        # TODO: Implement actual chatbot logic with NLP
        # For now, return mock responses

        responses = {
            "default": "I'm here to help you with library-related questions. You can ask me about books, due dates, or library services.",
            "hours": "The library is open Monday-Friday 9am-8pm, Saturday 10am-6pm, and Sunday 12pm-5pm.",
            "books": "You can search for books using our catalog or ask me for recommendations based on your interests.",
            "due": "You can check your due dates by logging into your account and viewing 'My Books'."
        }

        # Simple keyword matching for demo purposes
        message_lower = message.message.lower()
        response = responses["default"]

        if "hours" in message_lower:
            response = responses["hours"]
        elif "book" in message_lower:
            response = responses["books"]
        elif "due" in message_lower or "return" in message_lower:
            response = responses["due"]

        return {
            "response": response,
            "confidence": 0.8,
            "suggestions": [
                "What are the library hours?",
                "How do I find a book?",
                "When are my books due?"
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chatbot failed: {str(e)}")

# Predictive analytics endpoint
@app.get("/predictions/demand")
async def demand_forecasting():
    """
    Predict book demand for inventory management
    """
    try:
        # TODO: Implement actual demand forecasting
        # For now, return mock predictions

        return {
            "predictions": [
                {
                    "genre": "Science Fiction",
                    "predicted_demand": 0.85,
                    "recommendation": "Increase stock by 15%"
                },
                {
                    "genre": "Mystery",
                    "predicted_demand": 0.72,
                    "recommendation": "Maintain current inventory"
                },
                {
                    "genre": "Romance",
                    "predicted_demand": 0.45,
                    "recommendation": "Consider reducing inventory"
                }
            ],
            "model_confidence": 0.78,
            "last_updated": "2024-01-15T10:30:00Z"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Demand prediction failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)