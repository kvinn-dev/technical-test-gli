# Task Tracker – UI/UX Design Specification

## 1. Design Overview

Task Tracker menggunakan pendekatan desain modern, minimalis, dan playful dengan inspirasi visual dari referensi desain Project Dashboard yang diberikan.

Desain mengutamakan:

- Tampilan yang bersih dan mudah dipahami.
- Penggunaan warna cerah sebagai identitas visual.
- Folder-shaped cards untuk menampilkan task yang sedang dikerjakan.
- Task list yang sederhana dan mudah dipindai.
- Responsivitas untuk desktop, tablet, dan mobile.
- Interaksi yang intuitif tanpa elemen navigasi yang tidak diperlukan.

### Design Direction

- Style: Modern Minimalist, Playful Dashboard.
- Layout: Dashboard-based layout.
- Visual emphasis: Colorful folder cards dan clean task list.
- Interaction: Click-based interaction dengan modal untuk detail task.
- Responsive: Mobile-first, kemudian menyesuaikan ke tablet dan desktop.

## 2. Color Palette

Gunakan palet warna yang konsisten dengan referensi visual.

| Element            | Color               | Hex       |
| ------------------ | ------------------- | --------- |
| Primary Blue       | Bright Cyan Blue    | `#12B5E5` |
| Primary Yellow     | Warm Mustard Yellow | `#F5B91B` |
| Background         | Light Gray          | `#E8E8EA` |
| Surface            | White               | `#FFFFFF` |
| Text Primary       | Almost Black        | `#171717` |
| Text Secondary     | Muted Gray          | `#77777F` |
| Border             | Soft Gray           | `#DCDCE0` |
| Dark Surface       | Black               | `#111111` |
| Todo Accent        | Neutral Gray        | `#A3A3A3` |
| In Progress Accent | Primary Blue        | `#12B5E5` |
| Done Accent        | Primary Yellow      | `#F5B91B` |

### Color Usage

**Blue**

- Folder card dengan urutan ganjil.
- Accent untuk elemen task tertentu.
- Highlight interaksi yang sedang aktif.

**Yellow**

- Folder card dengan urutan genap.
- Accent untuk elemen task tertentu.
- Highlight visual untuk elemen penting.

**Light Gray**

- Background utama dashboard.
- Area pembatas antarbagian.

**White**

- Task list container.
- Modal.
- Input dan elemen surface lainnya.

**Black**

- Primary text.
- Tombol utama.
- Elemen dengan kontras tinggi.

Hindari penggunaan warna tambahan yang tidak diperlukan agar identitas visual tetap konsisten.

## 3. Typography

Gunakan font sans-serif modern yang mudah dibaca.

Rekomendasi:

- Font family: Inter.
- Heading: Semibold atau Bold.
- Body: Regular.
- Supporting text: Regular dengan warna secondary.

Hierarchy:

| Element         | Desktop | Mobile  |
| --------------- | ------- | ------- |
| Main Heading    | 40–48px | 32–36px |
| Section Heading | 24–28px | 20–24px |
| Card Title      | 18–20px | 16–18px |
| Task Title      | 15–16px | 14–16px |
| Description     | 14px    | 13–14px |
| Supporting Text | 12–13px | 12px    |

Pastikan ukuran teks tetap proporsional dan tidak terlalu besar pada layar mobile.

## 4. Main Dashboard Layout

Dashboard terdiri dari dua bagian utama:

1. Task Dashboard – menampilkan folder cards untuk task yang sedang dikerjakan.
2. All Tasks – menampilkan seluruh task dengan filter berdasarkan status.

Tidak menggunakan:

- Navbar.
- Hamburger menu.
- Sidebar.
- Avatar pengguna.
- Navigasi yang tidak diperlukan oleh requirement.

### Desktop Layout

Gunakan container dengan lebar maksimal sekitar 1200px dan posisi terpusat.

Struktur:

