# CourseSphere Full Stack 🚀

O CourseSphere é uma plataforma completa para a gestão de cursos online. O sistema permite que instrutores gerenciem turmas, módulos e aulas de forma colaborativa, oferecendo controle sobre o status de publicação dos conteúdos e integração com informações de instrutores convidados.

## 🛠️ Tecnologias Utilizadas

**Backend:**
* Python 3
* FastAPI
* SQLAlchemy (ORM)
* PostgreSQL / SQLite
* Pydantic
* Passlib & Python-jose (Segurança e JWT)

**Frontend:**
* React (Vite)
* Tailwind CSS
* React Router DOM
* Axios

**Infraestrutura:**
* Docker & Docker Compose

## ⚙️ Como Rodar o Projeto

Para rodar a aplicação completa, você precisará utilizar três terminais distintos para gerenciar a infraestrutura, o serviço de backend e a interface de frontend.


### 1. Configurar o .env
Na pasta server crie um arquivo e nomeie ele como .env:
```bash
#Copie e cole no seu .env
DATABASE_URL=
SECRET_KEY=
```

### 2. Infraestrutura (Docker)
No primeiro terminal, na raiz do projeto, inicie o container responsável pelo banco de dados:
```bash
# Sobe o banco de dados e dependências de infra
docker compose up --build
```
*(Mantenha este terminal aberto e rodando).*

### 2. Backend (FastAPI)
No segundo terminal, acesse a pasta `backend`, configure o ambiente virtual e inicie a API:
```bash
cd backend

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# No Windows: venv\Scripts\activate
# No Linux/Mac: source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Iniciar servidor
uvicorn main:app --reload
```
A API estará disponível em: `http://localhost:8000`

### 3. Frontend (React)
No terceiro terminal, acesse a pasta `frontend` e inicie a interface:
```bash
cd frontend

# Instalar dependências do Node
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```
A interface estará disponível em: `http://localhost:5173`

---
*Solução técnica para o desafio de desenvolvedor Full Stack V-lab*