# Wdrozenie na RPi5 (PocketBase + Cloudflare + GitHub)

## 1. PocketBase (schema i reguly dostepu)
- Utworz kolekcje `calculator_data`.
- Pola kolekcji:
  - `key` (text, required, unique)
  - `data` (json, required)
  - `last_update` (date, required)
- Reguly (na start, bez logowania):
  - list: `true`
  - view: `true`
  - create: `true`
  - update: `true`
  - delete: puste

## 2. Konfiguracja builda
- Dodaj w `.env.local`:
  - `VITE_POCKETBASE_URL=https://api.gorilla-glue.org`
  - `GEMINI_API_KEY=...`
- Dla produkcji ustaw `VITE_POCKETBASE_URL` na docelowy adres API.

## 3. Deployment na RPi (statyczne pliki w pb_public)
1. Sklonuj repo na RPi, np.:
   - `/home/patryk/Projekty/pbkalk`
2. Uruchom skrypt:
   - `chmod +x scripts/deploy-rpi.sh`
   - `./scripts/deploy-rpi.sh`
3. Skrypt buduje projekt i kopiuje `dist/` do:
   - `/mnt/sql/api/pocketbase/pb_public`
4. Upewnij sie, ze PocketBase serwuje `pb_public`:
   - uruchomienie z katalogu `/mnt/sql/api/pocketbase`
   - lub flaga `--publicDir /mnt/sql/api/pocketbase/pb_public`

## 4. Cloudflare Tunnel (subdomena frontendu)
- Dodaj route w konfiguracji tunelu (przyklad):
  - `kalk.gorilla-glue.org -> http://localhost:8090`
- Tunel moze wskazywac na ten sam PocketBase co API.

## 5. GitHub -> RPi (push na main)
- Workflow: `.github/workflows/deploy-rpi.yml`
- Wymagane sekrety:
  - `RPI_HOST` (adres lub domena)
  - `RPI_USER`
  - `RPI_SSH_KEY` (klucz prywatny)
  - `RPI_PORT` (np. 22)
  - `RPI_PATH` (sciezka do repo na RPi)

## 6. Szybka weryfikacja
- Sprawdz czy `https://kalk.gorilla-glue.org` laduje aplikacje.
- Sprawdz czy zapisywanie danych ustawia status synchronizacji.

## 7. Migracja danych z backupu Supabase (opcjonalnie)
- Backup Supabase jest w repo: `db_cluster-25-12-2025@03-28-08.backup.gz`
- Ekstrakcja do JSON:
  - `node scripts/extract-supabase-calculator-data.js`
- Import do PocketBase:
  - Collections -> `calculator_data` -> Import -> JSON
  - Pola: `key`, `data`, `last_update`
