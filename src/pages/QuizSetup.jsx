import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = [
  { id:9,name:'General Knowledge'},
  { id:17,name:'Science & Nature'},
  { id:18,name:'Computer Science'},
  { id:19,name:'Mathematics'},
  { id:21,name:'Sports'},
  { id:23,name:'History'},
]

export default function QuizSetup() {
  const[category, setCategory] = useState('')
  const[categoryName, setCategoryName] = useState('')
  const[difficulty, setDifficulty] = useState('')
  const[loading, setLoading] = useState(false)
  const[error, setError] = useState('')
  const navigate = useNavigate()

  const startQuiz = async () => {
    if (!category) {
      setError('Please select a category!')
      return
    }
    if (!difficulty) {
      setError('Please select a difficulty!')
      return
    }
    setLoading(true)
    setError('')
    try {
      const url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`
      const response = await fetch(url)
      const data = await response.json()
      if (data.response_code !== 0) {
        setError('Not enough questions found. Please try different settings.')
        setLoading(false)
        return
      }
      const formatted = data.results.map(q => ({
        question: q.question,
        correct_answer: q.correct_answer,
        options: [...q.incorrect_answers, q.correct_answer]
          .sort(() => Math.random() - 0.5)
      }))
      localStorage.setItem('quiz_questions', JSON.stringify(formatted))
      localStorage.setItem('quiz_config', JSON.stringify({
        category,
        categoryName,
        difficulty
      }))
      navigate('/quiz')

    } catch (err) {
      setError('Something went wrong. Check your internet connection.')
      setLoading(false)
    }
  }
  return (
    <div style={{
      maxWidth: '500px',
      margin: '60px auto',
      padding: '30px',
      backgroundColor: '#f9fafb',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ textAlign: 'center', color: '#4f46e5' }}>
        Quiz Setup
      </h1>
      <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '30px' }}>
        Choose your category and difficulty to begin!
      </p>

      {/* Category Selector */}
      <div style={fieldStyle}>
        <label style={labelStyle}>Select Category</label>
        <div style={selectWrapperStyle}>
          <select
            value={category}
            onChange={e => {
              setCategory(e.target.value)
              setCategoryName(e.target.options[e.target.selectedIndex].text)
            }}
            style={selectStyle}
          >
            <option value="" disabled>-- Choose a Category --</option>
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <span style={arrowStyle}>▼</span>
        </div>
      </div>

      {/* Difficulty Selector */}
      <div style={fieldStyle}>
        <label style={labelStyle}>Select Difficulty</label>
        <div style={selectWrapperStyle}>
          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
            style={selectStyle}
          >
            <option value="" disabled>-- Choose Difficulty --</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <span style={arrowStyle}>▼</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p style={{
          color: 'red',
          textAlign: 'center',
          backgroundColor: '#fee2e2',
          padding: '10px',
          borderRadius: '8px'
        }}>
          {error}
        </p>
      )}
      {/* Start Button */}
      <button
        onClick={startQuiz}
        disabled={loading}
        style={{
          width: '100%',
          padding: '14px',
          backgroundColor: loading ?'#a5b4fc':'#4f46e5',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '18px',
          cursor: loading ?'not-allowed':'pointer',
          marginTop: '10px'
        }}
      >
        {loading ?'Loading Questions...':'Start Quiz'}
      </button>
    </div>
  )
}
const fieldStyle = {
  marginBottom: '20px'
}
const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: 'bold',
  color: '#374151',
  fontSize: '16px'
}
const selectWrapperStyle = {
  position: 'relative',
  width: '100%'
}
const selectStyle = {
  width: '100%',
  padding: '12px 40px 12px 12px',
  borderRadius: '8px',
  border: '2px solid #d1d5db',
  fontSize: '16px',
  backgroundColor: 'white',
  appearance: 'none',
  cursor: 'pointer',
  color: '#374151'
}
const arrowStyle = {
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
  color: '#4f46e5',
  fontSize: '14px'
}