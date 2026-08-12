# FEATURE GUIDE
## Panduan Lengkap Menggunakan Setiap Fitur SIS-TERPADU

---

## 📖 DAFTAR ISI

1. [Login & Logout](#login--logout)
2. [Dashboard Overview](#dashboard-overview)
3. [Modul Jurnal Mengajar](#modul-jurnal-mengajar)
4. [Modul Bimbingan Konseling](#modul-bimbingan-konseling)
5. [Modul Kesiswaan](#modul-kesiswaan)
6. [Modul Manajemen Pengguna](#modul-manajemen-pengguna)
7. [Fitur Umum](#fitur-umum)
8. [Tips & Tricks](#tips--tricks)

---

## LOGIN & LOGOUT

### Cara Login

```
SCREEN 1: Login Page
┌─────────────────────────────────┐
│   Logo SIS-TERPADU              │
│                                 │
│   Email:    [_______________]   │
│   Password: [_______________]   │
│                                 │
│   [LOGIN Button]                │
│                                 │
│   "Belum punya akun? Daftar"    │
└─────────────────────────────────┘

STEP-BY-STEP:

1. Buka http://localhost:8080
   → Otomatis redirect ke login page

2. Masukkan email
   Email: admin@sekolah.test

3. Masukkan password
   Password: password123

4. Klik tombol "LOGIN"

5. Tunggu loading (1-2 detik)

6. Redirect ke dashboard
   → Login berhasil! ✓
```

**Demo Accounts:**
| Tipe | Email | Password |
|------|-------|----------|
| Admin | admin@sekolah.test | password123 |
| Guru | guru@sekolah.test | password123 |
| Guru BK | bk@sekolah.test | password123 |
| Wali Kelas | wali@sekolah.test | password123 |

### Cara Logout

```
SCREEN: Dashboard (Setelah login)
┌─────────────────────────────────┐
│ [Logo]  Selamat datang, Admin   │
│         [Logout Button] ✕        │
├─────────────────────────────────┤
│  Module Tabs: Jurnal | BK | Siswa│
│  .... Konten Module               │
└─────────────────────────────────┘

STEP-BY-STEP:

1. Lihat header/navbar di atas
   → Ada nama user dan tombol "Logout"

2. Klik tombol "Logout"

3. Konfirmasi logout
   → Beberapa app meminta konfirmasi

4. Redirect ke login page
   → Session clear, siap login lagi ✓
```

### Fitur Keamanan

✓ **Password Storage:**
- Plaintext (untuk demo - in production harus di-hash)
- Simpan di IndexedDB

✓ **Session Management:**
- Disimpan di localStorage
- Otomatis clear saat logout
- Persisten saat refresh (tetap login)

✓ **Access Control:**
- Setiap role hanya lihat fitur yang relevan
- Tidak bisa akses modul tidak authorized
- Backend validation di mockBackend.ts

---

## DASHBOARD OVERVIEW

### Layout Dashboard

```
┌───────────────────────────────────────────────┐
│  📋 SIS-TERPADU Dashboard                    │
│  Selamat datang, [Nama User]                 │
│                           [Logout] ✕         │
├───────────────────────────────────────────────┤
│                                               │
│  📊 STATISTIK                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │ Jurnal   │ │ BK Case  │ │ Students │     │
│  │    12    │ │    5     │ │   156    │     │
│  └──────────┘ └──────────┘ └──────────┘     │
│                                               │
│  🔖 MODULE TABS                              │
│  [Jurnal] [BK] [Kesiswaan] [Pengguna]       │
│                                               │
│  ┌───────────────────────────────────────┐  │
│  │ CONTENT AREA                          │  │
│  │                                       │  │
│  │ Konten tab yang dipilih muncul di    │  │
│  │ sini. Bisa berupa tabel, form, dll   │  │
│  │                                       │  │
│  └───────────────────────────────────────┘  │
│                                               │
└───────────────────────────────────────────────┘
```

### Fitur Dashboard

✓ **Header Info:**
- Logo aplikasi
- Nama pengguna yang login
- Tombol logout
- User role badge

✓ **Statistik Cards:**
- Total data per modul
- Quick overview
- Tidak clickable (hanya info)

✓ **Navigation Tabs:**
- Jurnal Mengajar
- Bimbingan Konseling
- Kesiswaan
- Manajemen Pengguna (Admin only)

✓ **Role-Based Visibility:**
- Guru hanya lihat "Jurnal" tab
- BK lihat "Jurnal", "BK", "Kesiswaan"
- Admin lihat semua tab

---

## MODUL JURNAL MENGAJAR

Modul untuk **Guru** mencatat aktivitas mengajar harian.

### Akses Modul

```
LOGIN sebagai: guru@sekolah.test / password123
               ↓
DASHBOARD → Klik tab "JURNAL MENGAJAR"
               ↓
JURNAL MODULE TERBUKA
```

### 1. MEMBUAT JURNAL BARU

```
SCREEN: Jurnal Mengajar Module
┌──────────────────────────────────┐
│ JURNAL MENGAJAR                  │
├──────────────────────────────────┤
│ [+ Buat Jurnal Baru] [Filter ▼] │
├──────────────────────────────────┤
│                                  │
│ Tabel Jurnal:                    │
│ No | Tanggal | Kelas | Mapel   │
│ ... (list jurnal)                │
└──────────────────────────────────┘

STEP-BY-STEP:

1. Klik tombol "+ Buat Jurnal Baru"
   → Modal form terbuka

2. ISI FORM:
   
   Tanggal: 31-07-2026
   ↓
   Kelas: VIII-A (dropdown)
   ↓
   Mapel: Matematika (dropdown)
   ↓
   Materi: Persamaan Linear Dasar
   ↓
   Metode: Diskusi (dropdown)
   ↓
   Catatan: Siswa antusias, 2 anak kesulitan
   ↓

3. Klik tombol "SIMPAN"
   → Loading animation (~1 detik)
   → Success message "Jurnal berhasil dibuat"
   → Form close, entry muncul di table ✓
```

**Form Fields:**

| Field | Type | Contoh | Validasi |
|-------|------|--------|----------|
| Tanggal | Date | 2026-07-31 | Wajib, format valid |
| Kelas | Select | VIII-A | Wajib, dari opsi |
| Mapel | Select | Matematika | Wajib, dari opsi |
| Materi | Text | Aljabar Linier | Wajib, max 100 karakter |
| Metode | Select | Diskusi | Wajib, dari opsi |
| Catatan | Textarea | Kesan & pesan... | Opsional |

### 2. MELIHAT JURNAL

```
Jurnal terbuat otomatis tampil di tabel:

┌─────────────────────────────────────┐
│ Jurnal Saya (3 entries)            │
├─────────────────────────────────────┤
│ No | Tanggal | Kelas | Mapel      │
├─────────────────────────────────────┤
│ 1  │31-Jul   │VIII-A │Matematika  │
│ 2  │29-Jul   │VIII-A │Informatika │
│ 3  │27-Jul   │VII-B  │Matematika  │
├─────────────────────────────────────┤
│ [Edit] [Lihat] [Hapus]            │
└─────────────────────────────────────┘

FITUR TABLE:
✓ Sorting: Klik header untuk sort
✓ Pagination: Tombol prev/next
✓ Row action: Edit, Lihat, Hapus per baris
```

### 3. MENGUBAH JURNAL

```
CARA 1: Via Edit Button
1. Di tabel, klik tombol "Edit" pada baris
   → Modal edit terbuka
   → Form pre-filled dengan data lama

2. Ubah fields yang ingin dimodifikasi

3. Klik "SIMPAN PERUBAHAN"
   → Update success ✓
   → Tabel refresh otomatis

CARA 2: Via Double-Click
1. Double-click pada tabel row
   → Modal edit terbuka (jika di-support)
```

**Contoh Edit:**
```
BEFORE:
Tanggal: 31-Jul
Kelas: VIII-A
Catatan: Siswa antusias

AFTER (setelah ubah):
Tanggal: 31-Jul (sama)
Kelas: VII-B (ubah dari VIII-A)
Catatan: Siswa antusias, masih ada kesulitan

Result: ✓ Update berhasil
```

### 4. MENGHAPUS JURNAL

```
CARA 1: Hapus satu entry
1. Di tabel, klik tombol "Hapus" pada baris
   → Confirmation dialog
   "Yakin ingin menghapus jurnal ini?"
   [Batal] [Hapus]

2. Klik "Hapus"
   → Loading (~1 detik)
   → Entry hilang dari tabel ✓

CARA 2: Bulk delete (jika di-support)
1. Check checkbox untuk multiple entries
2. Klik "Hapus Terpilih"
3. Confirm
4. All selected entries deleted
```

### 5. FILTER JURNAL

```
SCREEN: Filter Controls
┌──────────────────────────────────┐
│ Filter:                          │
│ [Kelas: ▼ Semua]                │
│ [Mapel: ▼ Semua]                │
│ [Bulan: ▼ Juli 2026]            │
│ [Reset]  [Terapkan]             │
└──────────────────────────────────┘

CARA MENGGUNAKAN:

1. Klik dropdown Kelas
   Opsi: Semua, VII-A, VII-B, VIII-A, VIII-B, IX-A, IX-B

2. Pilih salah satu: VIII-A
   → Tabel otomatis filter

3. Klik dropdown Mapel
   Opsi: Semua, Matematika, Informatika, dll

4. Pilih: Matematika
   → Tabel filter lebih lanjut

5. Sekarang table hanya menunjukkan:
   Kelas VIII-A + Mapel Matematika

6. Untuk reset:
   Klik tombol "RESET"
   → Filter dihapus, semua jurnal tampil
```

---

## MODUL BIMBINGAN KONSELING

Modul untuk **Guru BK** mengelola kasus siswa.

### Akses Modul

```
LOGIN sebagai: bk@sekolah.test / password123
               ↓
DASHBOARD → Klik tab "BIMBINGAN KONSELING"
               ↓
BK MODULE TERBUKA
```

### 1. MEMBUAT KASUS BK

```
SCREEN: Bimbingan Konseling Module
┌────────────────────────────────────┐
│ BIMBINGAN KONSELING                │
├────────────────────────────────────┤
│ [+ Buat Kasus Baru] [Filter ▼]    │
├────────────────────────────────────┤
│                                    │
│ Tabel Kasus BK:                    │
│ Nama | Kelas | Status | Tindakan  │
│ ... (list kasus)                   │
└────────────────────────────────────┘

STEP-BY-STEP:

1. Klik "+ Buat Kasus Baru"
   → Modal form terbuka

2. ISIAN FORM:
   
   Nama Siswa: Alya Putri
   ↓
   NIS: 20231001
   ↓
   Kelas: VIII-A (dari list siswa)
   ↓
   Tipe Kasus: Perundungan (dropdown)
   ↓
   Deskripsi: Korban bullying dari teman sekelas
   ↓
   Tindakan Lanjut: Mediasi dengan pelaku & korban
   ↓
   Status: Baru (default)
   ↓

3. Klik "SIMPAN"
   → Case created ✓
   → Muncul di tabel dengan status "Baru"
```

**Form Fields:**

| Field | Type | Contoh | Validasi |
|-------|------|--------|----------|
| Nama Siswa | Select | Alya Putri | Wajib, pilih dari DB |
| NIS | Auto | 20231001 | Auto-fill saat pilih nama |
| Kelas | Auto | VIII-A | Auto-fill saat pilih nama |
| Tipe Kasus | Select | Perundungan | Wajib |
| Deskripsi | Textarea | Korban bullying... | Wajib |
| Tindakan Lanjut | Textarea | Mediasi... | Wajib |
| Status | Select | Baru | Default "Baru" |

### 2. MENGUBAH STATUS KASUS

```
CASE WORKFLOW:

BARU → DIPROSES → SELESAI
(Awal)  (Working)  (Closed)

CARA MENGUBAH STATUS:

1. Di tabel, lihat kolom "Status"
2. Klik status cell atau edit button
3. Modal update terbuka
4. Ubah status: Baru → Diproses
5. Tambah catatan: "Mediasi fase 1 sudah dilakukan"
6. Klik "SIMPAN"
   → Status updated ✓

STATUS MEANINGS:
├─ BARU: Case baru terima, belum diproses
├─ DIPROSES: Sedang dalam penanganan
└─ SELESAI: Case resolved/ditutup

COLOR INDICATORS:
Baru → Red badge
Diproses → Yellow badge
Selesai → Green badge ✓
```

### 3. MELIHAT DETAIL KASUS

```
CARA 1: Klik "Lihat Detail"
1. Di tabel, klik tombol "Lihat"
   → Detail modal/panel terbuka

CARA 2: Klik nama siswa
1. Di tabel, klik nama siswa
   → Detail panel terbuka

DETAIL YANG TAMPIL:
┌──────────────────────────────────┐
│ DETAIL KASUS                     │
├──────────────────────────────────┤
│ Nama: Alya Putri                 │
│ NIS: 20231001                    │
│ Kelas: VIII-A                    │
│ Status: Diproses                 │
│ Tipe: Perundungan                │
│                                  │
│ Deskripsi:                       │
│ Korban bullying dari teman...    │
│                                  │
│ Tindakan Lanjut:                 │
│ Mediasi dengan pelaku...         │
│                                  │
│ Timeline:                        │
│ - 14 Jul: Kasus dibuat           │
│ - 20 Jul: Status Diproses        │
│ - ...                            │
│                                  │
│ [Edit] [Hapus] [Print]          │
└──────────────────────────────────┘
```

### 4. MENGHAPUS KASUS

```
CARA MENGHAPUS:

1. Klik tombol "Hapus" di detail view
   atau di tabel

2. Confirmation dialog muncul:
   "Yakin hapus kasus ini? Tindakan tidak bisa dibatalkan."
   [Batal] [Hapus]

3. Klik "Hapus"
   → Case deleted dari database ✓
```

---

## MODUL KESISWAAN

Modul untuk **Wali Kelas & Admin** mengelola data siswa.

### Akses Modul

```
LOGIN sebagai: wali@sekolah.test / password123
  atau admin@sekolah.test / password123
               ↓
DASHBOARD → Klik tab "KESISWAAN"
               ↓
KESISWAAN MODULE TERBUKA
```

### 1. MELIHAT DATA SISWA

```
SCREEN: Kesiswaan Module
┌────────────────────────────────────┐
│ KESISWAAN                          │
│ [+ Tambah Siswa] [Filter ▼][🔍]  │
├────────────────────────────────────┤
│                                    │
│ Tabel Siswa:                       │
│ No | NIS | Nama | Kelas | Status  │
├────────────────────────────────────┤
│ 1  │20231001│Alya Putri│VIII-A│Aktif    │
│ 2  │20231002│Bima Saputra│VII-B│Aktif    │
│ 3  │20231003│Citra Dewi│VIII-A│Pindah   │
│ ... (banyak data)                  │
└────────────────────────────────────┘

FITUR VIEWING:
✓ Sort: Klik header untuk sort
✓ Pagination: Prev/Next buttons
✓ Row action: Edit, Lihat detail, Hapus
✓ Search: Cari by nama/NIS
```

### 2. MENAMBAH SISWA

```
STEP-BY-STEP:

1. Klik "+ Tambah Siswa"
   → Modal form terbuka

2. ISI FORM:

   NIS: 20231100
   ↓
   Nama: Doni Hermawan
   ↓
   Kelas: VIII-C (dropdown)
   ↓
   Tanggal Lahir: 15-03-2012
   ↓
   Jenis Kelamin: Laki-laki (radio)
   ↓
   Alamat: Jl. Merdeka No.123
   ↓
   Telepon Orang Tua: 081234567890
   ↓
   Wali Kelas: Dewi Wali (dropdown)
   ↓
   Status: Aktif (default)
   ↓

3. Klik "SIMPAN"
   → Student added ✓
   → Muncul di tabel
```

### 3. MENGUBAH DATA SISWA

```
CARA MENGEDIT:

1. Di tabel, klik tombol "Edit"
   → Modal edit terbuka
   → Form pre-filled

2. Ubah fields yang diperlukan:
   - Kelas: VII-B → VII-C
   - Status: Aktif → Pindah
   - Wali Kelas: Updated

3. Klik "SIMPAN PERUBAHAN"
   → Update berhasil ✓
```

### 4. LIHAT DETAIL SISWA

```
FITUR DETAIL VIEW:

┌────────────────────────────────┐
│ PROFIL SISWA                   │
├────────────────────────────────┤
│ 📷 [Avatar]  Alya Putri        │
│                                │
│ BIODATA:                       │
│ NIS: 20231001                  │
│ Kelas: VIII-A                  │
│ TTL: Jakarta, 01-01-2013      │
│ Jenis Kelamin: Perempuan       │
│ Alamat: Jl. Sudirman No.99    │
│ Telepon: 081111111111          │
│                                │
│ AKADEMIK:                      │
│ Status: Aktif                  │
│ Rata-rata Nilai: 85.5         │
│ Kehadiran: 95%                │
│                                │
│ KESEHATAN:                     │
│ Golongan Darah: O              │
│ Alergi: -                      │
│ Catatan: -                     │
│                                │
│ [Edit] [Print] [Hapus]        │
└────────────────────────────────┘
```

### 5. MENGHAPUS DATA SISWA

```
⚠️ HATI-HATI: Aksi tidak bisa dibatalkan!

LANGKAH:
1. Klik "Hapus" di detail view atau tabel
2. Confirmation: "Yakin hapus siswa ini?"
3. Klik "Hapus"
4. Student deleted ✓

NOTE: Disarankan ubah status jadi 
"Pindah" atau "Keluar" daripada hapus
untuk mempertahankan data historis.
```

---

## MODUL MANAJEMEN PENGGUNA

Modul untuk **Admin Only** mengelola akun pengguna.

### Akses Modul

```
LOGIN sebagai: admin@sekolah.test / password123
               ↓
DASHBOARD → Klik tab "MANAJEMEN PENGGUNA"
               ↓
USER MANAGEMENT MODULE TERBUKA

⚠️ Guru/BK/Wali tidak bisa akses modul ini!
```

### 1. MELIHAT SEMUA PENGGUNA

```
SCREEN: User Management
┌────────────────────────────────────┐
│ MANAJEMEN PENGGUNA                 │
│ [+ Buat User] [Filter ▼]          │
├────────────────────────────────────┤
│                                    │
│ Tabel Pengguna:                    │
│ No | Email | Nama | Role | Status │
├────────────────────────────────────┤
│ 1 │admin@sekolah.test  │Admin      │Active │
│ 2 │guru@sekolah.test   │Guru       │Active │
│ 3 │bk@sekolah.test     │Guru BK    │Active │
│ 4 │wali@sekolah.test   │Wali Kelas │Active │
│ 5 │siswa@sekolah.test  │Siswa      │Active │
│ ... lebih banyak                   │
└────────────────────────────────────┘

FITUR:
✓ Lihat semua user
✓ Filter by role
✓ Search by email/nama
✓ Sort by column
✓ Edit/Hapus per user
```

### 2. MEMBUAT USER BARU

```
STEP-BY-STEP:

1. Klik "+ Buat User Baru"
   → Modal registration form

2. ISI FORM:

   Email: newteacher@sekolah.test
   ↓
   Nama: Siti Nurhaliza
   ↓
   Password: SecurePass123! (min 8 char)
   ↓
   Konfirmasi Password: SecurePass123!
   ↓
   Role: guru (dropdown)
   Opsi: admin, guru, bk, wali, siswa, ortu
   ↓

3. Klik "BUAT AKUN"
   → User created ✓
   → Muncul di tabel dengan status "Active"
```

**Role Definitions:**

| Role | Akses | Keterangan |
|------|-------|-----------|
| admin | Semua | Akses penuh semua modul |
| guru | Jurnal | Hanya buat jurnal |
| bk | BK, Siswa | Kelola BK & data siswa |
| wali | Siswa | Limited access siswa |
| siswa | Profil | Lihat profil sendiri |
| ortu | Profil | Lihat profil anak |

### 3. MENGUBAH ROLE PENGGUNA

```
SCENARIO: Ubah guru menjadi guru BK

LANGKAH:

1. Di tabel, cari guru@sekolah.test
   Klik "Edit"

2. Modal edit terbuka
   Lihat field "Role"
   Current: guru

3. Klik dropdown Role
   Pilih: bk (Guru BK)

4. Klik "SIMPAN"
   → Role updated ✓

5. User sekarang bisa akses:
   - Bimbingan Konseling module
   - Kesiswaan module
   - Tetap bisa Jurnal
   - Tidak bisa Manajemen Pengguna
```

### 4. NONAKTIFKAN AKUN USER

```
SCENARIO: Teacher cuti, nonaktifkan akun sementara

LANGKAH:

1. Di tabel, cari email user
   Klik "Nonaktifkan" atau "Edit"

2. Modal terbuka
   Lihat field "Status"
   Current: Active

3. Ubah status:
   Active → Inactive

4. Klik "SIMPAN"
   → Account disabled ✓

5. User tidak bisa login lagi
   Ditampilkan error: "Account tidak aktif"

6. Untuk activate kembali:
   Edit → Status: Active → Save
```

### 5. RESET PASSWORD PENGGUNA

```
SCENARIO: User lupa password, reset dari admin

LANGKAH:

1. Di tabel, cari user tersebut
   Klik "Edit"

2. Modal edit terbuka
   Scroll ke field "Password"

3. Clear password field
   Masukkan password baru: TempPass123

4. Klik "RESET PASSWORD"
   → Password changed ✓

5. Inform user password barunya:
   Email: guru@sekolah.test
   Password: TempPass123
   (Minta user ubah password saat login pertama)
```

### 6. HAPUS AKUN PENGGUNA

```
⚠️ HATI-HATI: Permanent action!

LANGKAH:

1. Di tabel, klik "Hapus"
   atau di modal edit → "Hapus Akun"

2. Confirmation dialog:
   "Yakin hapus akun ini? Semua data akan hilang!"
   [Batal] [Hapus]

3. Klik "Hapus"
   → Account deleted permanently ✓

REKOMENDASI:
Daripada delete, lebih baik:
- Set status jadi Inactive (disable)
- Keep data untuk audit trail
- Dapat di-reactivate kapan saja
```

---

## FITUR UMUM

### 1. SEARCH & FILTER

Tersedia di semua modul untuk mencari data cepat.

```
SEARCH (Pencarian):
┌────────────────────────┐
│ 🔍 [____________]      │
│    Cari by nama/NIS    │
└────────────────────────┘

CARA PAKAI:
1. Klik input search
2. Ketik: "Alya" atau "20231001"
3. Real-time filter ✓

FILTER (Penyaringan):
┌────────────────────────┐
│ Filter ▼               │
│ ├─ By Kelas            │
│ ├─ By Status           │
│ ├─ By Tanggal          │
│ └─ Custom              │
└────────────────────────┘

CARA PAKAI:
1. Klik "Filter ▼"
2. Pilih kriteria
3. Set values
4. Klik "Terapkan"
5. Table filtered ✓
6. Klik "Reset" untuk clear
```

### 2. SORTING

Klik header tabel untuk sort.

```
SORT ASCENDING/DESCENDING:

Tabel header:
│ Name ▲ │ Date ◄ │ Status ▼ │

▲ = Ascending sort (A→Z, 0→9)
► = Descending sort (Z→A, 9→0)
◄ = No sort

CARA:
1. Klik header "Name"
   → Sort by name A→Z
2. Klik "Name" lagi
   → Sort by name Z→A
3. Klik lagi
   → Remove sort
```

### 3. PAGINATION

Navigate data dengan banyak baris.

```
PAGINATION CONTROL:
┌─────────────────────────────────┐
│ Showing 1-10 of 156 records     │
│ [◀ Prev]  [1] [2] [3]  [Next ▶] │
└─────────────────────────────────┘

CARA PAKAI:
1. Klik nomor halaman: [2]
   → Show records 11-20

2. Klik [Next ▶]
   → Go to next page

3. Klik [◀ Prev]
   → Go to previous page

4. Jump to page:
   Input field: Go to page [ 5 ]
   → Direct jump to page 5
```

### 4. MODAL DIALOGS

Pop-up untuk confirm action atau input data.

```
MODAL ANATOMY:
┌──────────────────────────────┐
│ Judul Modal         [✕] Close│
├──────────────────────────────┤
│                              │
│ Content:                     │
│ - Form fields                │
│ - atau Confirmation text     │
│ - atau Detail view           │
│                              │
├──────────────────────────────┤
│ [Cancel] [OK/Save/Delete]   │
└──────────────────────────────┘

INTERAKSI:
✓ Klik X → Close modal
✓ Klik Cancel → Discard & close
✓ Klik OK/Save → Apply action & close
✓ Klik outside modal → Close (jika cancelable)
✓ Press ESC → Close modal
```

### 5. TOAST NOTIFICATIONS

Pesan ringkas status action.

```
NOTIFICATION TYPES:

SUCCESS (Green):
┌─────────────────────────────┐
│ ✓ Jurnal berhasil dibuat     │
└─────────────────────────────┘
Durasi: 3-5 detik auto-hide

ERROR (Red):
┌─────────────────────────────┐
│ ✕ Gagal menyimpan data      │
│   Error: Duplicate NIS      │
└─────────────────────────────┘
Durasi: 5 detik atau klik X

INFO (Blue):
┌─────────────────────────────┐
│ ℹ Data loading... tunggu     │
└─────────────────────────────┘

WARNING (Orange):
┌─────────────────────────────┐
│ ⚠ Perubahan belum disimpan   │
└─────────────────────────────┘
```

---

## TIPS & TRICKS

### Tips Produktivitas

```
1. KEYBOARD SHORTCUTS:
   ✓ Ctrl+S → Save form (jika di-support)
   ✓ Ctrl+F → Open search
   ✓ Tab → Navigate form fields
   ✓ Enter → Submit form
   ✓ ESC → Close modal/cancel

2. BULK OPERATIONS:
   ✓ Select multiple checkbox
   ✓ Bulk action toolbar appears
   ✓ Delete/Update all selected

3. EXPORT DATA:
   ✓ Table → Print button
   ✓ Export as PDF
   ✓ Export as Excel (future)

4. DRAG & DROP:
   ✓ Reorder columns (jika supported)
   ✓ Reorder table rows

5. DARK MODE:
   ✓ Settings → Toggle dark mode
   ✓ Consistent throughout app
```

### Troubleshooting Tips

```
1. DATA TIDAK MUNCUL?
   ✓ Refresh page (F5)
   ✓ Check filter/search
   ✓ Check login user (role correct?)
   ✓ Clear browser cache

2. FORM TIDAK BISA SUBMIT?
   ✓ Check required fields (marked with *)
   ✓ Check validation errors (red messages)
   ✓ Try press Enter instead of click Save
   ✓ Reload page

3. MODAL STUCK/FROZEN?
   ✓ Press ESC to close
   ✓ Refresh page
   ✓ Check browser console for errors (F12)

4. SESSION TIMEOUT?
   ✓ Redirect to login
   ✓ Login again
   ✓ Data sudah tersimpan (safe)

5. SLOW PERFORMANCE?
   ✓ Close unused tabs
   ✓ Clear browser cache
   ✓ Disable browser extensions
   ✓ Check internet connection
```

### Best Practices

```
1. ALWAYS:
   ✓ Save sebelum navigasi ke halaman lain
   ✓ Logout sebelum tutup browser
   ✓ Refresh jika ada perubahan dari user lain
   ✓ Use unique NIS/Email untuk data baru

2. NEVER:
   ✗ Don't force close browser (logout first)
   ✗ Don't delete data penting tanpa backup
   ✗ Don't share login credentials
   ✗ Don't use browser back button (use app navigation)

3. SECURITY:
   ✓ Change default password
   ✓ Use strong password (min 8 char)
   ✓ Don't share session/device
   ✓ Logout after use
   ✓ Report suspicious activity
```

---

**End of Feature Guide**

Untuk bantuan lebih lanjut, lihat:
- DOKUMENTASI_TEKNIS.md (Technical details)
- INSTALLATION_SETUP_GUIDE.md (Setup help)
- README.md (Project overview)