```text
┌──────────────────────────────────────────────────────┐
│                                                      │
│  Task Dashboard (5)                                  │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │              │  │              │  │            │  │
│  │  Task One    │  │  Task Two    │  │ Task Three │  │
│  │              │  │              │  │            │  │
│  │  IN PROGRESS │  │  IN PROGRESS │  │IN PROGRESS │  │
│  │              │  │              │  │            │  │
│  └──────────────┘  └──────────────┘  └────────────┘  │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │ All Tasks                                      │  │
│  │                                                │  │
│  │ [All] [Todo] [In Progress] [Done]              │  │
│  │                                                │  │
│  │ ┌────────────────────────────────────────────┐ │  │
│  │ │ Task title                      Status     │ │  │
│  │ └────────────────────────────────────────────┘ │  │
│  │ ┌────────────────────────────────────────────┐ │  │
│  │ │ Task title                      Status     │ │  │
│  │ └────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Mobile Layout

Pada layar mobile, seluruh bagian dashboard disusun secara vertikal, tetapi Folder Cards tetap ditampilkan secara horizontal dan dapat di-scroll ke samping.

```text
┌─────────────────────────────┐
│                             │
│ Task Dashboard (5)          │
│                             │
│ ┌────────────┐ ┌──────────  │
│ │            │ │            │
│ │ Task One   │ │ Task Two   │
│ │            │ │            │
│ │ IN PROGRESS│ │IN PROGRES  │
│ │            │ │            │
│ └────────────┘ └──────────  │
│     ← Horizontal Scroll →   │
│                             │
│ All Tasks                   │
│                             │
│[All][Todo][Progress][Done]. |
│                             │
│ ┌────────────────────────┐  │
│ │ Task title             │  │
│ │ Description            │  │
│ │                Status  │  │
│ └────────────────────────┘  │
│                             │
└─────────────────────────────┘
```

### Folder Cards – Mobile Behavior

- Folder cards disusun dalam satu baris horizontal.
- Gunakan horizontal scrolling (`overflow-x-auto`).
- Setiap card memiliki lebar tetap atau proporsional, sekitar 75–82% dari lebar viewport.
- Card berikutnya boleh terlihat sebagian untuk memberikan petunjuk visual bahwa konten dapat digeser.
- Pertahankan jarak antar-card yang konsisten.
- Gunakan horizontal scroll yang smooth.
- Sembunyikan scrollbar secara visual jika memungkinkan, tetapi scrolling tetap berfungsi.
- Jangan sampai horizontal scrolling folder cards menyebabkan seluruh halaman mengalami horizontal overflow.

Bagian All Tasks tetap menggunakan layout vertikal seperti biasa.

### Responsive Folder Card Rules

| Device  | Folder Card Layout                       |
| ------- | ---------------------------------------- |
| Mobile  | Horizontal scroll satu baris             |
| Tablet  | Grid atau horizontal scroll sesuai ruang |
| Desktop | Grid multi-column                        |

Pastikan perilaku horizontal scrolling hanya berlaku pada area Folder Cards, bukan seluruh dashboard.

## 5. Task Dashboard – Folder Cards

Bagian utama dashboard menampilkan task yang memiliki status `In Progress`.

### Dynamic Heading

Format judul:

`Task Dashboard (5)`

Angka dalam tanda kurung menunjukkan jumlah task dengan status `In Progress`.

Ketentuan:

- Jumlah diperoleh dari data task yang tersedia.
- Jumlah berubah secara otomatis ketika status task berubah.
- Hanya task berstatus `In Progress` yang ditampilkan pada bagian ini.
- Task dengan status `Todo` atau `Done` tidak ditampilkan di folder cards.

Jika tidak ada task yang sedang dikerjakan, tampilkan empty state yang informatif.

Contoh:

`No tasks in progress yet.`

### Folder Card Design

Folder card harus memiliki bentuk visual seperti folder pada referensi gambar.

Karakteristik:

- Background berwarna biru atau kuning.
- Sudut membulat.
- Memiliki bentuk folder tab pada bagian atas.
- Memiliki status indicator kecil.
- Judul task menggunakan font tebal.
- Informasi tambahan menggunakan teks berukuran lebih kecil.
- Memiliki pola dekoratif titik-titik kecil pada bagian bawah atau area kosong card.
- Cursor pointer untuk menunjukkan bahwa card dapat diklik.

### Alternating Card Colors

Warna folder harus bergantian secara konsisten.

Urutan warna:

| Task Position | Color  |
| ------------- | ------ |
| 1             | Blue   |
| 2             | Yellow |
| 3             | Blue   |
| 4             | Yellow |
| 5             | Blue   |
| 6             | Yellow |

Ketentuan implementasi:

- Task pertama selalu menggunakan warna biru.
- Task kedua menggunakan warna kuning.
- Task ketiga kembali biru.
- Task keempat kembali kuning.
- Pola terus berulang.
- Penentuan warna berdasarkan urutan task yang ditampilkan, bukan status atau ID database.
- Warna tidak boleh berubah secara acak ketika komponen dirender ulang.

### Card Content

Informasi yang ditampilkan:

- Task title.
- Status `In Progress`.
- Description singkat jika tersedia.

Jangan menampilkan informasi yang belum didukung oleh model atau requirement, seperti jumlah subtasks, anggota tim, atau deadline.

### Card Interaction

Ketika folder card diklik:

- Buka modal detail task.
- Tampilkan informasi task yang dipilih.
- Modal harus menampilkan title, description, status, created_at, dan updated_at.
- Sediakan tombol close.
- Modal dapat ditutup dengan tombol Escape atau klik area overlay.
- Jangan mengarahkan pengguna ke halaman baru.

## 6. All Tasks Section

Bagian ini menampilkan seluruh task dari database.

Gunakan container berwarna putih dengan rounded corners dan spacing yang nyaman.

### Section Heading

Judul:

`All Tasks`

### Status Filter

Sediakan empat tombol filter:

1. All
2. Todo
3. In Progress
4. Done

Perilaku:

- `All`: menampilkan seluruh task.
- `Todo`: hanya menampilkan task dengan status Todo.
- `In Progress`: hanya menampilkan task dengan status In Progress.
- `Done`: hanya menampilkan task dengan status Done.

Tombol filter menggunakan segmented control atau pill-shaped buttons.

### Filter Appearance

- Background filter container: light gray.
- Active filter: black.
- Active text: white.
- Inactive text: muted gray.
- Border radius: fully rounded.

Hanya satu filter yang dapat aktif dalam satu waktu.

Filter harus memperbarui isi task list tanpa reload halaman.

## 7. Task List Item

Gunakan bentuk list seperti bagian All Tasks pada referensi.

Setiap item memiliki:

- Task title.
- Description singkat jika tersedia.
- Status indicator.
- Status badge.

### List Item Appearance

- Background putih atau neutral surface.
- Rounded corners.
- Padding yang cukup.
- Spacing konsisten antaritem.
- Hover state ringan pada desktop.
- Tidak menggunakan visual yang terlalu ramai.

### Status Badge

Gunakan warna yang konsisten:

| Status      | Visual       |
| ----------- | ------------ |
| Todo        | Neutral Gray |
| In Progress | Blue         |
| Done        | Yellow       |

Status ditampilkan sebagai pill-shaped badge.

### List Interaction

Ketika item task diklik:

- Buka modal detail task.
- Tampilkan informasi task.
- Sediakan aksi edit dan delete sesuai fitur CRUD.
- Jangan membuat tombol yang tidak memiliki fungsi.

## 8. Task Detail Modal

Modal digunakan untuk melihat detail task.

### Content

Tampilkan:

- Task title.
- Description.
- Status.
- Created date.
- Last updated date.

### Actions

Sediakan tombol:

- Edit Task.
- Delete Task.
- Close.

Ketentuan:

- Edit Task membuka form edit.
- Delete Task meminta konfirmasi sebelum menghapus.
- Close menutup modal.
- Perubahan harus tersimpan melalui API backend.
- Setelah perubahan berhasil, dashboard dan task list diperbarui tanpa reload halaman.

### Responsive Behavior

Desktop:

- Modal berada di tengah layar.
- Lebar maksimal sekitar 520px.

Mobile:

- Modal menggunakan hampir seluruh lebar layar.
- Padding tetap nyaman.
- Tinggi maksimal mengikuti viewport.
- Konten dapat di-scroll jika melebihi tinggi layar.

## 9. Create and Edit Task Form

Sediakan form untuk membuat dan mengubah task melalui modal tanpa berpindah halaman.

### 9.1 Create Task Button

Sediakan tombol utama `+ Add Task` pada bagian header All Tasks.

Ketentuan:

- Desktop: tombol berada di sisi kanan judul All Tasks.
- Mobile: tombol tetap berada di sisi kanan judul jika ruang mencukupi. Sesuaikan layout jika ruang terbatas.
- Gunakan background hitam, teks putih, dan icon Plus dari Lucide React.
- Tombol harus mudah ditemukan tanpa mengganggu visual utama dashboard.

### 9.2 Form Fields

Gunakan field berikut:

| Field       | Input      |
| ----------- | ---------- |
| Title       | Text input |
| Description | Textarea   |
| Status      | Select     |

Ketentuan:

- Title wajib diisi dan tidak boleh hanya berisi whitespace.
- Description bersifat opsional.
- Status menggunakan pilihan Todo, In Progress, dan Done.
- Status default untuk task baru adalah Todo.
- Tampilkan validasi ketika input tidak valid.

### 9.3 Create Task Behavior

Ketika tombol `+ Add Task` diklik:

- Tampilkan modal Create New Task.
- Pengguna dapat mengisi title, description, dan status.
- Sediakan tombol Create Task dan Cancel.
- Modal dapat ditutup melalui tombol close atau area overlay.

Ketika tombol Create Task diklik:

- Validasi input sebelum mengirim request.
- Kirim data ke backend melalui `POST /tasks`.
- Tampilkan loading state selama proses penyimpanan.
- Tampilkan feedback jika proses berhasil atau gagal.
- Tutup modal setelah task berhasil dibuat.
- Perbarui task list tanpa melakukan full page reload.

Perilaku berdasarkan status:

- `Todo`: task muncul pada All Tasks dengan filter Todo.
- `In Progress`: task muncul pada All Tasks dan Folder Cards di Task Dashboard.
- `Done`: task muncul pada All Tasks dengan filter Done.

Jumlah pada judul Task Dashboard harus diperbarui secara otomatis ketika task baru berstatus In Progress ditambahkan.

### 9.4 Edit Task Behavior

- Pengguna dapat membuka detail task dan memilih Edit Task.
- Tampilkan form edit melalui modal.
- Isi form dengan data task yang dipilih.
- Pengguna dapat mengubah title, description, dan status.
- Validasi input sebelum mengirim perubahan.
- Kirim perubahan melalui `PUT /tasks/{id}`.
- Tampilkan loading state dan feedback berhasil atau gagal.
- Setelah berhasil, perbarui task list dan Folder Cards tanpa reload halaman.
- Jika status task berubah, sesuaikan penempatannya pada dashboard dan filter berdasarkan status terbaru.

### 9.5 UI Guidelines

- Gunakan tombol utama berwarna hitam dengan teks putih.
- Gunakan rounded corners dan spacing yang konsisten.
- Pastikan modal responsif untuk desktop dan mobile.
- Pastikan seluruh tombol memiliki fungsi yang benar-benar berjalan.
- Hindari elemen form atau tombol yang tidak memiliki kegunaan.

## 10. Responsive Design

Gunakan pendekatan mobile-first.

### Breakpoints

| Device  | Width        | Layout                           |
| ------- | ------------ | -------------------------------- |
| Mobile  | < 640px      | Single column                    |
| Tablet  | 640px–1023px | Two columns jika ruang mencukupi |
| Desktop | ≥ 1024px     | Multi-column grid                |

### Responsive Rules

**Mobile**

- Folder cards satu kolom.
- Task list satu kolom.
- Filter dapat di-scroll horizontal jika tidak cukup ruang.
- Modal hampir memenuhi lebar layar.
- Tombol memiliki area klik yang nyaman.
- Tidak boleh ada horizontal overflow pada halaman.

**Tablet**

- Folder cards dapat menggunakan dua kolom.
- Task list tetap satu kolom.
- Spacing disesuaikan dengan lebar layar.

**Desktop**

- Folder cards menggunakan grid tiga kolom jika ruang mencukupi.
- Task list menggunakan lebar container yang optimal.
- Modal berada di tengah layar.

## 11. Interaction and UI States

Semua komponen interaktif harus memiliki state yang jelas.

### Required States

- Default state.
- Hover state.
- Active state.
- Focus state.
- Loading state.
- Empty state.
- Error state.
- Success feedback.

### Important Behaviors

1. Folder card hanya menampilkan task In Progress.
2. Jumlah pada Task Dashboard selalu sesuai jumlah task In Progress.
3. Filter All Tasks bekerja berdasarkan status.
4. Create task memperbarui task list setelah berhasil.
5. Edit task memperbarui seluruh tampilan yang relevan.
6. Delete task menghapus item dari tampilan setelah berhasil.
7. Perubahan status dapat memindahkan task ke bagian dashboard atau mengeluarkannya dari dashboard.
8. Semua perubahan data menggunakan backend API.
9. Tidak melakukan full page reload untuk operasi CRUD.

## 12. Icon and Button Guidelines

Gunakan Lucide React untuk icon jika diperlukan.

Prioritaskan:

- Plus untuk Create Task.
- Pencil untuk Edit.
- Trash untuk Delete.
- X untuk Close.
- Chevron atau icon sederhana jika memang diperlukan.

Ketentuan:

- Jangan menambahkan icon hanya sebagai dekorasi berlebihan.
- Semua tombol harus memiliki fungsi yang jelas.
- Gunakan label yang mudah dipahami.
- Pastikan ukuran tombol dan icon konsisten.
- Jangan membuat navigasi yang tidak dibutuhkan.

## 13. Implementation Guidelines

Teknologi frontend yang digunakan:

- React.
- TypeScript.
- Vite.
- Tailwind CSS v4.
- Axios.
- Lucide React.

Ketentuan implementasi:

1. Pertahankan struktur project frontend yang sudah tersedia.
2. Gunakan komponen React yang reusable.
3. Pisahkan API logic dari UI component.
4. Gunakan TypeScript types yang sesuai dengan response backend.
5. Gunakan state React untuk mengelola task list, filter, modal, dan form.
6. Jangan menggunakan mock data sebagai sumber data utama setelah API tersedia.
7. Gunakan API backend sebagai sumber data task.
8. Pastikan desain konsisten pada seluruh ukuran layar.
9. Hindari penggunaan CSS yang berlebihan jika dapat diselesaikan dengan Tailwind CSS.
10. Jangan menambahkan dependency yang tidak diperlukan.

### Suggested Components

- `TaskDashboard`
- `FolderCard`
- `TaskList`
- `TaskListItem`
- `TaskFilter`
- `TaskDetailModal`
- `TaskForm`
- `DeleteConfirmation`

Nama dan struktur komponen dapat disesuaikan dengan arsitektur frontend yang sudah tersedia.

## 14. Final Design Principles

Hasil akhir harus mempertahankan karakter visual referensi:

- Background abu-abu terang.
- Folder cards berwarna biru dan kuning.
- Bentuk folder dengan tab pada bagian atas.
- Typography hitam yang tegas.
- Task list putih dengan layout sederhana.
- Filter berbentuk pill.
- Rounded corners yang konsisten.
- Tampilan responsif pada mobile dan desktop.

Jangan menambahkan fitur atau elemen visual yang tidak memiliki fungsi.

**Prioritas utama adalah menghasilkan dashboard Task Tracker yang terlihat menarik seperti referensi, tetapi tetap sederhana, responsif, fungsional, dan sesuai requirement Technical Test GLI.**
