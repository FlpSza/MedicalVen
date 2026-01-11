# MedicalVEN

Plataforma de telemedicina beneficente para conectar médicos voluntários com pacientes na Venezuela remotamente.

## 📋 Descrição

MedicalVEN é uma aplicação web completa desenvolvida com .NET 8 (Backend API) e React (Frontend) que permite:

- **Médicos voluntários** se cadastrarem e oferecerem consultas remotas
- **Pacientes** encontrarem médicos e solicitarem consultas
- **Comunicação em tempo real** através de mensagens durante as consultas
- **Gestão completa** de consultas, diagnósticos e prescrições

## 🛠️ Tecnologias

### Backend
- .NET 8.0
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server (LocalDB)
- JWT Authentication
- Swagger/OpenAPI

### Frontend
- React 18
- Vite
- React Router
- Axios
- React Icons
- date-fns

## 📁 Estrutura do Projeto

```
MedicalVEn/
├── MedicalVEN.API/              # Backend .NET API
│   ├── Controllers/             # API Controllers
│   ├── Data/                    # DbContext
│   ├── DTOs/                    # Data Transfer Objects
│   ├── Models/                  # Entity Models
│   ├── Services/                # Business Logic Services
│   ├── Program.cs
│   └── appsettings.json
│
├── medicalven-frontend/         # Frontend React
│   ├── src/
│   │   ├── components/          # React Components
│   │   ├── contexts/            # React Contexts
│   │   ├── pages/               # Page Components
│   │   ├── services/            # API Services
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

## 🚀 Como Executar

### Pré-requisitos

- .NET 8.0 SDK
- Node.js 18+ e npm
- SQLite (vem instalado com .NET, não precisa instalação separada)

### Backend (API)

1. Navegue até a pasta do backend:
```bash
cd MedicalVEN.API
```

2. Restaure as dependências (o .NET SDK faz isso automaticamente, mas você pode verificar):
```bash
dotnet restore
```

3. Execute a aplicação:
```bash
dotnet run
```

A API estará disponível em:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`
- Swagger UI: `http://localhost:5000/swagger` (ou `https://localhost:5001/swagger`)

**Nota:** O banco de dados SQLite será criado automaticamente na primeira execução como um arquivo `MedicalVEN.db` na pasta do projeto. Não é necessário instalar ou configurar nenhum servidor de banco de dados - o SQLite funciona como um banco embutido!

### Frontend (React)

1. Navegue até a pasta do frontend:
```bash
cd medicalven-frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

## 📝 Funcionalidades

### Para Pacientes
- ✅ Cadastro e autenticação
- ✅ Buscar médicos voluntários disponíveis
- ✅ Solicitar consultas remotas
- ✅ Visualizar consultas agendadas
- ✅ Comunicar-se com médicos através de mensagens
- ✅ Visualizar diagnósticos e prescrições

### Para Médicos Voluntários
- ✅ Cadastro com especialização e número de licença
- ✅ Receber solicitações de consultas
- ✅ Gerenciar consultas (aceitar, agendar, completar)
- ✅ Comunicar-se com pacientes através de mensagens
- ✅ Registrar diagnósticos e prescrições
- ✅ Visualizar histórico de consultas

## 🔐 Autenticação

A aplicação utiliza JWT (JSON Web Tokens) para autenticação:

1. **Registro**: `/api/auth/register`
2. **Login**: `/api/auth/login`
3. **Usuário Atual**: `/api/auth/me` (requer autenticação)

O token JWT é armazenado no localStorage do navegador e incluído automaticamente nas requisições subsequentes.

## 📚 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Obter usuário atual (autenticado)

### Usuários
- `GET /api/users/doctors` - Listar todos os médicos
- `GET /api/users/{id}` - Obter usuário por ID

### Consultas
- `GET /api/consultations` - Listar consultas do usuário atual
- `GET /api/consultations/{id}` - Obter consulta por ID
- `POST /api/consultations` - Criar nova consulta
- `PUT /api/consultations/{id}` - Atualizar consulta

### Mensagens
- `GET /api/messages/consultation/{consultationId}` - Obter mensagens de uma consulta
- `POST /api/messages` - Enviar mensagem
- `PUT /api/messages/{id}/read` - Marcar mensagem como lida

## 🔧 Configuração

### JWT Settings (appsettings.json)

```json
"JwtSettings": {
  "SecretKey": "MedicalVEN_SuperSecretKey_ForJWTToken_2024_ChangeInProduction!",
  "Issuer": "MedicalVEN",
  "Audience": "MedicalVENUsers",
  "ExpirationInMinutes": 1440
}
```

**⚠️ IMPORTANTE:** Altere a `SecretKey` em produção para uma chave segura e aleatória!

### CORS

O backend está configurado para aceitar requisições do frontend em:
- `http://localhost:3000`
- `http://localhost:5173`

