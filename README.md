# SIS-TERPADU // Web Sekolah Terintegrasi

Proyek web sekolah terintegrasi berbasis React + Vite dengan modul:
- Jurnal Mengajar
- Bimbingan Konseling
- Data Kesiswaan
- Manajemen Pengguna

## Fitur utama
- Login demo dengan role pengguna
- Sidebar berbasis role akses
- Penyimpanan data lokal sederhana (mock backend)
- CRUD untuk jurnal, BK, dan data siswa
- UI neo-brutalist

## Akun demo
- Admin: admin@sekolah.test / password123
- Guru: guru@sekolah.test / password123
- Guru BK: bk@sekolah.test / password123
- Wali Kelas: wali@sekolah.test / password123
- Siswa: siswa@sekolah.test / password123

## Cara menjalankan
```bash
npm install
npm run dev
```
Lalu buka http://localhost:8080/

## Struktur proyek
- src/routes/index.tsx: halaman utama dan UI modul
- src/lib/mockBackend.ts: mock backend, login, data, dan CRUD

## Catatan proyek
Proyek ini masih menggunakan mock backend lokal (localStorage) untuk simulasi sistem sekolah terintegrasi. Untuk pengembangan lebih lanjut, dapat dikembangkan ke backend real seperti Node.js + database SQL.

## Prasyarat

- Node.js (direkomendasikan v18 atau lebih baru)
- npm (atau pnpm/yarn jika kamu gunakan)

## Instalasi & Menjalankan (lokal)

1. Pasang dependensi:

```bash
npm install
```

2. Jalankan development server:

```bash
npm run dev
```

3. Buka pada: http://localhost:8080/

Untuk build produksi:

```bash
npm run build
npm run preview
```

## Database / Model Data

Model data dan struktur tabel disederhanakan dalam mock backend. Tipe utama:

- `User` (id, nama, email, role, password)
- `JournalEntry` (id, tanggal, kelas, mapel, materi, metode, catatan, authorEmail)
- `BkCase` (id, nama, nis, kelas, kasus, tindakLanjut, status, tanggal, penanggungJawab)
- `StudentRecord` (id, nama, nis, kelas, status, waliKelas)
- `ActivityLog` (id, userEmail, action, timestamp)

Untuk diagram ERD visual lihat: [docs/ERD.svg](docs/ERD.svg)

## Arsitektur

Frontend digunakan React + Vite. Penyimpanan saat ini dilakukan lokal via IndexedDB (lihat `src/lib/mockBackend.ts`). Diagram arsitektur sederhana tersedia: [docs/architecture.svg](docs/architecture.svg)

## Cara menyiapkan Git & push ke GitHub

Jika repo belum diinisialisasi sebagai Git, jalankan:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

Ganti `https://github.com/USERNAME/REPO.git` dengan URL repo GitHub mu.

## Kontributor

- Izhar — NIM: 1058541109023 — Frontend (UI components, routing, pages)
- MUH RAFLI — NIM: 105841108723 — Backend & Data Model (mock backend, persistence)
- M Erwin Khusnaedy — NIM: 105841120623 — Dokumentasi, testing, build
- NAWAT SAKTI AL'AGASI — NIM: 105841108823 — Styling, aksesibilitas, deployment

Kontributor bertanggung jawab membagi tugas seperti tercantum di `CONTRIBUTING.md`.

## Catatan akhir
Proyek ini cocok sebagai demo front-end/POC modul sekolah. Untuk penilaian penuh, lengkapi diagram, tambahkan backend nyata, dan pastikan riwayat commit tersedia di GitHub.
