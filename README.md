# chat-app
The chat app is a mini version of a simple chat app that can chat with individuals and multiple persons.

A real-time chat application built with **React (Vite)** on the frontend and **Django (DRF)** on the backend. Features include 1-to-1 and group chats, role-based access control, JWT authentication, and an admin panel for managing users.

---

## Tech Stack

### Frontend
- React (Vite)
- Redux Toolkit
- React Router
- Material UI (MUI)
- Formik
- Socket.io-client
- Axios

### Backend
- Django
- Django REST Framework (DRF)
- Simple JWT Authentication
- Django Channels (optional for real-time)
- PostgreSQL or SQLite

---

## Features

- JWT Auth (Login/Register)
- 1-to-1 and Group Messaging
- Admin Panel (User management)
- Real-Time Chat (with Socket.io or Django Channels)
- File attachments
- Search users to start chats
- Lazy loading, memoization, and code-splitting for performance

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18.x
- Python ≥ 3.9
- pip or pipenv

---

## Frontend Setup

```cd chat-app-react```

### Install dependencies
```npm install```

### Start the Vite dev server
```npm run dev```

# Backend Setup

```cd chat_app_django```

## Create virtual environment
```python -m venv venv```
```source venv/bin/activate```
# for Quick Start
``` chmod +x start.sh && ./start.sh ```

## Install dependencies
```pip install -r requirements.txt```

## Run migrations
```python manage.py migrate```

## Create Admin
```python manage.py shell```

```from django.contrib.auth import get_user_model```
```User = get_user_model()```
```admin_user = User.objects.create_user(username="admin",password="240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9",role="admin",is_superuser=True)```

## Start Django server
```python manage.py runserver```

# Defualt Server Address

## Development
```http://localhost:5173```

## Production
```http://localhost:3000```

# Admin Credential
- username : admin
- password : admin123