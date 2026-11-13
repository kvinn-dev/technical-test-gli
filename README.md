# Task Tracker

Aplikasi Task Tracker sederhana berbasis web yang dikembangkan menggunakan **React, FastAPI, dan PostgreSQL** sebagai bagian dari Technical Assessment Software Engineer Intern GLI.

## Gambaran Umum

Task Tracker merupakan aplikasi berbasis web yang dirancang untuk membantu pengguna mengelola dan mengorganisasi tugas sehari-hari.

Aplikasi ini nantinya memungkinkan pengguna untuk menambahkan, melihat, mengubah, dan menghapus tugas, serta memantau perkembangan setiap tugas berdasarkan status pengerjaannya.

## Teknologi yang Digunakan

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- Lucide React

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Pydantic Settings
- Psycopg 3
- Uvicorn

### Database

- PostgreSQL

## Struktur Proyek

```text
task-tracker-gli/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── __init__.py
│   │   ├── database.py
│   │   └── main.py
│   ├── .env.example
│   └── requirements.txt
│
├── docs/
│   ├── requirements.md
│   └── system-design.md
|
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── types/
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

## Status Tugas

Setiap tugas memiliki tiga status pengerjaan:

- **Todo** – Tugas belum dikerjakan.
- **In Progress** – Tugas sedang dikerjakan.
- **Done** – Tugas telah selesai.

## Progres Pengembangan

- [x] Inisialisasi struktur proyek.
- [x] Setup React menggunakan Vite dan TypeScript.
- [x] Konfigurasi Tailwind CSS.
- [x] Setup struktur proyek FastAPI.
- [x] Instalasi dependensi frontend dan backend.
- [x] Konfigurasi environment variables.
- [x] Konfigurasi koneksi PostgreSQL menggunakan SQLAlchemy.
- [x] Membuat model database Task.
- [ ] Implementasi endpoint CRUD backend.
- [ ] Implementasi antarmuka frontend.
- [ ] Integrasi frontend dengan backend API.
- [ ] Pengujian fungsionalitas aplikasi.

## Lisensi

Proyek ini dikembangkan untuk keperluan Technical Assessment Software Engineer Intern GLI.
