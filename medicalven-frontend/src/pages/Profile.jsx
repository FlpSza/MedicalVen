import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const Profile = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  if (!user) {
    return <div>Carregando...</div>
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">Meu Perfil</h1>
        <p className="text-secondary">Informações da sua conta</p>
      </div>

      <div className="card">
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--primary)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <h2 className="text-xl font-bold">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-secondary">{user.email}</p>
          <span className={`badge ${user.role === 1 ? 'badge-primary' : 'badge-success'}`}>
            {user.role === 1 ? 'Médico Voluntário' : 'Paciente'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {user.specialization && (
            <div>
              <h3 className="font-semibold mb-1">Especialização</h3>
              <p className="text-secondary">{user.specialization}</p>
            </div>
          )}

          {user.licenseNumber && (
            <div>
              <h3 className="font-semibold mb-1">Número de Licença</h3>
              <p className="text-secondary">{user.licenseNumber}</p>
            </div>
          )}

          {user.phoneNumber && (
            <div>
              <h3 className="font-semibold mb-1">Telefone</h3>
              <p className="text-secondary">{user.phoneNumber}</p>
            </div>
          )}

          {user.location && (
            <div>
              <h3 className="font-semibold mb-1">Localização</h3>
              <p className="text-secondary">{user.location}</p>
            </div>
          )}

          {user.bio && (
            <div style={{ gridColumn: '1 / -1' }}>
              <h3 className="font-semibold mb-1">Biografia</h3>
              <p className="text-secondary">{user.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
