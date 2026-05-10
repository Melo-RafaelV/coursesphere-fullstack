# CourseSphere Full Stack 🚀

Desafio Técnico desenvolvido para o processo seletivo da **V-lab**. O CourseSphere é uma plataforma de gestão colaborativa de cursos online, permitindo que instrutores criem turmas, gerenciem o status de suas aulas e contem com a participação de instrutores convidados.

## Funcionalidades e Diferenciais Implementados

Este projeto atende a **100% dos requisitos obrigatórios** do edital e implementa diversos diferenciais de nível Pleno/Sênior:

### Autenticação e Segurança
* **Autenticação JWT:** Sistema completo de Registro e Login com hash de senhas (Passlib/Bcrypt).
* **Proteção de Rotas:** Frontend e Backend protegidos; apenas usuários autenticados acessam o dashboard.
* **Autorização (Regra de Negócio):** Apenas o criador de um curso pode editá-lo, excluí-lo ou gerenciar suas aulas.

### Gestão de Cursos (CRUD Completo)
* Criação de cursos com validação de datas (término >= início).
* Listagem de cursos (Dashboard) com **Busca por Nome**.
* Edição de curso via Modal (Diferencial).
* Exclusão de curso (com proteção de criador).
* **Bugfix:** Tratamento avançado de *Timezone Shift* no frontend para garantir que as datas sejam exibidas com precisão, independentemente do fuso horário local.

### Gestão de Aulas (CRUD Completo)
* Criação de aulas associadas a um curso específico.
* **Validação Estrita:** Uso de *Regex* para garantir que a URL do vídeo (quando fornecida) seja um link web válido, rejeitando strings falsas.
* **Update de Aula (Diferencial):** Edição de aulas implementada reutilizando o componente de modal para melhor manutenibilidade.
* Exclusão individual de aulas.
* **Filtros:** Filtro dinâmico no frontend por status da aula (*Todas, Publicadas, Rascunhos*).

### Integração Externa
* Consumo direto no frontend da **RandomUser API** (`https://randomuser.me/api/`) para exibir um "Instrutor Convidado" aleatório em cada visualização de curso, cumprindo a exigência sem poluir o banco de dados.

### UX/UI
* Interface responsiva em **Dark Mode** com design moderno utilizando Tailwind CSS.
* Feedback visual para o usuário (loading spinners, mensagens de erro elegantes e validações de formulário em tempo real).
* Componentização via Modais para evitar quebras de fluxo de navegação.

---

## Tecnologias Utilizadas

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

---

## Como Rodar o Projeto Localmente

Siga os passos abaixo para testar a aplicação em sua máquina.

### 1. Configurando o Backend
Abra um terminal e acesse a pasta `backend`:
```bash
cd backend

# Crie o ambiente virtual
python -m venv venv

# Ative o ambiente virtual
# No Windows:
venv\Scripts\activate
# No Linux/Mac:
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Inicie o servidor
uvicorn main:app --reload
```
A API estará rodando em: `http://localhost:8000`

### 2. Configurando o Frontend
Abra um **novo terminal** e acesse a pasta `frontend`:
```bash
cd frontend

# Instale as dependências do Node
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```
O painel da aplicação estará disponível em: `http://localhost:5173`

---
*Desenvolvido com dedicação para o desafio técnico V-lab.*