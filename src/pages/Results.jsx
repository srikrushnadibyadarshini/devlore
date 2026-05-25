import { useNavigate } from 'react-router-dom'
import { saveSession } from '../utils/storage'

export default function Results() {
  const navigate = useNavigate()
  const answers = JSON.parse(localStorage.getItem('quiz_answers') || '[]')
  const config = JSON.parse(localStorage.getItem('quiz_config') || '{}')

  const score = answers.filter(a => a.isCorrect).length
  const total = answers.length
  const wrong = total - score
  const percentage = Math.round((score / total) * 100)

  // Emoji based on score
  const getEmoji = () => {
    if (percentage >= 80) return '🏆'
    if (percentage >= 60) return '😊'
    if (percentage >= 40) return '😐'
    return '😢'
  }

  // Message based on score
  const getMessage = () => {
    if (percentage >= 80) return 'Excellent Work!'
    if (percentage >= 60) return 'Good Job!'
    if (percentage >= 40) return 'Keep Practicing!'
    return 'Better Luck Next Time!'
  }

  const handleSave = () => {
    saveSession({
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      category: config.categoryName || 'General',
      difficulty: config.difficulty,
      score,
      total,
      questions: answers
    })
    alert('✅ Quiz saved to history!')
  }

  return (
    <div style={{
      maxWidth: '650px',
      margin: '40px auto',
      padding: '30px',
    }}>

      {/* Score Card */}
      <div style={{
        textAlign: 'center',
        backgroundColor: '#f9fafb',
        padding: '30px',
        borderRadius: '16px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <p style={{ fontSize: '60px', margin: 0 }}>{getEmoji()}</p>
        <h1 style={{ color: '#4f46e5', margin: '10px 0' }}>{getMessage()}</h1>
        <p style={{ fontSize: '48px', fontWeight: 'bold', margin: 0, color: '#1f2937' }}>
          {score}/{total}
        </p>
        <p style={{ fontSize: '20px', color: '#6b7280' }}>{percentage}%</p>

        {/* Stats Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          marginTop: '20px'
        }}>
          <div style={statCardStyle}>
            <p style={{ color: '#22c55e', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
              {score}
            </p>
            <p style={{ color: '#6b7280', margin: 0 }}>✅ Correct</p>
          </div>
          <div style={statCardStyle}>
            <p style={{ color: '#ef4444', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
              {wrong}
            </p>
            <p style={{ color: '#6b7280', margin: 0 }}>❌ Wrong</p>
          </div>
          <div style={statCardStyle}>
            <p style={{ color: '#4f46e5', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
              {percentage}%
            </p>
            <p style={{ color: '#6b7280', margin: 0 }}>📊 Score</p>
          </div>
        </div>
      </div>

      {/* Quiz Info */}
      <div style={{
        backgroundColor: '#ede9fe',
        padding: '16px',
        borderRadius: '10px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span>📚 <strong>Category:</strong> {config.categoryName}</span>
        <span>🎯 <strong>Difficulty:</strong> {config.difficulty}</span>
      </div>

      {/* Incorrect Questions Review */}
      <h2 style={{ color: '#1f2937' }}>📝 Review Incorrect Answers</h2>

      {answers.filter(a => !a.isCorrect).length === 0 ? (
        <p style={{
          textAlign: 'center',
          color: '#22c55e',
          fontSize: '18px',
          padding: '20px',
          backgroundColor: '#dcfce7',
          borderRadius: '10px'
        }}>
          🎉 Perfect Score! All answers were correct!
        </p>
      ) : (
        answers.filter(a => !a.isCorrect).map((a, i) => (
          <div key={i} style={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '12px'
          }}>
            <p style={{ fontWeight: 'bold', color: '#1f2937' }}
              dangerouslySetInnerHTML={{ __html: `Q${i + 1}: ${a.question}` }}
            />
            <p style={{ color: '#ef4444', margin: '4px 0' }}
              dangerouslySetInnerHTML={{ __html: `❌ Your Answer: ${a.user_answer || 'Skipped'}` }}
            />
            <p style={{ color: '#22c55e', margin: '4px 0' }}
              dangerouslySetInnerHTML={{ __html: `✅ Correct Answer: ${a.correct_answer}` }}
            />
          </div>
        ))
      )}

      {/* Buttons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginTop: '24px',
        flexWrap: 'wrap'
      }}>
        <button onClick={handleSave} style={btnSaveStyle}>
          💾 Save to History
        </button>
        <button onClick={() => navigate('/setup')} style={btnPrimaryStyle}>
          🔄 Try Again
        </button>
        <button onClick={() => navigate('/dashboard')} style={btnSecondaryStyle}>
          📊 View Dashboard
        </button>
        <button onClick={() => navigate('/')} style={btnHomeStyle}>
          🏠 Home
        </button>
      </div>

    </div>
  )
}

// Styles
const statCardStyle = {
  textAlign: 'center',
  backgroundColor: 'white',
  padding: '12px 20px',
  borderRadius: '10px',
  minWidth: '80px'
}

const btnSaveStyle = {
  padding: '12px 20px',
  backgroundColor: '#22c55e',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  cursor: 'pointer'
}

const btnPrimaryStyle = {
  padding: '12px 20px',
  backgroundColor: '#4f46e5',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  cursor: 'pointer'
}

const btnSecondaryStyle = {
  padding: '12px 20px',
  backgroundColor: 'white',
  color: '#4f46e5',
  border: '2px solid #4f46e5',
  borderRadius: '8px',
  fontSize: '16px',
  cursor: 'pointer'
}

const btnHomeStyle = {
  padding: '12px 20px',
  backgroundColor: '#f3f4f6',
  color: '#374151',
  border: '2px solid #d1d5db',
  borderRadius: '8px',
  fontSize: '16px',
  cursor: 'pointer'
}