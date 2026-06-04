# Vaultline

Vaultline - це стартовий прототип захищеної файлової платформи у стилі приватної соціальної мережі. Ідея продукту: не просто зберігати файли на власному сервері, а дати користувачам профілі, стрічку активності, робочі простори, коментарі, реакції, підписки, приватні повідомлення та контрольований публічний шар.

## Швидкий запуск

```bash
npm start
```

Після запуску відкрий:

```text
http://localhost:4173
```

Демо-акаунти:

```text
admin@vaultline.local / Admin123!
demo@vaultline.local / Demo123!
```

## Що реалізовано у прототипі

- Реєстрація, вхід, вихід, forgot password flow-заглушка.
- Secure HttpOnly session cookie, CSRF token для mutating API, security headers.
- Хешування паролів через `crypto.scrypt` для прототипу. У production треба перейти на Argon2id або bcrypt.
- Drag & drop завантаження кількох файлів.
- Папки, теги, пошук, фільтри, приватні/публічні/link файли.
- Тимчасові signed links на 4 години.
- Preview для зображень, відео, PDF і текстових файлів.
- Коментарі, реакції, стрічка активності.
- Профіль користувача, підписки API-ready, групи/простори.
- Приватні повідомлення, сповіщення.
- Quota per user, кошик і restore.
- Базова адмінка: статистика, користувачі, блокування, audit logs, системні налаштування.

## Дороблено для ukrainecommunity.pp.ua

- Оновлено `start-vaultline-domain.bat` для запуску платформи в режимі домену `ukrainecommunity.pp.ua` за HTTPS reverse proxy або Cloudflare Tunnel.
- Оновлено `nginx-ukrainecommunity.conf`: HTTPS redirect, security headers, connection limits, окремий rate limit для auth і signed links.
- Додано brute-force lockout: після серії невдалих входів акаунт тимчасово блокується.
- Нові session tokens і signed-link tokens зберігаються у `data/db.json` тільки як SHA-256 hash; старі сирі токени прибираються при старті.
- Додано перевірку Origin/Referer для mutating API, bot-trap timestamp у формах, сильнішу політику паролів для нових акаунтів.
- Розширено мовний селектор до 35 мов із українською як стандартною мовою.
- Додано акуратну reaction UI: сіре контурне сердечко, рожевий liked-state і м'яка анімація натискання.

## MVP

1. Auth: register, login, logout, password reset email, 2FA enrollment.
2. User dashboard: storage usage, recent files, notifications, profile status.
3. File manager: upload, folders, tags, search, filters, trash, restore.
4. Access control: private, public, shared with users, signed expiring links.
5. Preview: images, video, PDF, text, safe downloads.
6. Social layer: activity feed, comments, reactions, follows.
7. Workspaces: groups with members, shared files and discussions.
8. Admin: users, roles, blocking, quotas, moderation, logs, reports.
9. Security baseline: rate limits, CSRF, XSS protection, audit logs, HTTPS, backups.

## Майбутні версії

- Paid plans: Free, Family, Team, Business.
- Family spaces and team spaces with shared quotas.
- Temporary drop-zones for external uploads.
- End-to-end encrypted notes and encrypted collections.
- Galleries, albums, public portfolios.
- AI search across filenames, metadata and extracted text.
- OCR for PDFs and images.
- File versioning and rollback.
- Watermarking for public assets.
- Device sessions, session revoke, risk scoring.
- Mobile PWA and offline preview cache.
- Desktop sync app.
- Public API, webhooks and integrations.
- Legal holds, retention policies and enterprise audit exports.

## Рекомендований production stack

- Frontend: Next.js, React, TypeScript, TanStack Query, Tailwind or CSS modules.
- Backend: NestJS або Laravel/Django, залежно від команди.
- Database: PostgreSQL.
- Cache/queue: Redis + BullMQ/Celery.
- File storage: S3-compatible storage, MinIO for self-hosted, or encrypted local storage for small installs.
- Auth: secure session cookies, Argon2id/bcrypt, TOTP 2FA, optional WebAuthn.
- Reverse proxy: Nginx or Caddy.
- TLS: Let's Encrypt.
- Deployment: Docker Compose for MVP, Kubernetes/Nomad for scale.
- Email: SMTP provider for verification, password reset and security alerts.
- Antivirus: ClamAV sidecar scanner.
- Observability: OpenTelemetry, Prometheus, Grafana, Sentry.

## Архітектура системи

```text
Browser / PWA
  -> Next.js frontend
  -> API gateway / reverse proxy
  -> Backend app
      -> PostgreSQL
      -> Redis
      -> Object storage / MinIO / S3
      -> Queue workers
          -> antivirus scan
          -> thumbnails
          -> OCR
          -> email notifications
```

Основний принцип: приватні файли ніколи не лежать у web-public директорії. Кожне відкриття або завантаження проходить через backend authorization або через короткоживучий signed URL.

## Схема бази даних

```sql
users(id, email, password_hash, name, avatar_url, bio, role, status, quota_bytes, used_bytes, two_factor_secret, two_factor_enabled, created_at)
sessions(id, user_id, token_hash, csrf_token_hash, ip, user_agent, expires_at, created_at)
password_resets(id, user_id, token_hash, expires_at, used_at)
files(id, owner_id, storage_key, original_name, mime, size, checksum, visibility, folder_id, deleted_at, created_at, updated_at)
folders(id, owner_id, parent_id, name, created_at)
tags(id, owner_id, name)
file_tags(file_id, tag_id)
file_shares(id, file_id, user_id, role, created_by, expires_at)
signed_links(id, file_id, token_hash, created_by, expires_at, max_downloads, downloads_count)
collections(id, owner_id, name, description, visibility, created_at)
collection_items(collection_id, file_id, position)
comments(id, author_id, target_type, target_id, body, status, created_at)
reactions(id, user_id, target_type, target_id, type, created_at)
follows(follower_id, following_id, created_at)
groups(id, owner_id, name, description, visibility, created_at)
group_members(group_id, user_id, role, created_at)
messages(id, sender_id, recipient_id, group_id, body, created_at, read_at)
notifications(id, user_id, type, body, link_url, read_at, created_at)
reports(id, reporter_id, target_type, target_id, reason, status, created_at)
audit_logs(id, actor_id, action, ip, user_agent, metadata_json, created_at)
settings(key, value_json, updated_at)
```

