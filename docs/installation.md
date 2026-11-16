# Installation Guide

Panduan ini menjelaskan langkah-langkah untuk menginstal, mengonfigurasi, dan menjalankan **Task Tracker** di lingkungan lokal.

## 1. Prerequisites

Pastikan perangkat sudah memiliki beberapa kebutuhan berikut:

| Requirement | Version                      |
| ----------- | ---------------------------- |
| Python      | 3.11 atau lebih baru         |
| Node.js     | 22 LTS                       |
| npm         | Mengikuti instalasi Node.js  |
| PostgreSQL  | Sudah terinstal dan berjalan |
| Git         | Versi terbaru                |

Pastikan semua kebutuhan tersebut sudah terinstal dengan memeriksa versinya melalui terminal:

```bash
python3 --version
node --version
npm --version
psql --version
git --version
```

## 2. Clone Repository

Clone repository Task Tracker ke komputer lokal:

```bash
git clone https://github.com/kvinn-dev/technical-test-gli
```

Masuk ke direktori proyek:

```bash
cd technical-test-gli
```

## 3. Database Configuration

Task Tracker menggunakan PostgreSQL sebagai database dan SQLAlchemy dengan Psycopg 3 sebagai database driver.

### 3.1 Create Database and User

Pastikan PostgreSQL sudah berjalan, kemudian buka PostgreSQL menggunakan `psql` atau aplikasi pengelola database seperti pgAdmin.

Buat database user:

```sql
CREATE USER task_user WITH PASSWORD 'yourpassword';
```

Buat database:

```sql
CREATE DATABASE task_tracker OWNER task_user;
```

Sesuaikan username dan password apabila menggunakan konfigurasi yang berbeda.

## 4. Backend Installation

### 4.1 Navigate to Backend Directory

Buka terminal dan masuk ke direktori backend:

```bash
cd backend
```

### 4.2 Create Virtual Environment

Buat Python virtual environment:

```bash
python3 -m venv .venv
```

Aktifkan virtual environment:

**macOS / Linux:**

```bash
source .venv/bin/activate
```

**Windows (Command Prompt):**

```bash
.venv\Scripts\activate.bat
```

**Windows (PowerShell):**

```powershell
.venv\Scripts\Activate.ps1
```

### 4.3 Install Dependencies

Instal seluruh dependensi backend yang tercantum dalam `requirements.txt`:

```bash
pip install -r requirements.txt
```

### 4.4 Configure Environment Variables

Salin file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Untuk Windows, file dapat disalin secara manual atau menggunakan:

```powershell
Copy-Item .env.example .env
```

Buka file `.env` dan sesuaikan konfigurasi berikut:

```env
APP_NAME=Task Tracker API
DEBUG=True
DATABASE_URL=postgresql+psycopg://task_user:yourpassword@localhost:5432/task_tracker
```

Pastikan username, password, host, dan nama database sesuai dengan konfigurasi PostgreSQL yang telah dibuat.

### 4.5 Run Database Migrations

Jalankan migrasi database menggunakan Alembic:

```bash
alembic upgrade head
```

Perintah ini akan menerapkan seluruh migrasi yang tersedia hingga versi terbaru dan menyiapkan struktur tabel database.

### 4.6 Run Backend Server

Jalankan backend menggunakan Uvicorn:

```bash
uvicorn app.main:app --reload
```

Jika berhasil, backend dapat diakses melalui:

- API Base URL: http://localhost:8000
- API Documentation: http://localhost:8000/docs

Biarkan terminal backend tetap berjalan selama menggunakan aplikasi.

## 5. Frontend Installation

Buka terminal baru, kemudian masuk ke direktori frontend dari root proyek:

```bash
cd frontend
```

### 5.1 Install Dependencies

Instal seluruh dependensi frontend:

```bash
npm install
```

### 5.2 Configure Environment Variables

Salin file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Untuk Windows:

```powershell
Copy-Item .env.example .env
```

Pastikan konfigurasi frontend mengarah ke alamat backend:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### 5.3 Run Frontend Development Server

Jalankan aplikasi frontend:

```bash
npm run dev
```

Jika berhasil, Vite akan menampilkan alamat lokal aplikasi di terminal. Secara default, aplikasi dapat diakses melalui:

http://localhost:5173

## 6. Access the Application

Setelah backend dan frontend berhasil dijalankan, aplikasi Task Tracker dapat digunakan melalui browser.

| Service           | URL                        |
| ----------------- | -------------------------- |
| Frontend          | http://localhost:5173      |
| Backend API       | http://localhost:8000      |
| API Documentation | http://localhost:8000/docs |

**Important:** Pastikan PostgreSQL, backend server, dan frontend development server tetap berjalan selama menggunakan aplikasi.

## 7. Troubleshooting

Berikut beberapa kendala umum yang mungkin terjadi saat proses instalasi.

| Issue                          | Possible Solution                                                                       |
| ------------------------------ | --------------------------------------------------------------------------------------- |
| Database connection failed     | Pastikan PostgreSQL berjalan dan konfigurasi `DATABASE_URL` sudah benar.                |
| Module not found               | Pastikan virtual environment aktif dan dependensi backend sudah terinstal.              |
| Migration error                | Pastikan database sudah dibuat dan konfigurasi Alembic serta database URL sudah sesuai. |
| Frontend cannot connect to API | Pastikan backend berjalan dan `VITE_API_BASE_URL` mengarah ke alamat API yang benar.    |
| Port already in use            | Pastikan port yang digunakan tidak sedang ditempati aplikasi lain.                      |

---

**Task Tracker** — Technical Assessment Software Engineer Intern, PT Global Loyalty Indonesia (GLI).
