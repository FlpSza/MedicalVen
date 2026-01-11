import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import { format } from 'date-fns'

const Consultations = () => {
  const { user } = useAuth()
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConsultations()
  }, [])

  const fetchConsultations = async () => {
    try {
      const response = await api.get('/consultations')
      setConsultations(response.data)
    } catch (error) {
      console.error('Error fetching consultations:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      0: { label: 'Pendente', class: 'badge-warning' },
      1: { label: 'Agendada', class: 'badge-primary' },
      2: { label: 'Em Andamento', class: 'badge-primary' },
      3: { label: 'Concluída', class: 'badge-success' },
      4: { label: 'Cancelada', class: 'badge-danger' }
    }
    const statusInfo = statusMap[status] || statusMap[0]
    return <span className={`badge ${statusInfo.class}`}>{statusInfo.label}</span>
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}><div className="spinner"></div></div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Minhas Consultas</h1>
          <p className="text-secondary">Gerencie todas as suas consultas</p>
        </div>
        {user?.role === 0 && (
          <Link to="/doctors" className="btn btn-primary">
            Nova Consulta
          </Link>
        )}
      </div>

      {consultations.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <p className="text-secondary mb-4">Nenhuma consulta encontrada.</p>
          {user?.role === 0 && (
            <Link to="/doctors" className="btn btn-primary">
              Encontrar Médico
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {consultations.map(consultation => (
            <Link
              key={consultation.id}
              to={`/consultations/${consultation.id}`}
              className="card"
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <div className="flex justify-between items-start">
                <div style={{ flex: 1 }}>
                  <h3 className="font-semibold text-lg mb-1">{consultation.subject}</h3>
                  <p className="text-secondary mb-2">
                    {user?.role === 0 
                      ? `Dr(a). ${consultation.doctor?.firstName} ${consultation.doctor?.lastName}`
                      : `${consultation.patient?.firstName} ${consultation.patient?.lastName}`
                    }
                  </p>
                  <p className="text-secondary text-sm mb-1">{consultation.description.substring(0, 100)}...</p>
                  <p className="text-secondary text-sm">
                    {format(new Date(consultation.scheduledAt), "dd/MM/yyyy 'às' HH:mm")}
                  </p>
                </div>
                {getStatusBadge(consultation.status)}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Consultations
