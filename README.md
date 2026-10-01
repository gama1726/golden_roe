# Golden Roe

Персональный сайт Эльвиры Вартановой. Публичный сайт и админка общаются с Laravel только через JSON API.

Сейчас готовы backend, админка и публичный сайт.

## Архитектура

```
frontend/   Next.js, публичный сайт
admin/      Vite + React, админка
backend/    Laravel 13, PHP 8.3, REST /api/v1
```

Локально MySQL 8 и Redis поднимаются через Docker Compose. Прод к Docker не привязан: нужен VPS с PHP 8.3+, MySQL 8, Composer и SSL.

Контент, которого нет в ТЗ, в базу не записывается. Пустые поля остаются `null`, их заполняют в админке.

## Структура backend

```
backend/app/Http/Controllers/Api/V1          публичные эндпоинты
backend/app/Http/Controllers/Api/V1/Admin    админка
backend/app/Http/Requests                    валидация
backend/app/Http/Resources                   JSON
backend/app/Policies/AdminContentPolicy.php  доступ только у роли admin
backend/app/Services                         санитайзер HTML, картинки, ссылки контактов, кеш
backend/database/seeders/ContentSeeder.php   только согласованные факты
backend/database/seeders/DemoReviewSeeder.php  фиктивный отзыв, в обычный сид не входит
```

## Локальный запуск backend

Нужны PHP 8.3 с расширениями `pdo_mysql`, `gd`, `mbstring`, `openssl`, `fileinfo`, Composer и Docker.

```bash
docker compose up -d mysql redis
cd backend
cp .env.example .env
php artisan key:generate
```

В `.env` задайте `ADMIN_PASSWORD`, затем:

```bash
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

API: `http://127.0.0.1:8000`  
OpenAPI: `http://127.0.0.1:8000/docs/api`

Локальный админ из текущего `.env` (файл в git не входит): `admin@goldenroe.local` / `local-dev-only`. Перед продакшеном пароль нужно сменить.

`SESSION_DOMAIN` локально оставьте пустым. Cookie тогда привязывается к хосту, который открыт в браузере.

## Локальный запуск админки

Нужен уже запущенный API на порту 8000. Vite проксирует `/api`, `/sanctum` и `/storage` на него, поэтому браузер остаётся на одном origin и cookie Sanctum работает.

```bash
cd admin
npm install
npm run dev
```

Админка: `http://127.0.0.1:5173`  
Вход: `admin@goldenroe.local` / `local-dev-only`

Разделы: главная, услуги, об авторе, статьи (TipTap), отзывы, контакты, документы, настройки. Публичный показ отзывов выключен, пока в настройках не включён `reviews_enabled`.

## Локальный запуск сайта

Нужен уже запущенный API на порту 8000.

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Сайт: `http://127.0.0.1:3000`

Страницы: `/`, `/uslugi`, `/ob-avtore`, `/stati`, `/stati/{slug}`, `/otzyvy`, `/kontakty`, `/documents/{type}`. «Узнать подробнее» открывает контакты с выбранной услугой. Пустые тексты на сайте не подменяются. PDF отдаётся по адресу сайта, если файл загружен в админке.

Сброс кеша: `POST /api/revalidate` с заголовком `X-Revalidate-Token`. В backend для этого задаются `FRONTEND_REVALIDATE_URL` и `FRONTEND_REVALIDATE_SECRET`, секрет должен совпадать с `REVALIDATE_SECRET` сайта.

Проверка:

```bash
cd backend
php artisan test
```

## Сиды

`ContentSeeder` создаёт hero, две услуги, четыре факта об авторе, контакты, пустые юридические документы и `reviews_enabled = false`.

Повторный запуск не перезаписывает уже существующие строки.

Фиктивный отзыв:

```bash
php artisan db:seed --class=DemoReviewSeeder
```

Это тестовые данные. На сайт их не выкладывать.

## Переменные окружения

