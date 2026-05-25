// Save a new quiz session
export const saveSession = (session) => {
  const history = getSessions()
  history.push(session)
  localStorage.setItem('devlore_history', JSON.stringify(history))
}
// Get all quiz sessions
export const getSessions = () => {
  return JSON.parse(localStorage.getItem('devlore_history') || '[]')
}
// Clear all history
export const clearSessions = () => {
  localStorage.removeItem('devlore_history')
}