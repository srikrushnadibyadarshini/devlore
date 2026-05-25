import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Quiz() {
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const [timer, setTimer] = useState(15)
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()
  // Load questions from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('quiz_questions')
    if (!stored) {
      navigate('/setup')
      return
    }
    setQuestions(JSON.parse(stored))
  }, [])
  // Timer logic
  useEffect(() => {
    if (!questions.length) return
    if (timer === 0) {
      handleAnswer(null) // auto move if time runs out
      return
    }
    const countdown = setTimeout(() => {
      setTimer(t => t - 1)
    }, 1000)
    return () => clearTimeout(countdown)
  }, [timer, questions, current])
  const handleAnswer = (selectedOption) => {
    const q = questions[current]
    const isCorrect = selectedOption === q.correct_answer
    setSelected(selectedOption)
    const newAnswer = {
      question: q.question,
      correct_answer: q.correct_answer,
      user_answer: selectedOption,
      isCorrect
    }
    const updatedAnswers = [...answers, newAnswer]
    // Wait 1 second so user can see correct answer then move
    setTimeout(() => {
      if (current + 1 < questions.length) {
        setCurrent(c => c + 1)
        setTimer(15)
        setSelected(null)
      } else {
        // Quiz finished — save answers and go to results
        localStorage.setItem('quiz_answers', JSON.stringify(updatedAnswers))
        navigate('/results')
      }
    }, 1000)
    setAnswers(updatedAnswers)
  }
  if (!questions.length) return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <p>Loading...</p>
    </div>
  )
  const q = questions[current]
  const timerColor = timer > 10 ? '#22c55e' : timer > 5 ? '#f59e0b' : '#ef4444'
  return (
    <div style={{
      maxWidth: '650px',
      margin: '40px auto',
      padding: '30px',
    }}>
      {/* Header — Progress + Timer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <span style={{ fontSize: '16px', color: '#6b7280' }}>
          Question {current + 1} / {questions.length}
        </span>
        <span style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: timerColor,
          border: `3px solid ${timerColor}`,
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {timer}
        </span>
      </div>
      {/* Progress Bar */}
      <div style={{
        backgroundColor: '#e5e7eb',
        borderRadius: '999px',
        height: '8px',
        marginBottom: '30px'
      }}>
        <div style={{
          width: `${((current + 1) / questions.length) * 100}%`,
          backgroundColor: '#4f46e5',
          height: '8px',
          borderRadius: '999px',
          transition: 'width 0.3s'
        }} />
      </div>
      {/* Question */}
      <div style={{
        backgroundColor: '#f9fafb',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <p style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}
          dangerouslySetInnerHTML={{ __html: q.question }}
        />
      </div>
      {/* Answer Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {q.options.map((option, index) => {
          // Button color logic
          let bgColor = 'white'
          let borderColor = '#d1d5db'
          let textColor = '#1f2937'
          if (selected !== null) {
            if (option === q.correct_answer) {
              bgColor = '#dcfce7'
              borderColor = '#22c55e'
              textColor = '#15803d'
            } else if (option === selected && !q.correct_answer) {
              bgColor = '#fee2e2'
              borderColor = '#ef4444'
              textColor = '#b91c1c'
            }
          }
          return (
            <button
              key={index}
              onClick={() => selected === null && handleAnswer(option)}
              disabled={selected !== null}
              style={{
                padding: '14px 20px',
                backgroundColor: bgColor,
                border: `2px solid ${borderColor}`,
                borderRadius: '10px',
                fontSize: '16px',
                color: textColor,
                cursor: selected !== null ? 'not-allowed' : 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
              dangerouslySetInnerHTML={{ __html: option }}
            />
          )
        })}
      </div>
      {/* Score tracker */}
      <p style={{ textAlign: 'center', marginTop: '24px', color: '#6b7280' }}>
        ✅ Correct: {answers.filter(a => a.isCorrect).length} |
        ❌ Wrong: {answers.filter(a => !a.isCorrect).length}
      </p>
    </div>
  )
}