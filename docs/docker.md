# Panduan Docker Setup — Task Tracker

Dokumentasi ini menjelaskan cara menjalankan seluruh aplikasi **Task Tracker** (PostgreSQL, FastAPI Backend, dan React Frontend) menggunakan Docker dan Docker Compose.

Setup ini dirancang sebagai alternatif kontainerisasi yang mandiri, tanpa mengganggu instalasi manual lokal yang sudah ada.

---

## 1. Arsitektur Docker

Aplikasi diorkestrasi menggunakan `docker-compose.yml` dengan 3 layanan terisolasi:

```text
┌────────────────────────────────────────────────────────┐
│                      Host Machine                      │
│                                                        │
│   Browser: http://localhost:8080                       │
│      │                                                 │
│      │ HTTP (API Requests)                             │
│      ▼                                                 │
│   FastAPI API: http://localhost:8000                   │
│                                                        │
│ ┌─────────────────── Docker Network ─────────────────┐ │
│ │                                                    │ │
│ │  ┌──────────────┐     ┌──────────────┐             │ │
│ │  │   frontend   │     │   backend    │             │ │
│ │  │ (Nginx:80)   │     │(FastAPI:8000)│             │ │
│ │  │ Port: 8080   │     │ Port: 8000   │             │ │
│ │  └──────────────┘     └──────┬───────┘             │ │
│ │                              │                     │ │
│ │                              │ internal TCP:5432   │ │
│ │                              ▼                     │ │
│ │                       ┌──────────────┐             │ │
│ │                       │      db      │             │ │
│ │                       │ (Postgres:16)│             │ │
│ │                       │ Port: 5433   │             │ │
│ │                       └──────┬───────┘             │ │
│ │                              │                     │ │
│ └──────────────────────────────┼─────────────────────┘ │
│                                ▼                       │
│                     [Named Volume: postgres_data]      │
└────────────────────────────────────────────────────────┘
```

- **`db` (PostgreSQL 16 Alpine)**: Menyimpan data task secara persisten menggunakan Docker named volume (`task_tracker_postgres_data`). Dilengkapi healthcheck `pg_isready`.
- **`backend` (Python 3.9 FastAPI)**: Menjalankan migrasi database Alembic (`alembic upgrade head`) secara otomatis sebelum server Uvicorn dimulai. Terhubung ke container `db` melalui jaringan internal Docker.
- **`frontend` (React 19 + Vite + Nginx)**: Dibangun menggunakan multi-stage build Node.js dan disajikan secara efisien lewat Nginx web server dengan dukungan SPA routing fallback.

---

## 2. Prerequisites

Pastikan perangkat Anda telah terpasang:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (macOS / Windows / Linux) versi 20.10+
- Docker Compose v2 atau `docker compose` CLI plugin

Pastikan Docker daemon sedang berjalan:

```bash
docker info
```

---

## 3. Konfigurasi Environment

Aplikasi Docker sudah memiliki konfigurasi default yang siap pakai. Jika Anda ingin menyesuaikan credential database atau port, salin file contoh konfigurasi Docker:

```bash
cp .env.docker.example .env.docker
```

Isi dari `.env.docker.example`:

```env
# Database
POSTGRES_DB=task_tracker
POSTGRES_USER=task_user
POSTGRES_PASSWORD=task_password
POSTGRES_PORT=5433

# Backend
APP_NAME=Task Tracker API
DEBUG=True
DATABASE_URL=postgresql+psycopg://task_user:task_password@db:5432/task_tracker
BACKEND_PORT=8000

# Frontend
VITE_API_BASE_URL=http://localhost:8000
FRONTEND_PORT=8080
```

> [!NOTE]
> Secara default port database host diarahkan ke port `5433` (`5433:5432`) untuk mencegah konflik jika Anda memiliki PostgreSQL lokal yang sudah berjalan di port `5432`.

---

## 4. Cara Menjalankan Aplikasi

Jalankan satu perintah berikut di root project:

```bash
docker compose up --build
```

Atau jika menggunakan file `.env.docker`:

