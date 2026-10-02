#!/bin/sh
set -eu

cd /var/www/html

if [ ! -f vendor/autoload.php ]; then
  composer install --no-interaction --prefer-dist
fi

if [ ! -f .env ]; then
  cp .env.example .env
fi

if ! php -r 'exit(preg_match("/^APP_KEY=.+/m", file_get_contents(".env")) ? 0 : 1);'; then
  php artisan key:generate --no-interaction --force
fi

php artisan storage:link --no-interaction || true

i=0
until php -r 'try { new PDO("mysql:host=".getenv("DB_HOST").";port=".getenv("DB_PORT").";dbname=".getenv("DB_DATABASE"), getenv("DB_USERNAME"), getenv("DB_PASSWORD")); } catch (Throwable $e) { fwrite(STDERR, $e->getMessage().PHP_EOL); exit(1); }'; do
  i=$((i + 1))
  if [ "$i" -gt 30 ]; then
    echo "MySQL is not ready" >&2
    exit 1
  fi
  sleep 2
done

php artisan migrate --seed --force --no-interaction

exec php artisan serve --host=0.0.0.0 --port=8000
