# Software Requirements Specification (SRS)
## SIS-TERPADU — Sistem Informasi Sekolah Terpadu

**Versi:** 1.0  
**Tanggal:** 2026-07-30  
**Kelompok:** Advanced Software Testing & Quality Assurance (ASTQA)  
**Mata Kuliah:** Advanced Software Testing & Quality Assurance  

---

## 1. Pendahuluan

### 1.1 Tujuan Dokumen
Dokumen SRS ini mendefinisikan kebutuhan fungsional dan non-fungsional sistem **SIS-TERPADU**, yaitu aplikasi web manajemen sekolah terintegrasi yang dikembangkan sebagai tugas *Scalable System Design* dan diuji dalam tugas *Advanced Software Testing & QA*.

### 1.2 Ruang Lingkup Sistem
SIS-TERPADU adalah aplikasi web satu halaman (*Single Page Application*) berbasis React yang menyediakan empat modul utama:
- **Jurnal Mengajar** — Pencatatan aktivitas pembelajaran harian guru
- **Bimbingan Konseling (BK)** — Manajemen kasus bimbingan konseling siswa
- **Kesiswaan** — Pengelolaan data dan status siswa
- **Manajemen Pengguna** — Administrasi akun pengguna oleh admin

### 1.3 Definisi dan Singkatan
| Istilah | Keterangan |
|---------|-----------|
| SPA | Single Page Application |
| IndexedDB | Database sisi klien berbasis browser |
| Role | Peran pengguna dalam sistem |
| FR | Functional Requirement (Kebutuhan Fungsional) |
| NFR | Non-Functional Requirement (Kebutuhan Non-Fungsional) |
| UAT | User Acceptance Testing |

### 1.4 Pengguna Sistem
| Role | Deskripsi | Modul yang Dapat Diakses |
|------|-----------|--------------------------|
| Admin | Administrator sistem | Jurnal, BK, Kesiswaan, Pengguna |
| Guru | Guru mata pelajaran | Jurnal |
| Guru BK | Konselor sekolah | BK, Kesiswaan |
| Wali Kelas | Wali kelas siswa | Kesiswaan |
| Siswa | Siswa sekolah | Jurnal (read-only) |
| Orang Tua | Orang tua siswa | Kesiswaan (read-only) |

---

## 2. Kebutuhan Fungsional (Functional Requirements)

### FR-01: Autentikasi dan Otorisasi Berbasis Peran
**Deskripsi:** Sistem harus menyediakan mekanisme login yang membatasi akses berdasarkan peran pengguna.

**Detail:**
- FR-01.1: Pengguna harus login menggunakan email dan password yang valid.
- FR-01.2: Sistem menampilkan pesan error yang informatif jika kredensial salah.
- FR-01.3: Sistem mengunci akun sementara selama **30 detik** setelah **5 kali percobaan login gagal** (brute-force protection).
- FR-01.4: Setiap role hanya dapat mengakses modul yang diizinkan (role-based access control).
- FR-01.5: Sesi pengguna disimpan di localStorage dan dihapus saat logout.

**Kriteria Penerimaan:**
- Login dengan kredensial valid → redirect ke dashboard
- Login dengan password salah 5x → tampil pesan lockout dengan countdown
- Akses modul tidak sah → modul tidak tampil di sidebar

---

### FR-02: Manajemen Jurnal Mengajar (CRUD)
**Deskripsi:** Guru dapat mencatat, melihat, dan menghapus jurnal kegiatan mengajar harian.

**Detail:**
- FR-02.1: Guru dapat mengisi formulir jurnal dengan field: tanggal, kelas, mata pelajaran, materi, metode, dan catatan.
- FR-02.2: Sistem menolak penginputan tanggal yang melebihi hari ini (validasi tanggal masa depan).
- FR-02.3: Guru dapat melihat riwayat jurnal sendiri dengan paginasi (10 item per halaman).
- FR-02.4: Guru dapat menghapus jurnal dengan konfirmasi modal.
- FR-02.5: Data jurnal dapat diekspor ke format **CSV**.
- FR-02.6: Sistem menyediakan fungsi **cetak/print** untuk daftar jurnal.

**Kriteria Penerimaan:**
- Form berhasil disimpan → muncul di tab Riwayat
- Tanggal masa depan → form ditolak, pesan error tampil
- Tombol Hapus → modal konfirmasi muncul sebelum penghapusan

---

### FR-03: Manajemen Kasus Bimbingan Konseling (BK)
**Deskripsi:** Guru BK dapat mencatat dan mengelola kasus bimbingan konseling siswa.

**Detail:**
- FR-03.1: Guru BK dapat menambahkan kasus baru dengan field: nama siswa, NIS, kelas, jenis kasus, tindak lanjut, status, tanggal, dan penanggung jawab.
- FR-03.2: Guru BK dapat melihat daftar semua kasus dengan filter pencarian real-time.
- FR-03.3: Guru BK dapat menghapus kasus dengan konfirmasi modal.
- FR-03.4: Status kasus tersedia dalam tiga nilai: Proses, Selesai, Rujukan.

**Kriteria Penerimaan:**
- Pencarian menggunakan nama/NIS/kelas → daftar terfilter secara instan
- Status ditampilkan dengan badge berwarna berbeda

