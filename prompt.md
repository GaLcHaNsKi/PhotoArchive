Ты — senior full-stack engineer. Твоя задача — спроектировать и реализовать self-hosted систему фотоархива для организации.

Система должна позволять:
- администраторам загружать фотографии и статьи
- пользователям просматривать публичный архив
- хранить фото, альбомы, статьи и категории
- обеспечивать безопасность и простую масштабируемость

---

# ТЕХНОЛОГИИ

Backend:
- TypeScript
- Bun
- Hono (web framework)
- Prisma ORM
- PostgreSQL

Frontend:
- Next.js (App Router)

Storage:
- файловая система (локальные диски)
- относительные пути в БД
- абсолютные пути через .env

Image processing:
- Sharp (генерация thumbnails и previews)

---

# АРХИТЕКТУРА (ОБЯЗАТЕЛЬНО)

Проект должен быть разделён на модули:

backend/
  modules/
    auth/
    users/
    albums/
    photos/
    articles/
    categories/
    storage/
    audit-log/
    common/

frontend/
  app/
  components/
  modules/

---

# ЖЁСТКИЕ ОГРАНИЧЕНИЯ

1. Каждый файл кода должен быть не более 300–400 строк.
   - Если модуль растёт — разделяй на подмодули.
   - НЕЛЬЗЯ создавать “god files”.

2. Каждый модуль должен иметь:
   - controller (HTTP layer)
   - service (business logic)
   - repository (DB access)
   - types / dto

3. Никакой бизнес-логики в controllers.

4. Prisma schema должна быть аккуратно структурирована.

---

# МОДЕЛИ БД

Обязательные сущности:

User
- id
- username
- password_hash
- role (enum: root, admin)
- created_at
- updated_at
- last_login_at
- is_active

Category
- id
- name
- slug

Album
- id
- title
- slug
- description
- year
- event_date
- visibility (public/private)
- category_id
- tags (string[])
- cover_photo_id
- created_by
- created_at
- updated_at
- published_at
- deleted_at

Photo
- id
- album_id (nullable)
- article_id (nullable)
- title
- description
- original_path (relative)
- preview_path (relative)
- thumbnail_path (relative)
- original_filename
- mime_type
- size_bytes
- width
- height
- sha256
- status (uploading/processing/ready/failed)
- uploaded_by
- taken_at
- created_at
- deleted_at

Article
- id
- title
- slug
- summary
- content_html
- cover_photo_id
- album_id (nullable)
- tags (string[])
- visibility
- created_by
- created_at
- updated_at
- published_at
- deleted_at

AuditLog (file-based, JSON lines)
- timestamp
- user_id
- action
- entity_type
- entity_id
- metadata

---

# STORAGE

- В БД хранятся ТОЛЬКО относительные пути
- Абсолютные пути задаются через .env

Пример:
STORAGE_ROOT=/mnt/storage
ORIGINALS_PATH=/originals
PREVIEWS_PATH=/previews
THUMBNAILS_PATH=/thumbnails

Структура файлов:
originals/YYYY/MM/uuid.jpg
previews/YYYY/MM/uuid.webp
thumbnails/YYYY/MM/uuid.webp

---

# IMAGE PIPELINE

При загрузке фото:

1. сохранить оригинал на HDD
2. вычислить sha256
3. создать preview (средний размер)
4. создать thumbnail (маленький)
5. сохранить metadata в PostgreSQL
6. установить status = ready

Важно:
- thumbnails и previews всегда генерируются ОДИН раз
- не генерировать их на лету

---

# ARTICLES

- статьи используют обычные Photo (не отдельные assets)
- изображения вставляются через reference photo_id
- HTML хранится в content_html
- обязательно sanitize HTML (защита от XSS)

---

# API ПРАВИЛА

- REST API
- versioning: /api/v1
- auth через JWT или session cookie
- role-based access control (root/admin/user)

---

# FRONTEND

- Next.js
- публичная часть: просмотр альбомов и статей
- admin panel: загрузка и управление архивом
- lazy loading изображений
- infinite scroll для галереи
- responsive grid layout

---

# БЕЗОПАСНОСТЬ

Обязательно:
- password hashing (argon2 или bcrypt)
- input validation
- file type validation
- size limits
- rate limiting
- HttpOnly cookies
- CSRF protection (если cookies)

---

# ЛОГИ

- audit log пишется в JSONL файлы
- файл на день:
  logs/YYYY-MM-DD.log
- каждая строка = JSON event

---

# НЕ ДЕЛАТЬ

- никаких микросервисов
- никакого Kubernetes
- никакого event-driven architecture
- никакого overengineering

---

# ЦЕЛЬ MVP

Сделать работающую систему:

ADMIN:
- login
- upload photos
- create albums
- assign categories
- write articles

USER:
- view albums
- view photos
- read articles
- search albums

---

# ВАЖНО

- код должен быть максимально модульным
- каждый модуль независим
- логика строго разделена
- файлы ≤ 400 строк
- никаких “монолитных сервисов”

Начни с генерации архитектуры проекта и структуры папок, затем Prisma schema, затем базовых модулей auth + albums + photos.