# Master Test Plan
## SIS-TERPADU — Sistem Informasi Sekolah Terpadu

**Versi:** 1.0  
**Tanggal:** 2026-07-30  
**Kelompok:** ASTQA  

---

## 1. Ruang Lingkup Pengujian

Pengujian mencakup seluruh modul SIS-TERPADU:
- Autentikasi & Otorisasi
- Jurnal Mengajar (CRUD + Export + Print)
- Bimbingan Konseling (CRUD + Search)
- Kesiswaan (CRUD + Search)
- Manajemen Pengguna (Admin)

---

## 2. Strategi Pengujian

| Level | Metode | Tools | Target Coverage |
|-------|--------|-------|----------------|
| Unit Testing | White-box, fungsi isolasi | Vitest | ≥ 70% |
| Integration Testing | Black-box, alur data antar modul | Vitest | Semua alur utama |
| System Testing | End-to-End, scenario-based | Cypress | Semua FR |
| Performance Testing | Load & Stress | JMeter / Postman | Response < 500ms |
| UAT | User scenario | Manual / Checklist | Sign-off kelompok |

---

## 3. Tingkatan Pengujian

### 3.1 Unit Testing
**Cakupan:** Fungsi-fungsi individual dalam `src/lib/mockBackend.ts`

| ID | Fungsi | Jenis Test |
|----|--------|-----------|
| UT-01 | `getRoleName()` | Pure function — EP |
| UT-02 | `getAccessibleModules()` | Pure function — EP |
| UT-03 | `verifyPassword()` | Async — EP & BVA |
| UT-04 | `hashPassword()` | Async — basic |
| UT-05 | `checkLoginLockout()` | localStorage mock |
| UT-06 | `recordFailedAttempt()` | localStorage mock |
| UT-07 | `login()` — valid | IndexedDB mock |
| UT-08 | `login()` — invalid email | IndexedDB mock |
| UT-09 | `login()` — wrong password | IndexedDB mock |
| UT-10 | `login()` — account locked | localStorage mock |
| UT-11 | `saveJournalEntry()` | IndexedDB mock |
| UT-12 | `listJournalEntries()` | IndexedDB mock |
| UT-13 | `deleteJournalEntry()` | IndexedDB mock |

### 3.2 Integration Testing
**Cakupan:** Alur data antar fungsi dan modul

| ID | Skenario | Modul Terlibat |
|----|----------|---------------|
| IT-01 | Login → load journal list | Auth ↔ Journal Service |
| IT-02 | Save journal → list update | Journal Form ↔ Journal Service ↔ IndexedDB |
| IT-03 | Delete journal → list refresh | Journal List ↔ Journal Service ↔ IndexedDB |
| IT-04 | Login → BK module access | Auth ↔ Role Guard ↔ BK Service |
| IT-05 | Add BK case → appears in list | BK Form ↔ BK Service ↔ IndexedDB |
| IT-06 | Failed login × 5 → lockout | Auth ↔ Lockout Guard ↔ localStorage |

### 3.3 System Testing (E2E)
**Cakupan:** Skenario pengguna penuh dari UI ke storage

| ID | Skenario | Role | Expected |
|----|----------|------|---------|
| ST-01 | Login berhasil sebagai admin | - | Dashboard admin tampil |
| ST-02 | Login gagal — password salah | - | Pesan error tampil |
| ST-03 | Input jurnal valid → simpan | guru | Muncul di riwayat |
| ST-04 | Input jurnal tanggal masa depan | guru | Ditolak, pesan error |
| ST-05 | Hapus jurnal dengan konfirmasi | guru | Data terhapus dari list |
| ST-06 | Export jurnal ke CSV | guru | File ter-download |
| ST-07 | Tambah kasus BK | bk | Muncul di daftar BK |
| ST-08 | Cari siswa dengan nama | wali | Daftar terfilter |
| ST-09 | Tambah pengguna baru | admin | User muncul di daftar |
| ST-10 | Logout → sesi terhapus | - | Kembali ke halaman login |

### 3.4 UAT (User Acceptance Testing)
Lihat file `UAT_Sign_Off_Sheet.md`

---

## 4. Metode Black-Box: EP & BVA

### 4.1 Equivalence Partitioning (EP) — Login Form

| Field | Kelas Valid | Kelas Invalid |
|-------|-------------|---------------|
| Email | Format email valid yang terdaftar | Format bukan email; email tidak terdaftar |
| Password | String yang cocok dengan stored password | String kosong; password salah |

### 4.2 Boundary Value Analysis (BVA) — Tanggal Jurnal

| Batas | Input | Expected |
|-------|-------|---------|
| Min Valid | `2020-01-01` | Diterima |
| Max Valid (hari ini) | `2026-07-30` | Diterima |
| Tepat di atas batas | `2026-07-31` | Ditolak — pesan error |
| Jauh di masa depan | `2099-12-31` | Ditolak — pesan error |

### 4.3 BVA — Login Lockout (5 percobaan)

| Percobaan ke- | Expected |
|---------------|---------|
| 1 – 4 | "Sisa percobaan: N" |
| 5 (tepat batas) | "Akun dikunci 30 detik" |
| 6+ (setelah locked, sebelum 30 detik) | "Coba lagi dalam N detik" |
| Setelah 30 detik | Kunci terlepas, bisa coba login lagi |

---

## 5. Automated Testing Tools

| Tool | Digunakan Untuk | Script Location |
|------|----------------|----------------|
| Vitest | Unit & Integration Test | `03_Test_Scripts_and_Automation/unit/` |
| Cypress | E2E UI Automation | `03_Test_Scripts_and_Automation/cypress/` |
| Postman / Newman | API Contract Test (future) | `03_Test_Scripts_and_Automation/postman/` |

---

## 6. Kriteria Pass/Fail

| Kriteria | Target |
|---------|--------|
| Unit test code coverage | ≥ 70% |
| Semua test case kritis (ST-01 s/d ST-10) | PASS |
| Tidak ada P1/P2 bug terbuka | PASS |
| UAT Sign-off ditandatangani | ≥ 3 dari 4 anggota kelompok |

---

*Dokumen ini merupakan bagian dari Tugas UAS mata kuliah Advanced Software Testing & Quality Assurance.*
