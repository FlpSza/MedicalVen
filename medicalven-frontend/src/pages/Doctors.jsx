import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { FiUser, FiMapPin, FiCalendar } from 'react-icons/fi'

const Doctors = () => {
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    scheduledAt: ''
  })

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/users/doctors')
      setDoctors(response.data)
    } catch (error) {
      console.error('Error fetching doctors:', error)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (doctor) => {
    setSelectedDoctor(doctor)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedDoctor(null)
    setFormData({ subject: '', description: '', scheduledAt: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/consultations', {
        doctorId: selectedDoctor.id,
        subject: formData.subject,
        description: formData.description,
        scheduledAt: formData.scheduledAt
      })
      closeModal()
      navigate('/consultations')
    } catch (error) {
      console.error('Error creating consultation:', error)
      alert('Erro ao criar consulta. Tente novamente.')
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}><div className="spinner"></div></div>
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">Médicos Voluntários</h1>
        <p className="text-secondary">Encontre um médico para sua consulta</p>
      </div>

      {doctors.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <p className="text-secondary">Nenhum médico disponível no momento.</p>
        </div>
      ) : (
        <div className="grid grid-3">
          {doctors.map(doctor => (
            <div key={doctor.id} className="card">
              <div className="flex items-center gap-4 mb-4">
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--primary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>
                  {doctor.firstName[0]}{doctor.lastName[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 className="font-semibold text-lg">
                    Dr(a). {doctor.firstName} {doctor.lastName}
                  </h3>
                  {doctor.specialization && (
                    <p className="text-primary font-semibold">{doctor.specialization}</p>
                  )}
                </div>
              </div>

              {doctor.location && (
                <p className="text-secondary mb-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiMapPin /> {doctor.location}
                </p>
              )}

              {doctor.bio && (
                <p className="text-secondary mb-4" style={{ fontSize: '0.9rem' }}>
                  {doctor.bio.substring(0, 100)}...
                </p>
              )}

              <button
                onClick={() => openModal(doctor)}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                <FiCalendar /> Solicitar Consulta
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedDoctor && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Solicitar Consulta - Dr(a). {selectedDoctor.firstName} {selectedDoctor.lastName}
              </h2>
              <button onClick={closeModal} style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="label">Assunto</label>
                <input
                  type="text"
                  className="input"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  required
                  placeholder="Ex: Dor de cabeça, Check-up..."
                />
              </div>

              <div className="input-group">
                <label className="label">Descrição</label>
                <textarea
                  className="textarea"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                  placeholder="Descreva seus sintomas ou motivo da consulta..."
                />
              </div>

              <div className="input-group">
                <label className="label">Data e Hora Desejada</label>
                <input
                  type="datetime-local"
                  className="input"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                  required
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={closeModal} className="btn btn-outline" style={{ flex: 1 }}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Enviar Solicitação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Doctors
