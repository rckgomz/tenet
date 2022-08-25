#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE USER tenet WITH PASSWORD 'password';
	CREATE DATABASE acquisition;
	GRANT ALL PRIVILEGES ON DATABASE acquisition TO tenet;
EOSQL