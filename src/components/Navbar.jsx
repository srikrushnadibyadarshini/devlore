import { Link, useLocation } from 'react-router-dom'
export default function Navbar() {
  const location=useLocation()
  const isActive=(path)=>location.pathname===path
  return(
    <nav style={{
      backgroundColor:'#4f46e5',
      padding:'0 30px',
      display:'flex',
      justifyContent:'space-between',
      alignItems:'center',
      height:'60px',
      boxShadow:'0 2px 8px rgba(0,0,0,0.2)'
    }}>

      {/* Logo */}
      <Link to="/" style={{
        color:'white',
        textDecoration:'none',
        fontSize:'22px',
        fontWeight:'bold',
        letterSpacing:'1px'
      }}>
        DevLore
      </Link>
      {/* Nav Links */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <Link to="/" style={linkStyle(isActive('/'))}>
          Home
        </Link>
        <Link to="/setup" style={linkStyle(isActive('/setup'))}>
          Quiz
        </Link>
        <Link to="/dashboard" style={linkStyle(isActive('/dashboard'))}>
          Dashboard
        </Link>
      </div>
    </nav>
  )
}
const linkStyle = (active) => ({
  color:'white',
  textDecoration:'none',
  padding:'6px 14px',
  borderRadius:'8px',
  fontSize:'15px',
  backgroundColor:active ?'rgba(255,255,255,0.25)':'transparent',
  fontWeight:active ?'bold':'normal',
  transition:'background 0.2s'
})