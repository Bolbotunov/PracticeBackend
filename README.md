# PracticeBackend — Full-Stack Auth Application

Full-stack приложение для аутентификации и авторизации пользователей. JWT-флоу с access и refresh токенами (HttpOnly cookie).

---

## О проекте

Monorepo из двух частей:

- **Backend** — REST API на Express 5 с JWT, Zod-валидацией и Prisma ORM (PostgreSQL)
- **Frontend** — SPA на Next.js 16 + React 19 + Tailwind CSS 4

**Возможности:**

- Регистрация и вход пользователей
- JWT access token (Bearer) + refresh token (HttpOnly cookie)
- Автоматический refresh сессии на фронтенде
- Защищённые маршруты
- Валидация данных (Zod)
- Docker-окружение для БД
- API тесты (Vitest + Supertest)
- Swagger / OpenAPI документация
- Git hooks (Husky + Commitlint + Lint-staged)

---

## Быстрый старт

### Требования

- Node.js >= 20
- npm >= 9
- Docker Desktop

### 1. Установка зависимостей

```bash
npm run install:all
```

### 2. Запуск БД

```bash
docker compose up -d
```

PostgreSQL 16 на порту 5432, Adminer на http://localhost:8080.

### 3. Настройка окружения

Файл `backend/.env` уже присутствует. При необходимости отредактируйте.

### 4. Миграции Prisma

```bash
cd backend && npx prisma migrate dev
```

### 5. Запуск

```bash
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- Swagger: http://localhost:5000/api-docs

---

## Структура проекта

```
PracticeBackend/
├── backend/
│   ├── src/
│   │   ├── controllers/        # Обработчики запросов
│   │   ├── generated/prisma/   # Prisma Client
│   │   ├── lib/                # Утилиты и конфиги (env, prisma, swagger)
│   │   ├── middleware/         # Express middleware (auth, validate, errors)
│   │   ├── routes/             # Маршруты API
│   │   ├── schemas/            # Zod-схемы валидации
│   │   ├── services/           # Бизнес-логика
│   │   ├── tests/              # Vitest-тесты
│   │   ├── utils/              # JWT-утилиты
│   │   └── index.ts            # Точка входа
│   ├── prisma/                 # Prisma schema + миграции
│   └── package.json
├── frontend/
│   ├── app/                    # Next.js App Router
│   │   ├── login/              # Страница входа
│   │   ├── register/           # Страница регистрации
│   │   ├── profile/            # Защищённая страница профиля
│   │   └── page.tsx            # Главная
│   ├── components/             # UI-компоненты
│   ├── context/                # AuthContext
│   ├── lib/                    # API-клиент
│   ├── types/                  # TypeScript типы
│   └── utils/                  # cn()
├── docker-compose.yml
├── commitlint.config.mjs
└── package.json
```

---

## Backend

### Технологии

| Компонент       | Технология                   |
| --------------- | ---------------------------- |
| Runtime         | Node.js + TypeScript 6       |
| Фреймворк       | Express 5                    |
| ORM             | Prisma 7 + PostgreSQL        |
| Аутентификация  | JWT + bcrypt                 |
| Валидация       | Zod 4                        |
| Тесты           | Vitest + Supertest           |
| Документация    | Swagger (OpenAPI)            |
| Dev-инструменты | tsx, ESLint, Prettier, Husky |

### API Endpoints

| Метод | Путь           | Аутентиф. | Описание                      |
| ----- | -------------- | --------- | ----------------------------- |
| POST  | /auth/register | Нет       | Регистрация                   |
| POST  | /auth/login    | Нет       | Вход                          |
| POST  | /auth/logout   | Нет       | Выход (очистка cookie)        |
| GET   | /auth/me       | Bearer    | Профиль текущего пользователя |
| POST  | /auth/refresh  | Cookie    | Обновление access token       |

Подробная документация: http://localhost:5000/api-docs

### Команды

```bash
npm run dev          # разработка (tsx watch)
npm run build        # сборка
npm run test         # тесты (Vitest)
npm run format       # Prettier
npm run lint         # ESLint
npm run typecheck    # проверка типов
```

---

## Frontend

### Технологии

| Компонент  | Технология                 |
| ---------- | -------------------------- |
| Фреймворк  | Next.js 16 (App Router)    |
| UI         | React 19                   |
| Стилизация | Tailwind CSS 4 + Turbopack |
| Язык       | TypeScript 5               |
| Утилиты    | clsx, tailwind-merge       |

### Страницы

| Путь      | Описание    | Доступ                |
| --------- | ----------- | --------------------- |
| /         | Главная     | Все                   |
| /login    | Вход        | Неавторизованные      |
| /register | Регистрация | Неавторизованные      |
| /profile  | Профиль     | Только авторизованные |

### Команды

```bash
npm run dev          # разработка
npm run build        # продакшен-сборка
npm run start        # запуск сборки
npm run lint         # ESLint
```

---

## Docker

```bash
docker compose up -d       # запуск PostgreSQL + Adminer
docker compose down        # остановка
docker compose down -v     # остановка + удаление данных
```

- **PostgreSQL:** localhost:5432 / admin / admin123 / auth_db
- **Adminer:** http://localhost:8080

---

## Тестирование

Backend покрыт тестами (Vitest + Supertest):

- Регистрация и дубликаты
- Zod-валидация
- Логин, JWT + refresh cookie
- Защищённые маршруты
- Refresh-сессия
- Logout

```bash
npm run test          # все тесты
npm run test:watch    # watch-режим
npm run test:ui       # UI-панель
```

---

## Разработка

### Git Hooks

- **pre-commit:** lint-staged -> typecheck -> test
- **commit-msg:** проверка Commitlint (Conventional Commits)

Формат: `type(scope): message`

### Линтеры

```bash
npm run lint && npm run format && npm run typecheck
```

---

## Лицензия

MIT