---

### FR-04: Manajemen Data Kesiswaan
**Deskripsi:** Admin dan Wali Kelas dapat melihat dan mengelola data siswa.

**Detail:**
- FR-04.1: Data siswa mencakup: nama, NIS, kelas, status keaktifan, dan wali kelas.
- FR-04.2: Status siswa tersedia dalam tiga nilai: Aktif, Tidak Aktif, Pindahan.
- FR-04.3: Tersedia pencarian real-time berdasarkan nama atau NIS.
- FR-04.4: Admin dapat menghapus data siswa dengan konfirmasi modal.

**Kriteria Penerimaan:**
- Data siswa ditampilkan dalam tabel dengan badge status berwarna
- Penghapusan hanya dapat dilakukan oleh Admin

---

### FR-05: Manajemen Pengguna (Admin Only)
**Deskripsi:** Admin dapat melihat, menambah, dan menghapus akun pengguna sistem.

**Detail:**
- FR-05.1: Admin dapat melihat daftar semua pengguna dengan informasi: nama, email, dan role.
- FR-05.2: Admin dapat menambahkan pengguna baru dengan memilih role yang tersedia.
- FR-05.3: Admin dapat menghapus pengguna (kecuali akun sendiri) dengan konfirmasi modal.
- FR-05.4: Statistik jumlah pengguna per role ditampilkan di bagian atas halaman.

**Kriteria Penerimaan:**
- Pengguna baru muncul di daftar setelah ditambahkan
- Admin tidak dapat menghapus akun dirinya sendiri
- Statistik role diperbarui secara real-time

---

### FR-06: Logging Aktivitas
**Deskripsi:** Sistem mencatat aktivitas login pengguna untuk keperluan audit.

**Detail:**
- FR-06.1: Setiap event login berhasil dicatat dalam tabel activityLogs.
- FR-06.2: Log menyimpan: email pengguna, jenis aksi, dan timestamp.

---

## 3. Kebutuhan Non-Fungsional (Non-Functional Requirements)

### NFR-01: Performa (Performance)
| Parameter | Target |
|-----------|--------|
| Waktu muat halaman pertama | < 3 detik pada koneksi 3G |
| Waktu respons operasi CRUD | < 500ms (IndexedDB lokal) |
| Rendering komponen | < 100ms setelah interaksi pengguna |
| Bundle size (gzip) | < 500KB untuk initial chunk |

**Pengukuran:** Lighthouse Performance Score ≥ 85 pada kondisi jaringan normal.

---

### NFR-02: Skalabilitas (Scalability)
| Aspek | Keterangan |
|-------|-----------|
| Arsitektur | SPA dengan client-side storage (IndexedDB); dapat di-upgrade ke backend REST API |
| Pengguna konkuren | Hingga 1 pengguna per sesi browser (client-side); desain API contract siap untuk multi-user |
| Volume data | IndexedDB mendukung hingga beberapa GB data per origin |
| Modularitas | Kode terstruktur agar mudah dipindahkan ke microservices (setiap modul = satu endpoint API) |
| CDN-ready | Semua aset statis dapat didistribusikan melalui CDN |

---

### NFR-03: Keamanan (Security)
| Aspek | Implementasi |
|-------|-------------|
| Brute-force protection | Kunci akun 30 detik setelah 5 kali gagal login |
| Role-based access | Modul hanya ditampilkan sesuai role; validasi pada setiap operasi |
| Session management | Sesi disimpan di localStorage; logout menghapus sesi sepenuhnya |
| Input validation | Validasi tanggal, field wajib, dan panjang input pada semua formulir |
| No sensitive data exposure | Password tidak ditampilkan di UI; aktivitas log tidak menampilkan password |
| XSS prevention | React DOM escaping secara default mencegah script injection |

---

### NFR-04: Kegunaan (Usability)
- Antarmuka responsif: sidebar collapsible pada layar kecil
- Konfirmasi modal sebelum setiap operasi penghapusan
- Loading skeleton saat data sedang dimuat dari IndexedDB
- Pesan error yang deskriptif untuk setiap kegagalan validasi
- Desain konsisten menggunakan tema neo-brutalism

---

### NFR-05: Keandalan (Reliability)
- Data tersimpan secara persisten di IndexedDB (tetap ada setelah refresh browser)
- Seed data otomatis saat database kosong (first-time setup)
- Graceful error handling pada setiap operasi database

---

## 4. Batasan Sistem (Constraints)

1. **Client-side only**: Saat ini tidak memiliki backend server; semua data tersimpan di browser (IndexedDB)
2. **Single browser session**: Data tidak tersinkronisasi antar browser atau perangkat berbeda
3. **No real authentication server**: Verifikasi password dilakukan di sisi klien
4. **Modern browser required**: Membutuhkan browser dengan dukungan IndexedDB dan ES Modules

---

## 5. Asumsi

1. Sistem dijalankan di lingkungan browser modern (Chrome 90+, Firefox 88+, Edge 90+)
2. Pengguna memiliki akses internet untuk memuat dependensi saat pertama kali
3. Data demo tersedia sejak pertama kali aplikasi dibuka

---

*Dokumen ini merupakan bagian dari Tugas UAS mata kuliah Advanced Software Testing & Quality Assurance.*
