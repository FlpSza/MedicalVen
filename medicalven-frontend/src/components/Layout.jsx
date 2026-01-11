import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FiHome, FiCalendar, FiUsers, FiUser, FiLogOut, FiMessageSquare } from 'react-icons/fi'
import './Layout.css'

const Layout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <span className="logo-icon">⚕️</span>
              <span className="logo-text">MedicalVEN</span>
            </Link>
            <nav className="nav">
              <Link to="/" className="nav-link">
                <FiHome /> Dashboard
              </Link>
              <Link to="/consultations" className="nav-link">
                <FiCalendar /> Consultas
              </Link>
              {user?.role === 0 && (
                <Link to="/doctors" className="nav-link">
                  <FiUsers /> Médicos
                </Link>
              )}
              <Link to="/profile" className="nav-link">
                <FiUser /> Perfil
              </Link>
              <button onClick={handleLogout} className="nav-link logout-btn">
                <FiLogOut /> Sair
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <Outlet />
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>MedicalVEN - Conectando médicos voluntários com pacientes na Venezuela</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
