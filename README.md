# SIS-TERPADU — Sistem Informasi Sekolah Terpadu

> **Tugas UAS — Advanced Software Testing & Quality Assurance (ASTQA)**  
> Upgrade dari Tugas UTS Scalable System Design

[![Unit Tests](https://img.shields.io/badge/Unit%20Tests-30%2F30%20PASS-brightgreen)]()
[![Coverage](https://img.shields.io/badge/Coverage-~78%25-green)]()
[![Framework](https://img.shields.io/badge/Framework-React%2019%20%2B%20TanStack%20Router-blue)]()

---

## 📋 Tentang Aplikasi

**SIS-TERPADU** adalah aplikasi web manajemen sekolah terintegrasi berbasis React SPA dengan empat modul utama:

| Modul | Deskripsi | Role |
|-------|-----------|------|
| 📝 Jurnal Mengajar | CRUD jurnal kegiatan mengajar | Guru |
| 🤝 Bimbingan Konseling | Manajemen kasus BK siswa | Guru BK |
| 🎓 Kesiswaan | Data dan status siswa | Wali, Admin |
| 👥 Manajemen Pengguna | Administrasi akun sistem | Admin |

### Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| `admin@sekolah.test` | `password123` | Admin (akses semua modul) |
| `guru@sekolah.test` | `password123` | Guru (Jurnal) |
| `bk@sekolah.test` | `password123` | Guru BK (BK + Kesiswaan) |
| `wali@sekolah.test` | `password123` | Wali Kelas (Kesiswaan) |

---

## 🚀 Cara Menjalankan

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev
# → buka http://localhost:8080
```

---

## 🧪 Menjalankan Pengujian

### Unit Tests (Vitest)
```bash
npm run test:unit           # Jalankan semua unit test
npm run test:unit:coverage  # Dengan code coverage
npm run test:unit:watch     # Watch mode
```

**Hasil: 30/30 PASS — Coverage ~78% (target ≥ 70% ✅)**

### E2E Tests (Cypress)
```bash
# Pastikan dev server berjalan: npm run dev
npm run test:e2e       # Headless (CI)
npm run test:e2e:open  # Cypress UI
```

### Postman API Contract Tests
```bash
npm install -g newman
newman run 03_Test_Scripts_and_Automation/postman/SIS-TERPADU.postman_collection.json
```

---

## 📁 Struktur Repositori

```
web-jurnal-mengajar/
│
├── 01_Documents/
│   ├── SRS.md                             # Software Requirements Specification
│   └── SDD.md                             # Software Design Document (+ ERD + API Contract)
│
├── 02_Test_Plans_and_Reports/
│   ├── Master_Test_Plan.md                # Rencana pengujian (Unit/Integration/System/UAT)
│   ├── EP_BVA_Analysis.md                 # Analisis Equivalence Partitioning & BVA
│   ├── Test_Execution_Report.md           # Laporan hasil eksekusi pengujian
│   └── UAT_Sign_Off_Sheet.md              # Lembar tanda tangan UAT
│
├── 03_Test_Scripts_and_Automation/
│   ├── unit/mockBackend.test.ts           # 30 unit tests (Vitest)
│   ├── cypress/e2e/
│   │   ├── login.cy.ts                    # E2E: Authentication
│   │   ├── journal.cy.ts                  # E2E: Jurnal module
│   │   └── modules.cy.ts                  # E2E: BK, Kesiswaan, Pengguna
│   └── postman/SIS-TERPADU.postman_collection.json
│
├── src/
│   ├── routes/index.tsx                   # UI components
│   └── lib/mockBackend.ts                 # Business logic + IndexedDB
│
├── vitest.config.ts
├── cypress.config.ts
└── README.md
```

---

## 📊 Matriks Pengujian

| Level | Total TC | Pass | Coverage |
|-------|---------|------|---------|
| Unit Testing | 30 | ✅ 30 | ~78% |
| Integration Testing | 6 | ✅ 6 | 100% alur utama |
| System Testing (E2E) | 10 | ✅ 10 | Semua FR |
| UAT | 31 | ✅ 31 | Sign-off ✅ |

---

## 👥 Anggota Kelompok

| Nama | NIM | Peran |
|------|-----|-------|
| [Nama 1] | [NIM] | Ketua, SRS & SDD |
| [Nama 2] | [NIM] | Unit & Integration Testing |
| [Nama 3] | [NIM] | System Testing & UAT |
| [Nama 4] | [NIM] | Automation & Video |

---

*Tugas UAS — Advanced Software Testing & Quality Assurance (ASTQA)*
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
