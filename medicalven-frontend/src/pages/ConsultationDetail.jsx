import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import { format } from 'date-fns'
import { FiSend } from 'react-icons/fi'

const ConsultationDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [consultation, setConsultation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchConsultation()
    fetchMessages()
    const interval = setInterval(fetchMessages, 5000) // Refresh messages every 5 seconds
    return () => clearInterval(interval)
  }, [id])

  const fetchConsultation = async () => {
    try {
      const response = await api.get(`/consultations/${id}`)
      setConsultation(response.data)
    } catch (error) {
      console.error('Error fetching consultation:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/messages/consultation/${id}`)
      setMessages(response.data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setSending(true)
    try {
      await api.post('/messages', {
        consultationId: parseInt(id),
        content: newMessage
      })
      setNewMessage('')
      fetchMessages()
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
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

  if (!consultation) {
    return <div className="card"><p>Consulta não encontrada.</p></div>
  }

  const isDoctor = user?.role === 1
  const otherUser = isDoctor ? consultation.patient : consultation.doctor

  return (
    <div>
      <div className="card mb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{consultation.subject}</h1>
            <p className="text-secondary">
              {isDoctor ? 'Paciente' : 'Médico'}: {otherUser?.firstName} {otherUser?.lastName}
            </p>
          </div>
          {getStatusBadge(consultation.status)}
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Descrição</h3>
          <p className="text-secondary">{consultation.description}</p>
        </div>

        <div className="mb-4">
          <p className="text-secondary">
            <strong>Agendada para:</strong> {format(new Date(consultation.scheduledAt), "dd/MM/yyyy 'às' HH:mm")}
          </p>
        </div>

        {consultation.diagnosis && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Diagnóstico</h3>
            <p className="text-secondary">{consultation.diagnosis}</p>
          </div>
        )}

        {consultation.prescription && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Prescrição</h3>
            <p className="text-secondary">{consultation.prescription}</p>
          </div>
        )}

        {consultation.notes && (
          <div>
            <h3 className="font-semibold mb-2">Observações</h3>
            <p className="text-secondary">{consultation.notes}</p>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Mensagens</h2>

        <div style={{ 
          maxHeight: '500px', 
          overflowY: 'auto', 
          marginBottom: '1rem',
          padding: '1rem',
          backgroundColor: 'var(--background)',
          borderRadius: '0.5rem'
        }}>
          {messages.length === 0 ? (
            <p className="text-center text-secondary">Nenhuma mensagem ainda. Inicie a conversa!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {messages.map(message => {
                const isOwnMessage = message.senderId === user?.id
                return (
                  <div
                    key={message.id}
                    style={{
                      alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
                      maxWidth: '70%'
                    }}
                  >
                    <div
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '0.75rem',
                        backgroundColor: isOwnMessage ? 'var(--primary)' : 'var(--surface)',
                        color: isOwnMessage ? 'white' : 'var(--text)',
                        border: isOwnMessage ? 'none' : '1px solid var(--border)'
                      }}
                    >
                      {!isOwnMessage && (
                        <p style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: '0.25rem' }}>
                          {message.senderName}
                        </p>
                      )}
                      <p>{message.content}</p>
                      <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.25rem' }}>
                        {format(new Date(message.sentAt), "HH:mm")}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <form onSubmit={sendMessage}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="textarea"
              style={{ flex: 1, minHeight: '80px', marginBottom: 0 }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={sending || !newMessage.trim()}
              style={{ alignSelf: 'flex-end' }}
            >
              <FiSend />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ConsultationDetail