## API структура

```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/forgot
GET    /api/me
GET    /api/bootstrap

GET    /api/files
POST   /api/files
GET    /api/files/:id
PATCH  /api/files/:id
DELETE /api/files/:id
POST   /api/files/:id/restore
GET    /api/files/:id/raw
POST   /api/files/:id/signed
POST   /api/files/:id/comment
POST   /api/files/:id/react
GET    /s/:token

GET    /api/feed
GET    /api/users/:id
POST   /api/users/:id/follow
GET    /api/groups
POST   /api/groups
POST   /api/messages
PATCH  /api/settings/security

GET    /api/admin/stats
GET    /api/admin/users
PATCH  /api/admin/users/:id
GET    /api/admin/files
GET    /api/admin/logs
```

## Frontend сторінки

- `/login`, `/register`, `/forgot-password`
- `/dashboard`
- `/files`
- `/files/:id`
- `/feed`
- `/profile`
- `/u/:username`
- `/groups`
- `/groups/:id`
- `/shared`
- `/notifications`
- `/messages`
- `/settings`
- `/billing`
- `/admin`
- `/admin/users`
- `/admin/files`
- `/admin/reports`
- `/admin/logs`
- `/admin/settings`
- `/404`, `/500`

У прототипі це SPA hash routes, щоб запуск був максимально простим без build step.

## UI/UX напрям

Інтерфейс має бути тихим, дорогим і робочим: темний графіт, білий, холодний сірий, легкий cyan accent, glass-панелі без надмірних градієнтів, 8-14px radius, багато повітря, чіткі таблиці, швидкі hover states, темна/світла тема. Dashboard фокусується на стані сховища та останній активності. File manager не ховає важливі дії: upload, visibility, signed link, preview, trash.

## План безпеки

1. Password hashing: Argon2id або bcrypt з cost policy.
2. Sessions: HttpOnly, Secure, SameSite=Lax/Strict cookies; rotation after login and privilege change.
3. CSRF: per-session token for POST/PATCH/DELETE.
4. XSS: escaping, CSP, no unsafe user HTML.
5. Rate limiting: login, password reset, signed link access, uploads.
6. Brute force protection: IP + account throttling, security notifications.
7. File validation: MIME sniffing, extension policy, max size, checksum.
8. Antivirus: ClamAV scan before file becomes available.
9. Storage isolation: private storage outside public web root.
10. Signed URLs: short TTL, optional max downloads and IP binding.
11. Encryption: sensitive settings at rest, optional per-user file encryption.
12. Audit logs: auth, upload, delete, share, admin actions.
13. HTTPS required.
14. Backups: encrypted, tested restore, separate retention windows.

## Деплой і домен

### Варіант 1: VPS, рекомендовано

1. Купити VPS з Ubuntu LTS.
2. Налаштувати DNS A-record: `app.example.com -> VPS IP`.
3. Запустити Docker Compose: app, PostgreSQL, Redis, MinIO, ClamAV.
4. Поставити Nginx/Caddy як reverse proxy.
5. Увімкнути HTTPS через Let's Encrypt.
6. Обмежити firewall: 22, 80, 443.
7. Увімкнути backups і monitoring.

Плюси: найкращий баланс контролю, стабільності, безпеки й масштабування. Мінуси: треба адмініструвати сервер.

### Варіант 2: домашній комп'ютер зі статичною IP

1. Отримати статичну IP або DDNS.
2. Прописати DNS A-record на IP.
3. Налаштувати port forwarding 80/443 на роутері.
4. Поставити Nginx/Caddy і HTTPS.
5. Винести storage на окремий диск, налаштувати backups.

Плюси: повний фізичний контроль і дешевий старт. Мінуси: ризики домашньої мережі, електрика, провайдер, DDoS, відкриті порти. Безпечніше за все тримати у DMZ/VLAN і не відкривати зайві сервіси.

### Варіант 3: Cloudflare Tunnel без статичної IP

1. Додати домен у Cloudflare.
2. Запустити `cloudflared tunnel` на сервері.
3. Прив'язати hostname до tunnel.
4. Увімкнути Cloudflare Access для адмінки або staging.

Плюси: не потрібна статична IP, не треба відкривати порти, є додатковий edge-захист. Мінуси: залежність від Cloudflare, треба правильно налаштувати real IP, upload limits і приватність. Для домашнього сервера це безпечніше, ніж port forwarding.

## Масштабування

- Move JSON prototype store to PostgreSQL.
- Move uploaded files to MinIO/S3.
- Add Redis queues for scans, thumbnails, OCR and notifications.
- Add CDN only for public thumbnails and signed public assets.
- Horizontal backend scaling with sticky-free session storage.
- Background workers for previews and media transcoding.
- Partition audit logs and file metadata for large installs.

## Обмеження прототипу

Це робочий MVP-прототип, а не production-ready security release. Він спеціально не використовує npm-пакети, щоб запускатися одразу. Для реального запуску треба замінити JSON database на PostgreSQL, `scrypt` на Argon2id/bcrypt, додати rate limiting, antivirus scan, SMTP, реальний TOTP QR enrollment, Secure cookies behind HTTPS і повноцінний storage backend.