Para adicionar outros domínios, edite `Program.cs`.

## 🗄️ Banco de Dados

### SQLite (Desenvolvimento)

O projeto está configurado para usar **SQLite** em desenvolvimento, que é perfeito para desenvolvimento local porque:

- ✅ **Não precisa instalar servidor de banco** - SQLite é um banco embutido
- ✅ **Cria o banco automaticamente** - O arquivo `MedicalVEN.db` é criado na primeira execução
- ✅ **Funciona em qualquer sistema** - Windows, Linux, macOS
- ✅ **Zero configuração** - Já vem com .NET, só precisa executar a aplicação

O banco é criado automaticamente quando você roda `dotnet run` pela primeira vez através do método `EnsureCreated()` no `Program.cs`.

### Migrando para Produção

Se precisar usar SQL Server, PostgreSQL ou MySQL em produção, basta:
1. Alterar a connection string no `appsettings.Production.json`
2. Mudar de `UseSqlite()` para `UseSqlServer()`/`UseNpgsql()`/`UseMySql()` no `Program.cs`
3. Adicionar o pacote NuGet correspondente

## 📊 Modelo de Dados

### User
- Id, Email, PasswordHash
- FirstName, LastName
- Role (Patient, Doctor, Admin)
- Specialization, LicenseNumber (para médicos)
- PhoneNumber, Location, Bio
- CreatedAt, IsActive

### Consultation
- Id, PatientId, DoctorId
- Subject, Description
- Status (Pending, Scheduled, InProgress, Completed, Cancelled)
- ScheduledAt, CreatedAt, CompletedAt
- Diagnosis, Prescription, Notes

### Message
- Id, ConsultationId, SenderId
- Content, SentAt
- IsRead

## 🎨 Interface do Usuário

A interface foi desenvolvida com foco em:
- Design moderno e responsivo
- Experiência do usuário intuitiva
- Acessibilidade
- Compatibilidade com dispositivos móveis

## 📦 Build para Produção

### Backend
```bash
cd MedicalVEN.API
dotnet publish -c Release -o ./publish
```

### Frontend
```bash
cd medicalven-frontend
npm run build
```

Os arquivos de produção estarão em `medicalven-frontend/dist/`

## 🔒 Segurança

- Senhas são hash com BCrypt
- Autenticação JWT
- Validação de dados nos endpoints
- CORS configurado
- HTTPS recomendado em produção

## 🤝 Contribuindo

Este é um projeto beneficente. Contribuições são bem-vindas!

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é de código aberto e está disponível para uso beneficente.

## 🆘 Suporte

Para problemas ou dúvidas:
- Verifique a documentação da API em `/swagger`
- Revise os logs da aplicação
- Verifique a configuração do banco de dados

## 🙏 Agradecimentos

Agradecemos a todos os médicos voluntários que dedicam seu tempo para ajudar pessoas na Venezuela através desta plataforma.

---

**MedicalVEN** - Conectando médicos voluntários com pacientes na Venezuela remotamente. ❤️🇻🇪