| Переменная | Назначение |
|---|---|
| `APP_URL` | базовый URL API, из него собираются ссылки на картинки |
| `DB_*` | MySQL |
| `SANCTUM_STATEFUL_DOMAINS` | домены админки, которым выдаётся cookie-сессия |
| `CORS_ALLOWED_ORIGINS` | origin публичного сайта и админки |
| `SESSION_DOMAIN` | общий домен cookie, на проде `.goldenroe.ru` |
| `SESSION_SECURE_COOKIE` | `true` на HTTPS |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | первый администратор, пароль только в `.env` |
| `FRONTEND_REVALIDATE_URL` | необязательный сброс кеша Next.js |
| `FRONTEND_REVALIDATE_SECRET` | секрет этого запроса |

## API

Публично:

- `GET /api/v1/home`
- `GET /api/v1/services`
- `GET /api/v1/services/{id}`
- `GET /api/v1/author`
- `GET /api/v1/articles?page=1` — по 6
- `GET /api/v1/articles/{slug}`
- `GET /api/v1/reviews` — пусто, пока `reviews_enabled = false` или отзыв не одобрен
- `POST /api/v1/reviews` — статус `pending`, honeypot-поле `website`, лимит 5 запросов в минуту
- `GET /api/v1/contacts` — `display` и `url`
- `GET /api/v1/documents`
- `GET /api/v1/documents/{type}`
- `GET /api/v1/seo`

Админка, cookie-сессия Sanctum. Сначала `GET /sanctum/csrf-cookie`, затем `POST /api/v1/admin/login` с заголовком `X-XSRF-TOKEN`. Логин ограничен 5 неудачными попытками в минуту.

Дальше префикс `/api/v1/admin`: услуги, статьи, отзывы, баннеры, тексты страниц, факты автора, контакты, документы, настройки, загрузка изображений.

HTML статей очищается на сервере. Картинки проверяются по MIME и размеру, сохраняются со случайным именем, рядом пишутся WebP-версии. Оригинал не перерисовывается. PDF документов отдаются по постоянному адресу `/api/v1/documents/{type}`.

## Сквозные проверки

Нужны запущенные API (`127.0.0.1:8000`), админка (`127.0.0.1:5173`) и сайт (`127.0.0.1:3000`).

```bash
cd frontend
npm run test:e2e
```

Сценарии: главная → услуга → WhatsApp и Telegram; правка текста в админке появляется на сайте и затем убирается; отзыв скрыт, пока его не одобрят и не включат показ. Проверочные данные тесты удаляют.

OpenAPI: `http://127.0.0.1:8000/docs/api`

## Выкладка

Прод не зависит от Docker. На сервере нужны PHP 8.3-FPM, MySQL 8, Node.js для сборки сайта и админки, nginx и сертификат.

Пример nginx: `deploy/nginx/goldenroe.conf`. API слушает только `127.0.0.1:8080`. Сайт проксируется на Next.js. Админка отдаёт собранный `admin/dist` и проксирует `/api`, `/sanctum` и `/storage` на API, чтобы cookie сессии оставалась на домене админки.

Перед запуском:

- `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL` — адрес API, как его видит браузер админки через прокси
- `SESSION_SECURE_COOKIE=true`
- `SANCTUM_STATEFUL_DOMAINS` — только домен админки, без публичного сайта
- `CORS_ALLOWED_ORIGINS` — адрес публичного сайта, с него уходит форма отзыва
- `FRONTEND_REVALIDATE_URL` и `FRONTEND_REVALIDATE_SECRET` совпадают с `REVALIDATE_SECRET` сайта
- `php artisan migrate --force`, `php artisan storage:link`, `php artisan config:cache`
- `npm run build` в `frontend`, затем `npm run start`
- `npm run build` в `admin`

Сертификат: `certbot --nginx -d goldenroe.ru -d www.goldenroe.ru -d admin.goldenroe.ru`

Резервная копия базы, картинок и PDF:

```bash
BACKEND_DIR=/var/www/goldenroe/backend BACKUP_DIR=/var/backups/goldenroe \
DB_DATABASE=golden_roe DB_USERNAME=golden DB_PASSWORD=... \
  sh deploy/backup.sh
```

Скрипт хранит архивы 14 дней. Каталог резервных копий не должен быть доступен из nginx.
