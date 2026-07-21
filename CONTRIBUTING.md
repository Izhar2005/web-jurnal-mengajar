# Contributing & Team Responsibilities

This file documents the team members, their assigned responsibilities, and a short checklist for contributions and assessment.

## Team

- Izhar — NIM: 105851109023
- MUH RAFLI — NIM: 105841108723
- M Erwin Khusnaedy — NIM: 105841120623
- NAWAT SAKTI AL'AGASI — NIM: 105841108823

## Assigned Tasks (dibagi merata)

- Izhar
  - Implementasi komponen UI utama (header, sidebar, forms)
  - Routing & halaman modul (jurnal, BK, kesiswaan)
  - Review dan merge PR terkait UI

- MUH RAFLI
  - Pengelolaan mock backend (`src/lib/mockBackend.ts`) dan model data
  - Perbaikan persistence (IndexedDB), validasi data, logging aktivitas
  - Integrasi API stubs jika diperlukan

- M Erwin Khusnaedy
  - Menulis dan memperkaya dokumentasi (`README.md`, `docs/*`)
  - Menyiapkan script build/test, verifikasi build produksi
  - Menyiapkan instruksi penilaian dan checklist

- NAWAT SAKTI AL'AGASI
  - Styling dan tema (styles.css, tailwind config jika ada)
  - Perbaikan aksesibilitas dan responsif
  - Menyiapkan langkah deploy sederhana / preview

## Cara berkontribusi (singkat)

1. Buat branch baru untuk setiap fitur/bugfix: `git checkout -b feat/<deskripsi-singkat>`
2. Commit sering dengan pesan jelas (lihat "Aturan commit" di bawah)
3. Push branch ke remote dan buka Pull Request
4. Sertakan deskripsi singkat, langkah reproduksi, dan file yang diubah
5. Satu anggota lain melakukan review dan merge

### Aturan commit sederhana
- Format: `<type>: <pesan singkat>`
- Contoh: `feat: tambah form jurnal` ; `fix: perbaiki validasi tanggal`

### Pull request checklist
- [ ] Kode terformat (jalankan `npm run format` bila diperlukan)
- [ ] Lint tidak error (`npm run lint`)
- [ ] Deskripsi PR jelas dan mencantumkan perubahan utama
- [ ] Jika mengubah data model, perbarui `docs/ERD.svg` atau dokumentasi terkait

## Checklist penilaian (sesuai bobot yang diberikan)

Gunakan checklist ini untuk memastikan semua aspek penilaian terpenuhi sebelum final submission.

- [ ] Kelengkapan source code proyek (25%): Semua modul, komponen, dan file yang relevan ada.
- [ ] Struktur folder & kerapian kode (15%): Komponen di `src/components`, hooks di `src/hooks`, lib di `src/lib`.
- [ ] Kelengkapan `README.md` (20%): Deskripsi, instalasi, cara run, akun demo, diagram.
- [ ] Dokumentasi instalasi & menjalankan (15%): Langkah detil, prasyarat, build preview.
- [ ] Rancangan DB, ERD & diagram arsitektur (15%): `docs/ERD.svg`, `docs/architecture.svg` tersedia.
- [ ] Riwayat commit & kontribusi (10%): Commit terstruktur, log commit, PR history.

## Catatan tambahan
- Jika perlu memindahkan tugas atau menukar peran, diskusikan dan catat perubahan di sini.
- Untuk penilaian akhir, pastikan repo di-push ke GitHub dan link repo disertakan.
