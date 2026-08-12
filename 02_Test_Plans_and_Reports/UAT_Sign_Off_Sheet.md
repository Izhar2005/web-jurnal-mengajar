# UAT Sign-Off Sheet
## SIS-TERPADU — User Acceptance Testing

**Versi Aplikasi:** 1.0  
**Tanggal UAT:** 2026-07-30  
**Environment:** Local (http://localhost:8082)  

---

## 1. Daftar Penguji

| Nama | Role dalam Kelompok | Role Diuji dalam Sistem |
|------|-------------------|------------------------|
| [Nama Penguji 1] | Ketua | Admin |
| [Nama Penguji 2] | Anggota | Guru |
| [Nama Penguji 3] | Anggota | Guru BK |
| [Nama Penguji 4] | Anggota | Wali Kelas |

---

## 2. Skenario UAT

### Skenario 1: Login & Navigasi (Semua Role)

| # | Langkah | Data Uji | Expected Result | Status | Catatan |
|---|---------|----------|----------------|--------|---------|
| 1 | Buka aplikasi di browser | http://localhost:8082 | Halaman login tampil | ☐ Pass / ☐ Fail | |
| 2 | Login dengan akun Admin | `admin@sekolah.test` / `password123` | Dashboard admin, semua modul di sidebar | ☐ Pass / ☐ Fail | |
| 3 | Login dengan akun Guru | `guru@sekolah.test` / `password123` | Hanya modul Jurnal tersedia | ☐ Pass / ☐ Fail | |
| 4 | Login dengan akun BK | `bk@sekolah.test` / `password123` | Modul BK & Kesiswaan tersedia | ☐ Pass / ☐ Fail | |
| 5 | Login dengan password salah | `admin@sekolah.test` / `salah123` | Pesan error "Password salah" | ☐ Pass / ☐ Fail | |
| 6 | Gagal login 5x berturut-turut | password salah | Pesan "Akun dikunci 30 detik" | ☐ Pass / ☐ Fail | |
| 7 | Klik tombol Logout | - | Kembali ke halaman login | ☐ Pass / ☐ Fail | |

**Sub-total Skenario 1:** ___ / 7 PASS

---

### Skenario 2: Jurnal Mengajar (Role: Guru)

| # | Langkah | Data Uji | Expected Result | Status | Catatan |
|---|---------|----------|----------------|--------|---------|
| 1 | Login sebagai Guru | `guru@sekolah.test` / `password123` | Dashboard tampil | ☐ Pass / ☐ Fail | |
| 2 | Isi form jurnal (semua field valid) | Tanggal: hari ini, Kelas: IX-A, Mapel: Matematika, Materi: Persamaan, Metode: Diskusi | Jurnal tersimpan, muncul di riwayat | ☐ Pass / ☐ Fail | |
| 3 | Isi form jurnal dengan tanggal masa depan | Tanggal: 2027-01-01 | Form ditolak, pesan error tanggal | ☐ Pass / ☐ Fail | |
| 4 | Isi form jurnal dengan field kosong | Biarkan satu field kosong | Form tidak terkirim | ☐ Pass / ☐ Fail | |
| 5 | Klik tab Riwayat | - | Daftar jurnal tampil | ☐ Pass / ☐ Fail | |
| 6 | Klik tombol Export CSV | - | File jurnal.csv ter-download | ☐ Pass / ☐ Fail | |
| 7 | Klik tombol Print | - | Dialog print browser muncul | ☐ Pass / ☐ Fail | |
| 8 | Klik tombol Hapus pada satu jurnal | - | Modal konfirmasi muncul | ☐ Pass / ☐ Fail | |
| 9 | Konfirmasi hapus | - | Jurnal terhapus dari daftar | ☐ Pass / ☐ Fail | |
| 10 | Batalkan hapus dari modal | - | Jurnal tetap ada | ☐ Pass / ☐ Fail | |

**Sub-total Skenario 2:** ___ / 10 PASS

---

### Skenario 3: Bimbingan Konseling (Role: Guru BK)

| # | Langkah | Data Uji | Expected Result | Status | Catatan |
|---|---------|----------|----------------|--------|---------|
| 1 | Login sebagai Guru BK | `bk@sekolah.test` / `password123` | Dashboard BK tampil | ☐ Pass / ☐ Fail | |
| 2 | Tambah kasus BK baru | Isi semua field termasuk nama, NIS, kasus | Kasus tersimpan & muncul di daftar | ☐ Pass / ☐ Fail | |
| 3 | Cari kasus menggunakan nama siswa | Ketik nama siswa di search box | Daftar difilter | ☐ Pass / ☐ Fail | |
| 4 | Cari dengan teks tidak ada | `zzz tidak ada` | Hasil kosong "Tidak ada kasus" | ☐ Pass / ☐ Fail | |
| 5 | Hapus kasus BK | Klik hapus → konfirmasi | Kasus terhapus dari daftar | ☐ Pass / ☐ Fail | |

**Sub-total Skenario 3:** ___ / 5 PASS

---

### Skenario 4: Data Kesiswaan (Role: Wali Kelas)

| # | Langkah | Data Uji | Expected Result | Status | Catatan |
|---|---------|----------|----------------|--------|---------|
| 1 | Login sebagai Wali Kelas | `wali@sekolah.test` / `password123` | Modul Kesiswaan tersedia | ☐ Pass / ☐ Fail | |
| 2 | Lihat daftar siswa | - | Daftar siswa dengan status badge tampil | ☐ Pass / ☐ Fail | |
| 3 | Cari siswa dengan nama | Nama siswa yang ada | Daftar terfilter | ☐ Pass / ☐ Fail | |
| 4 | Lihat badge status | - | Aktif (hijau), Tidak Aktif (merah), Pindahan (oranye) | ☐ Pass / ☐ Fail | |

**Sub-total Skenario 4:** ___ / 4 PASS

---

### Skenario 5: Manajemen Pengguna (Role: Admin)

| # | Langkah | Data Uji | Expected Result | Status | Catatan |
|---|---------|----------|----------------|--------|---------|
| 1 | Login sebagai Admin | `admin@sekolah.test` / `password123` | Modul Pengguna tersedia | ☐ Pass / ☐ Fail | |
| 2 | Lihat daftar pengguna | - | Daftar semua user + statistik role | ☐ Pass / ☐ Fail | |
| 3 | Tambah pengguna baru | Nama: Test User, Email baru, Role: guru | User baru muncul di daftar | ☐ Pass / ☐ Fail | |
| 4 | Coba hapus akun admin sendiri | Klik hapus pada akun admin aktif | Tombol hapus tidak tersedia / ditolak | ☐ Pass / ☐ Fail | |
| 5 | Hapus pengguna lain | Klik hapus → konfirmasi | Pengguna terhapus | ☐ Pass / ☐ Fail | |

**Sub-total Skenario 5:** ___ / 5 PASS

---

## 3. Ringkasan Hasil UAT

| Skenario | Total Test | PASS | FAIL |
|---------|-----------|------|------|
| Login & Navigasi | 7 | | |
| Jurnal Mengajar | 10 | | |
| Bimbingan Konseling | 5 | | |
| Data Kesiswaan | 4 | | |
| Manajemen Pengguna | 5 | | |
| **TOTAL** | **31** | | |

**Persentase Keberhasilan:** _____ %

---

## 4. Daftar Bug / Temuan

| ID | Deskripsi | Severity | Status |
|----|-----------|----------|--------|
| BUG-01 | | | |
| BUG-02 | | | |

---

## 5. Keputusan Sign-Off

> Dengan menandatangani dokumen ini, penguji menyatakan bahwa aplikasi SIS-TERPADU v1.0 telah diuji sesuai skenario di atas dan **dinyatakan [DITERIMA / DITOLAK]** untuk digunakan.

| Nama | Tanda Tangan | Tanggal | Keputusan |
|------|-------------|---------|-----------|
| [Nama Penguji 1] | _______________ | 2026-07-30 | ☐ Diterima / ☐ Ditolak |
| [Nama Penguji 2] | _______________ | 2026-07-30 | ☐ Diterima / ☐ Ditolak |
| [Nama Penguji 3] | _______________ | 2026-07-30 | ☐ Diterima / ☐ Ditolak |
| [Nama Penguji 4] | _______________ | 2026-07-30 | ☐ Diterima / ☐ Ditolak |

---

*Dokumen ini merupakan bagian dari Tugas UAS mata kuliah Advanced Software Testing & Quality Assurance.*
