import { getSessions, clearSessions } from '../utils/storage'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()
  const sessions = getSessions()

  // If no history
  if (sessions.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1>📊 Progress Dashboard</h1>
        <p style={{ color: '#6b7280', fontSize: '18px' }}>
          No quiz history yet!
        </p>
        <button
          onClick={() => navigate('/setup')}
          style={btnPrimaryStyle}
        >
          Start Your First Quiz 🚀
        </button>
      </div>
    )
  }

  // Calculate category stats
  const categoryMap = {}
  sessions.forEach(s => {
    if (!categoryMap[s.category]) {
      categoryMap[s.category] = { totalScore: 0, totalQuestions: 0, count: 0 }
    }
    categoryMap[s.category].totalScore += s.score
    categoryMap[s.category].totalQuestions += s.total
    categoryMap[s.category].count += 1
  })

  const categoryStats = Object.entries(categoryMap).map(([cat, data]) => ({
    category: cat,
    percentage: Math.round((data.totalScore / data.totalQuestions) * 100),
    attempts: data.count
  }))

  // Sort to find strongest and weakest
  const sorted = [...categoryStats].sort((a, b) => b.percentage - a.percentage)
  const strongest = sorted[0]
  const weakest = sorted[sorted.length - 1]

  // Overall stats
  const totalQuizzes = sessions.length
  const overallAvg = Math.round(
    sessions.reduce((sum, s) => sum + (s.score / s.total) * 100, 0) / totalQuizzes
  )

  // Handle clear history
  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      clearSessions()
      navigate('/')
    }
  }

  return (
    <div style={{
      maxWidth: '700px',
      margin: '40px auto',
      padding: '30px'
    }}>
      <h1 style={{ textAlign: 'center', color: '#4f46e5' }}>
        📊 Progress Dashboard
      </h1>

      {/* Overall Stats */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        <div style={statCardStyle}>
          <p style={statNumberStyle}>{totalQuizzes}</p>
          <p style={statLabelStyle}>Total Quizzes</p>
        </div>
        <div style={statCardStyle}>
          <p style={statNumberStyle}>{overallAvg}%</p>
          <p style={statLabelStyle}>Overall Average</p>
        </div>
        <div style={statCardStyle}>
          <p style={{ ...statNumberStyle, color: '#22c55e' }}>
            {strongest?.category}
          </p>
          <p style={statLabelStyle}>💪 Strongest</p>
        </div>
        <div style={statCardStyle}>
          <p style={{ ...statNumberStyle, color: '#ef4444' }}>
            {weakest?.category}
          </p>
          <p style={statLabelStyle}>📈 Needs Work</p>
        </div>
      </div>

      {/* Category Performance — CSS Bars */}
      <h2 style={{ color: '#1f2937', marginBottom: '16px' }}>
        📚 Category Performance
      </h2>

      {categoryStats.map((cat, i) => (
        <div key={i} style={{ marginBottom: '20px' }}>

          {/* Category name + percentage */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '6px'
          }}>
            <span style={{ fontWeight: 'bold', color: '#374151' }}>
              {cat.category}
            </span>
            <span style={{ color: '#6b7280' }}>
              {cat.percentage}% ({cat.attempts} attempt{cat.attempts > 1 ? 's' : ''})
            </span>
          </div>

          {/* CSS Progress Bar — NO chart library */}
          <div style={{
            backgroundColor: '#e5e7eb',
            borderRadius: '999px',
            height: '20px',
            width: '100%'
          }}>
            <div style={{
              width: `${cat.percentage}%`,
              height: '20px',
              borderRadius: '999px',
              backgroundColor:
                cat.percentage >= 80 ? '#22c55e' :
                cat.percentage >= 60 ? '#4f46e5' :
                cat.percentage >= 40 ? '#f59e0b' : '#ef4444',
              transition: 'width 0.6s ease'
            }} />
          </div>

        </div>
      ))}

      {/* Score Trend — Previous Sessions */}
      <h2 style={{ color: '#1f2937', margin: '30px 0 16px' }}>
        🕒 Previous Quiz Sessions
      </h2>

      {[...sessions].reverse().map((s, i) => {
        const pct = Math.round((s.score / s.total) * 100)
        return (
          <div key={i} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            backgroundColor: '#f9fafb',
            borderRadius: '10px',
            marginBottom: '10px',
            border: '1px solid #e5e7eb',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>
              📅 {s.date}
            </span>
            <span style={{ fontWeight: 'bold', color: '#374151' }}>
              {s.category}
            </span>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>
              🎯 {s.difficulty}
            </span>

            {/* Mini CSS bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                backgroundColor: '#e5e7eb',
                borderRadius: '999px',
                height: '10px',
                width: '100px'
              }}>
                <div style={{
                  width: `${pct}%`,
                  height: '10px',
                  borderRadius: '999px',
                  backgroundColor:
                    pct >= 80 ? '#22c55e' :
                    pct >= 60 ? '#4f46e5' :
                    pct >= 40 ? '#f59e0b' : '#ef4444'
                }} />
              </div>
              <span style={{ fontWeight: 'bold', color: '#4f46e5' }}>
                {s.score}/{s.total}
              </span>
            </div>

          </div>
        )
      })}

      {/* Buttons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginTop: '30px',
        flexWrap: 'wrap'
      }}>
        <button onClick={() => navigate('/setup')} style={btnPrimaryStyle}>
          🚀 New Quiz
        </button>
        <button onClick={() => navigate('/')} style={btnSecondaryStyle}>
          🏠 Home
        </button>
        <button onClick={handleClear} style={btnDangerStyle}>
          🗑️ Clear History
        </button>
      </div>

    </div>
  )
}

// Styles
const statCardStyle = {
  backgroundColor: '#f3f4f6',
  padding: '16px 20px',
  borderRadius: '10px',
  textAlign: 'center',
  flex: '1',
  minWidth: '130px'
}

const statNumberStyle = {
  fontSize: '22px',
  fontWeight: 'bold',
  color: '#4f46e5',
  margin: 0
}

const statLabelStyle = {
  color: '#6b7280',
  margin: '4px 0 0',
  fontSize: '14px'
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

const btnDangerStyle = {
  padding: '12px 20px',
  backgroundColor: 'white',
  color: '#ef4444',
  border: '2px solid #ef4444',
  borderRadius: '8px',
  fontSize: '16px',
  cursor: 'pointer'
}