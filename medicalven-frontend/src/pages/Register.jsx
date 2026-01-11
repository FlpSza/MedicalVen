import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Auth.css'

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 0, // 0 = Patient, 1 = Doctor
    specialization: '',
    licenseNumber: '',
    phoneNumber: '',
    location: '',
    bio: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await register(formData)
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <div className="auth-header">
          <span className="auth-icon">⚕️</span>
          <h1>Criar Conta</h1>
          <p>Junte-se ao MedicalVEN</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="input-group">
            <label className="label">Tipo de Conta</label>
            <select
              name="role"
              className="select"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: parseInt(e.target.value) }))}
              required
            >
              <option value={0}>Paciente</option>
              <option value={1}>Médico Voluntário</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="label">Nome</label>
              <input
                type="text"
                name="firstName"
                className="input"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label className="label">Sobrenome</label>
              <input
                type="text"
                name="lastName"
                className="input"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="label">Email</label>
            <input
              type="email"
              name="email"
              className="input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label className="label">Senha</label>
            <input
              type="password"
              name="password"
              className="input"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          {formData.role === 1 && (
            <>
              <div className="input-group">
                <label className="label">Especialização</label>
                <input
                  type="text"
                  name="specialization"
                  className="input"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="Ex: Cardiologia, Pediatria..."
                />
              </div>

              <div className="input-group">
                <label className="label">Número de Licença</label>
                <input
                  type="text"
                  name="licenseNumber"
                  className="input"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className="input-group">
            <label className="label">Telefone (opcional)</label>
            <input
              type="tel"
              name="phoneNumber"
              className="input"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label className="label">Localização (opcional)</label>
            <input
              type="text"
              name="location"
              className="input"
              value={formData.location}
              onChange={handleChange}
              placeholder="Cidade, Estado"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? <span className="spinner"></span> : 'Criar Conta'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Já tem uma conta? <Link to="/login">Faça login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
