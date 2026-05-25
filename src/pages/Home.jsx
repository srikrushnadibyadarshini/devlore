import { getSessions } from '../utils/storage'
import { Link } from 'react-router-dom'

export default function Home() {
  const sessions = getSessions()
  const total = sessions.length

  // Calculate average score
  const avgScore = total
    ? Math.round(
        sessions.reduce((sum, s) => sum + (s.score / s.total) * 100, 0) / total
      )
    : 0

  // Find best performing category
  const categoryMap = {}
  sessions.forEach(s => {
    if (!categoryMap[s.category]) {
      categoryMap[s.category] = { totalScore: 0, count: 0 }
    }
    categoryMap[s.category].totalScore += (s.score / s.total) * 100
    categoryMap[s.category].count += 1
  })

  const bestCategory = Object.entries(categoryMap)
    .map(([cat, data]) => ({
      cat,
      avg: data.totalScore / data.count
    }))
    .sort((a, b) => b.avg - a.avg)[0]?.cat || 'N/A'

  // Get recent 3 sessions
  const recentSessions = [...sessions].reverse().slice(0, 3)

  // If no history exists
  if (total === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1>Welcome to DevLore 🧠</h1>
        <p>Test your technical knowledge and track your progress!</p>
        <Link to="/setup">
          <button style={{
            padding: '12px 24px',
            fontSize: '18px',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            Start Your First Quiz
          </button>
        </Link>
      </div>
    )
  }

  // If history exists
  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '0 20px' }}>
      <h1>Welcome Back! 🧠</h1>

      {/* Stats Section */}
      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>

        <div style={cardStyle}>
          <h3>Total Quizzes</h3>
          <p style={numberStyle}>{total}</p>
        </div>

        <div style={cardStyle}>
          <h3>Average Score</h3>
          <p style={numberStyle}>{avgScore}%</p>
        </div>

        <div style={cardStyle}>
          <h3>Best Category</h3>
          <p style={numberStyle}>{bestCategory}</p>
        </div>

      </div>

      {/* Recent History */}
      <h2>Recent Quiz History</h2>
      {recentSessions.map(s => (
        <div key={s.id} style={historyCardStyle}>
          <span>{s.date}</span>
          <span>{s.category}</span>
          <span>{s.difficulty}</span>
          <span style={{ fontWeight: 'bold' }}>
            {s.score}/{s.total}
          </span>
        </div>
      ))}

      {/* Buttons */}
      <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
        <Link to="/setup">
          <button style={btnPrimary}>Start New Quiz</button>
        </Link>
        <Link to="/dashboard">
          <button style={btnSecondary}>View Dashboard</button>
        </Link>
      </div>

    </div>
  )
}

// Styles
const cardStyle = {
  backgroundColor: '#f3f4f6',
  padding: '20px',
  borderRadius: '10px',
  minWidth: '150px',
  textAlign: 'center'
}

const numberStyle = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#4f46e5',
  margin: 0
}

const historyCardStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '12px 16px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  marginBottom: '10px',
  border: '1px solid #e5e7eb'
}

const btnPrimary = {
  padding: '10px 20px',
  backgroundColor: '#4f46e5',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '16px'
}

const btnSecondary = {
  padding: '10px 20px',
  backgroundColor: 'white',
  color: '#4f46e5',
  border: '2px solid #4f46e5',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '16px'
}