```bash
docker compose --env-file .env.docker up --build
```

Untuk menjalankan container di latar belakang (_detached mode_):

```bash
docker compose up --build -d
```

Compose akan secara otomatis:

1. Menyalakan container database `db` dan menunggu hingga statusnya `healthy`.
2. Membangun image backend dan menjalankan `alembic upgrade head` untuk menerapkan seluruh migrasi schema.
3. Memulai server Uvicorn pada port `8000`.
4. Membangun bundle frontend React dan menyajikannya via Nginx pada port `8080`.

---

## 5. Alamat Akses Layanan

Setelah seluruh container berjalan:

| Layanan                      | URL                                                          | Deskripsi                       |
| :--------------------------- | :----------------------------------------------------------- | :------------------------------ |
| **Frontend Application**     | [http://localhost:8080](http://localhost:8080)               | Antarmuka pengguna Task Tracker |
| **Backend REST API**         | [http://localhost:8000](http://localhost:8000)               | Root API endpoint               |
| **API Health Check**         | [http://localhost:8000/health](http://localhost:8000/health) | Status kesehatan backend        |
| **Interactive Swagger Docs** | [http://localhost:8000/docs](http://localhost:8000/docs)     | Dokumentasi interaktif OpenAPI  |
| **ReDoc Documentation**      | [http://localhost:8000/redoc](http://localhost:8000/redoc)   | Dokumentasi alternatif ReDoc    |

---

## 6. Manajemen dan Monitoring Container

### Melihat Status Container

```bash
docker compose ps
```

### Melihat Log Real-time

Melihat seluruh log:

```bash
docker compose logs -f
```

Melihat log service tertentu:

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

### Menjalankan Ulang Service

```bash
docker compose restart backend
```

### Menjalankan Migrasi Manual (Jika Diperlukan)

Migrasi sudah berjalan otomatis pada saat container start. Namun jika ingin menjalankan migrasi manual di dalam container backend:

```bash
docker compose exec backend alembic upgrade head
```

---

## 7. Menghentikan dan Menghapus Layanan

### Menghentikan Container (Data Tetap Tersimpan)

Perintah ini menghentikan container tanpa menghapus database:

```bash
docker compose down
```

Data task Anda di PostgreSQL tetap tersimpan di dalam named volume `task_tracker_postgres_data`. Saat Anda menjalankan `docker compose up` kembali, seluruh data tetap ada.

### Menghentikan Container dan Menghapus Volume Database

Jika Anda ingin menghapus container sekaligus mereset seluruh data database dari awal:

```bash
docker compose down -v
```

> [!CAUTION]
> Flag `-v` akan menghapus named volume `task_tracker_postgres_data`. Seluruh data task yang tersimpan di PostgreSQL akan hilang secara permanen.

---

## 8. Troubleshooting

### Port 8000 atau 8080 Sudah Digunakan

Jika muncul error `bind: address already in use`:

1. Periksa proses yang sedang menggunakan port tersebut di host:
   ```bash
   lsof -i :8000
   lsof -i :8080
   ```
2. Hentikan proses lokal tersebut, atau ubah mapping port di file `.env.docker`:
   ```env
   BACKEND_PORT=8001
   FRONTEND_PORT=8081
   ```

### Backend Gagal Terhubung ke Database

Backend dikonfigurasi dengan dependensi `condition: service_healthy` terhadap container `db`. Jika koneksi bermasalah:

1. Periksa log database:
   ```bash
   docker compose logs db
   ```
2. Pastikan `DATABASE_URL` menggunakan hostname internal Docker `db` (`@db:5432`), **bukan** `localhost`.

### Frontend Tidak Dapat Memanggil API Backend

1. Pastikan Anda mengakses frontend melalui browser di `http://localhost:8080`.
2. Browser mengeksekusi request HTTP dari sisi client (host). Karena itu `VITE_API_BASE_URL` harus bernilai `http://localhost:8000` (URL host backend), bukan hostname internal Docker.
3. Pastikan konfigurasi CORS di `backend/app/main.py` mengizinkan origin `http://localhost:8080`.
