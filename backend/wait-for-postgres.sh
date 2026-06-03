#!/bin/sh
# wait-for-postgres.sh - aguarda banco estar pronto antes de rodar migração

set -e

host="$1"
port="${2:-5432}"
user="$3"
password="$4"
database="$5"

echo "Aguardando PostgreSQL em $host:$port..."

counter=0
max_attempts=30

until PGPASSWORD="$password" psql -h "$host" -p "$port" -U "$user" -d "$database" -c '\q' 2>/dev/null || [ $counter -eq $max_attempts ]; do
  echo "PostgreSQL indisponível, tentando novamente... ($counter/$max_attempts)"
  counter=$((counter + 1))
  sleep 1
done

if [ $counter -eq $max_attempts ]; then
  echo "Timeout esperando PostgreSQL"
  exit 1
fi

echo "PostgreSQL está pronto!"
shift 5
exec "$@"
