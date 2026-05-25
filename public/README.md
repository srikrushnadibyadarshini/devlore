# DevLore — Tech Quiz & Learning Tracker

## localStorage Schema

Key: `devlore_history`
Value: Array of session objects

### Session Object
```json
{
  "id": 1716123456789,
  "date": "22/05/2026",
  "category": "Science",
  "difficulty": "medium",
  "score": 7,
  "total": 10,
  "questions": [
    {
      "question": "What is the capital of France?",
      "correct_answer": "Paris",
      "user_answer": "London",
      "isCorrect": false
    }
  ]
}
```