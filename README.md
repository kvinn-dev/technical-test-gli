# Task Tracker

Aplikasi pengelolaan tugas berbasis web yang dikembangkan menggunakan **React, FastAPI, dan PostgreSQL** sebagai bagian dari Technical Assessment Software Engineer Intern di **PT Global Loyalty Indonesia (GLI)**.

Task Tracker dirancang untuk membantu pengguna mengelola aktivitas dan pekerjaan sehari-hari melalui antarmuka yang sederhana, intuitif, dan responsif.

## Overview

Task Tracker merupakan aplikasi yang berfokus pada pengelolaan tugas (_task management_). Pengguna dapat mengorganisasi tugas, melihat detail informasi, memperbarui data, serta memantau progres pengerjaan berdasarkan status masing-masing tugas.

Setiap tugas memiliki tiga status pengerjaan:

- **Todo** — Tugas belum dikerjakan.
- **In Progress** — Tugas sedang dalam proses pengerjaan.
- **Done** — Tugas telah diselesaikan.

Aplikasi ini menggunakan arsitektur frontend dan backend yang terpisah. React digunakan untuk membangun antarmuka pengguna, FastAPI menangani proses dan layanan API, sedangkan PostgreSQL digunakan sebagai sistem penyimpanan data.

## Tech Stack

Teknologi dan tools yang digunakan dalam pengembangan aplikasi:

### Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Lucide React](https://img.shields.io/badge/Lucide_React-F56565?style=for-the-badge&logo=lucide&logoColor=white)

### Backend

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white)
![Pydantic](https://img.shields.io/badge/Pydantic-E92063?style=for-the-badge&logo=pydantic&logoColor=white)
![Uvicorn](https://img.shields.io/badge/Uvicorn-4051B5?style=for-the-badge&logo=gunicorn&logoColor=white)

### Database

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Psycopg 3](https://img.shields.io/badge/Psycopg_3-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

## Project Structure

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
│   ├── installation.md
│   ├── requirements.md
│   └── system-design.md
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

## Installation

Untuk panduan lengkap mengenai persyaratan sistem, konfigurasi environment variables, instalasi dependensi, dan cara menjalankan aplikasi secara lokal, silakan kunjungi:

[**Installation Guide →**](docs/installation.md)

## Development Progress

- [x] Inisialisasi struktur proyek.
- [x] Setup React menggunakan Vite dan TypeScript.
- [x] Konfigurasi Tailwind CSS.
- [x] Setup struktur proyek FastAPI.
- [x] Instalasi dependensi frontend dan backend.
- [x] Konfigurasi environment variables.
- [x] Konfigurasi koneksi PostgreSQL menggunakan SQLAlchemy.
- [x] Membuat model database Task.
- [x] Implementasi endpoint CRUD backend.
- [x] Implementasi antarmuka frontend.
- [x] Integrasi frontend dengan backend API.
- [x] Pengujian fungsionalitas aplikasi.

## License

Proyek ini dikembangkan untuk keperluan **Technical Assessment Software Engineer Intern PT Global Loyalty Indonesia (GLI)**.
