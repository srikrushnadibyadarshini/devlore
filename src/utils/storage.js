export const saveSession = (session) => {
  const history = getSessions()
  history.push(session)
  localStorage.setItem('devlore_history', JSON.stringify(history))
}
export const getSessions = () => {
  return JSON.parse(localStorage.getItem('devlore_history') || '[]')
}
export const clearSessions = () => {
  localStorage.removeItem('devlore_history')
}