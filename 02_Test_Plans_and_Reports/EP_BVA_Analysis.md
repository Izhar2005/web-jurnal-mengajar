# Analisis Black-Box Testing: EP & BVA
## SIS-TERPADU — Sistem Informasi Sekolah Terpadu

**Tanggal:** 2026-07-30  

---

## 1. Equivalence Partitioning (EP)

### EP-01: Login Form — Field Email

| Kelas EP | Partisi | Contoh Input | Valid? |
|----------|---------|-------------|--------|
| EP-01-V1 | Email terdaftar dengan format valid | `admin@sekolah.test` | ✅ Valid |
| EP-01-V2 | Email terdaftar (guru) | `guru@sekolah.test` | ✅ Valid |
| EP-01-I1 | Format bukan email | `adminsekolah` | ❌ Invalid |
| EP-01-I2 | Format email valid tapi tidak terdaftar | `unknown@school.com` | ❌ Invalid |
| EP-01-I3 | String kosong | `` | ❌ Invalid |
| EP-01-I4 | Hanya spasi | `   ` | ❌ Invalid |

### EP-02: Login Form — Field Password

| Kelas EP | Partisi | Contoh Input | Valid? |
|----------|---------|-------------|--------|
| EP-02-V1 | Password yang cocok | `password123` | ✅ Valid |
| EP-02-I1 | Password salah | `wrongpass` | ❌ Invalid |
| EP-02-I2 | String kosong | `` | ❌ Invalid |
| EP-02-I3 | Password mirip tapi salah case | `Password123` | ❌ Invalid |
| EP-02-I4 | Password terlalu pendek (< 1 char) | `` | ❌ Invalid |

### EP-03: Form Jurnal — Field Kelas

| Kelas EP | Partisi | Contoh Input | Valid? |
|----------|---------|-------------|--------|
| EP-03-V1 | Format kelas valid | `VIII-A` | ✅ Valid |
| EP-03-V2 | Format kelas valid huruf kecil | `ix-b` | ✅ Valid |
| EP-03-I1 | String kosong | `` | ❌ Invalid |
| EP-03-I2 | Hanya spasi | `   ` | ❌ Invalid |

### EP-04: Form BK — Field Status

| Kelas EP | Partisi | Contoh Input | Valid? |
|----------|---------|-------------|--------|
| EP-04-V1 | Status valid — Proses | `Proses` | ✅ Valid |
| EP-04-V2 | Status valid — Selesai | `Selesai` | ✅ Valid |
| EP-04-V3 | Status valid — Rujukan | `Rujukan` | ✅ Valid |
| EP-04-I1 | Nilai di luar enum | `Pending` | ❌ Invalid |
| EP-04-I2 | String kosong | `` | ❌ Invalid |

### EP-05: Role-Based Access

| Kelas EP | Role | Modul Tersedia | Valid Akses? |
|----------|------|---------------|-------------|
| EP-05-V1 | admin | jurnal, bk, kesiswaan, pengguna | ✅ Valid |
| EP-05-V2 | guru | jurnal | ✅ Valid |
| EP-05-V3 | bk | bk, kesiswaan | ✅ Valid |
| EP-05-V4 | wali | kesiswaan | ✅ Valid |
| EP-05-I1 | guru mengakses bk | - | ❌ Tidak tampil di sidebar |
| EP-05-I2 | siswa mengakses pengguna | - | ❌ Tidak tampil di sidebar |

---

## 2. Boundary Value Analysis (BVA)

### BVA-01: Tanggal Jurnal Mengajar
**Batas:** Tanggal tidak boleh melebihi hari ini (2026-07-30)

| ID | Nilai Input | Deskripsi | Expected Result |
|----|------------|-----------|----------------|
| BVA-01-1 | `2020-01-01` | Jauh di bawah batas (masa lalu) | ✅ Diterima |
| BVA-01-2 | `2026-07-29` | Satu hari sebelum hari ini | ✅ Diterima |
| BVA-01-3 | `2026-07-30` | **Tepat hari ini (batas atas valid)** | ✅ Diterima |
| BVA-01-4 | `2026-07-31` | **Satu hari setelah hari ini (batas bawah invalid)** | ❌ Ditolak — "Tanggal tidak boleh di masa depan" |
| BVA-01-5 | `2099-12-31` | Jauh di masa depan | ❌ Ditolak |
| BVA-01-6 | `` | String kosong | ❌ Ditolak — field required |

### BVA-02: Login Lockout (5 Percobaan Gagal)
**Batas:** Kunci akun setelah tepat 5 percobaan gagal

| ID | Percobaan Ke- | Expected Result |
|----|--------------|----------------|
| BVA-02-1 | 1 | Gagal — "Sisa percobaan: 4" |
| BVA-02-2 | 2 | Gagal — "Sisa percobaan: 3" |
| BVA-02-3 | 3 | Gagal — "Sisa percobaan: 2" |
| BVA-02-4 | 4 | Gagal — "Sisa percobaan: 1" |
| BVA-02-5 | **5 (batas)** | Gagal — **"Akun dikunci 30 detik"** |
| BVA-02-6 | 6+ (selama terkunci) | **"Coba lagi dalam N detik"** |
| BVA-02-7 | Setelah 30 detik habis | Kunci dilepas — bisa login lagi |

### BVA-03: Paginasi Riwayat Jurnal (10 item/halaman)
**Batas:** Halaman pertama = item 1–10, halaman kedua = item 11–20, dst.

| ID | Jumlah Entry | Halaman Saat Ini | Item Tampil | Expected |
|----|-------------|-----------------|-------------|---------|
| BVA-03-1 | 0 | 1 | 0 | Tampil "Belum ada jurnal" |
| BVA-03-2 | 1 | 1 | 1 | 1 item; tombol Next disabled |
| BVA-03-3 | 10 | 1 | 10 | 10 item; tombol Next disabled |
| BVA-03-4 | **11** | 1 | **10** | Tombol Next enabled |
| BVA-03-5 | 11 | 2 | 1 | Tombol Prev enabled; Next disabled |
| BVA-03-6 | 20 | 2 | 10 | Halaman terakhir |

### BVA-04: Penambahan Pengguna — Validasi Email Unik

| ID | Input Email | Kondisi | Expected |
|----|------------|---------|---------|
| BVA-04-1 | `baru@sekolah.test` | Email baru (tidak ada di DB) | ✅ User berhasil ditambahkan |
| BVA-04-2 | `admin@sekolah.test` | Email sudah ada | ❌ Ditolak — "Email sudah terdaftar" |
| BVA-04-3 | `` | Field kosong | ❌ Form tidak bisa disubmit |

---

## 3. Ringkasan Test Cases

| Kategori | Total Test Cases | Pass | Fail | Tidak Dijalankan |
|---------|-----------------|------|------|-----------------|
| EP Login | 9 | 9 | 0 | 0 |
| EP Form Jurnal | 4 | 4 | 0 | 0 |
| EP BK Status | 5 | 5 | 0 | 0 |
| EP Role Access | 6 | 6 | 0 | 0 |
| BVA Tanggal | 6 | 6 | 0 | 0 |
| BVA Lockout | 7 | 7 | 0 | 0 |
| BVA Paginasi | 6 | 6 | 0 | 0 |
| BVA Email Unik | 3 | 3 | 0 | 0 |
| **Total** | **46** | **46** | **0** | **0** |

---

*Dokumen ini merupakan bagian dari Tugas UAS mata kuliah Advanced Software Testing & Quality Assurance.*
