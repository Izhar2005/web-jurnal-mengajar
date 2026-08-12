# NASKAH PRESENTASI YOUTUBE — SIS-TERPADU
## Code Walkthrough & Penjelasan Program Lengkap
## Format: Video Solo / Narasi Layar | Durasi: ~20–25 menit

---

## PETUNJUK PENGGUNAAN NASKAH INI

- **[TAMPILKAN: ...]** → Arahkan kamera/screen ke file atau tampilan yang disebutkan
- **[HIGHLIGHT: ...]** → Sorot/select baris kode yang dimaksud di editor
- **[ZOOM: ...]** → Zoom in ke bagian tertentu di layar
- **[DEMO: ...]** → Lakukan aksi di browser/terminal
- **(jeda)** → Pause sebentar, biarkan penonton membaca kode di layar

---

---

## BAGIAN 1: PEMBUKAAN
**Durasi: ~1 menit | Tampilan: Layar desktop, folder project terbuka**

---

"Halo semuanya, selamat datang di video ini.

Di video ini kita akan melihat secara detail bagaimana kode program **SIS-TERPADU** — atau Sistem Informasi Sekolah Terpadu — bekerja dari dalam.

Ini adalah aplikasi web untuk manajemen sekolah yang dibangun menggunakan **React 19, TypeScript, dan TanStack Router**, dengan penyimpanan data berbasis **IndexedDB** di browser — jadi tidak perlu server backend sama sekali.

Aplikasi ini punya empat modul utama: Jurnal Mengajar untuk guru, Bimbingan Konseling untuk guru BK, Data Kesiswaan untuk wali kelas dan admin, dan Manajemen Pengguna khusus untuk admin.

Di video ini, kita akan bedah kodenya file per file, mulai dari struktur data, cara kerja mock backend, hingga bagaimana komponen React menampilkan semuanya ke layar.

Kalau kamu sedang belajar React, TypeScript, atau cara kerja IndexedDB — ini sangat relevan buat kamu.

Langsung kita mulai."

---

---

## BAGIAN 2: STRUKTUR FOLDER PROJECT
**Durasi: ~1.5 menit | Tampilan: VS Code, file explorer terbuka**

---

**[TAMPILKAN: VS Code dengan file explorer di panel kiri]**

"Pertama kita lihat dulu struktur foldernya.

Di root project kita punya beberapa file konfigurasi: `vite.config.ts` untuk build tool, `tsconfig.json` untuk TypeScript, `vitest.config.ts` untuk unit testing, dan `package.json` yang menyimpan semua dependensi.

Yang paling penting buat kita sekarang adalah folder `src`.

**[EXPAND: folder src di file explorer]**

Di dalam `src`, ada tiga sub-folder utama.

Pertama, folder `routes`. Di sinilah halaman-halaman aplikasi tinggal. File `__root.tsx` adalah layout global, dan `index.tsx` adalah halaman utama — file ini berisi hampir seluruh UI aplikasi kita.

Kedua, folder `lib`. Di sini ada dua file: `mockBackend.ts` yang merupakan jantung dari sistem ini — semua logika bisnis dan penyimpanan data ada di sini — dan `utils.ts` untuk helper kecil.

Ketiga, folder `components/ui`. Ini berisi semua komponen antarmuka seperti Button, Dialog, Table, Input — semuanya berbasis Radix UI yang dimodifikasi dengan styling sendiri.

Strateginya sederhana: `mockBackend.ts` bertanggung jawab atas data, `index.tsx` bertanggung jawab atas tampilan, dan keduanya terhubung lewat fungsi yang diimport."

---

---

## BAGIAN 3: TIPE DATA (mockBackend.ts — Bagian Atas)
**Durasi: ~2.5 menit | Tampilan: src/lib/mockBackend.ts, baris 1–60**

---

**[TAMPILKAN: src/lib/mockBackend.ts, scroll ke paling atas]**

"Kita buka dulu file `mockBackend.ts`. File ini panjang — sekitar 530 baris — tapi sangat terstruktur, jadi mudah dibaca.

Baris pertama langsung mendefinisikan tipe-tipe data yang digunakan seluruh aplikasi."

**[HIGHLIGHT: baris `export type UserRole = ...`]**

"Ini `UserRole`. Tipe ini mendefinisikan enam nilai yang valid: `admin`, `guru`, `bk`, `wali`, `siswa`, dan `ortu`. Karena pakai TypeScript, kalau kita coba assign nilai lain selain enam ini, compiler langsung error. Ini keamanan tipe pada compile-time.

**(jeda)**

**[HIGHLIGHT: blok `export type User = { ... }`]**

Selanjutnya tipe `User`. Setiap user punya `id` bertipe number, `nama` dan `email` bertipe string, `role` yang menggunakan tipe `UserRole` tadi, dan `password`.

Perlu dicatat — di aplikasi ini password disimpan plaintext karena ini environment development dan demo. Kalau di production nyata, password wajib di-hash menggunakan bcrypt atau argon2.

**(jeda)**

**[HIGHLIGHT: blok `export type JournalEntry = { ... }`]**

`JournalEntry` adalah tipe untuk satu entri jurnal mengajar. Ada `id`, `tanggal`, `kelas`, `mapel` untuk mata pelajaran, `materi`, `metode` mengajar, `catatan`, dan `authorEmail` yang menyimpan email guru yang membuat jurnal itu.

**(jeda)**

**[HIGHLIGHT: blok `export type BkCase = { ... }`]**

`BkCase` untuk data kasus Bimbingan Konseling. Ada nama dan NIS siswa, kelas, deskripsi kasus, tindak lanjut, status kasus, tanggal, dan nama penanggung jawab.

**(jeda)**

**[HIGHLIGHT: blok `export type StudentRecord = { ... }`]**

`StudentRecord` untuk data siswa — nama, NIS, kelas, status aktif atau tidak, dan nama wali kelasnya.

**(jeda)**

**[HIGHLIGHT: blok `export type ActivityLog = { ... }`]**

`ActivityLog` ini menarik — ini adalah audit trail. Setiap kali ada operasi penting, sistem otomatis mencatat siapa yang melakukannya, aksi apa, dan kapan. Berguna untuk debugging dan keamanan.

**(jeda)**

**[HIGHLIGHT: baris `type AppStore = { ... }`]**

Terakhir di bagian ini, `AppStore`. Ini adalah tipe yang merepresentasikan keseluruhan database kita — satu objek yang berisi array dari semua tipe data tadi. Konsepnya mirip schema database tapi dalam format TypeScript."

---

---

## BAGIAN 4: SEED DATA & KONSTANTA
**Durasi: ~2 menit | Tampilan: mockBackend.ts baris 60–130**

---

**[SCROLL ke baris sekitar 60, highlight konstanta]**

"Setelah definisi tipe, kita lihat konstanta-konstanta penting.

**[HIGHLIGHT: empat baris STORAGE_KEY, SESSION_KEY, DB_NAME, DB_VERSION]**

`STORAGE_KEY` adalah nama key di localStorage untuk backup data lama. `SESSION_KEY` adalah key untuk menyimpan session pengguna yang sedang login. `DB_NAME` dan `DB_VERSION` adalah identifier untuk database IndexedDB.

**[HIGHLIGHT: `const STORE_NAMES`]**

`STORE_NAMES` adalah array berisi nama-nama object store di IndexedDB — mirip nama tabel kalau di database relasional. Kita punya lima store: users, journalEntries, bkCases, students, dan activityLogs.

**(jeda)**

**[SCROLL ke `const seedStore`]**

Ini bagian yang menarik — `seedStore`. Ini adalah data awal yang akan dimasukkan ke database saat pertama kali aplikasi dijalankan.

**[HIGHLIGHT: array users di dalam seedStore]**

Di sini kita definisikan lima user demo: Admin Sekolah dengan role admin, Budi Guru dengan role guru, Rina BK dengan role bk, Dewi Wali dengan role wali, dan Siswa A dengan role siswa. Semua pakai password yang sama untuk kemudahan demo.

**[HIGHLIGHT: array journalEntries]**

Ada dua contoh jurnal mengajar sudah dimasukkan — satu untuk kelas VIII-A tentang Aljabar Linear, satu untuk kelas VII-B tentang Struktur Data Array.

**[HIGHLIGHT: array bkCases]**

Satu contoh kasus BK untuk siswa bernama Alya Putri dengan kasus kehadiran terlambat.

**[HIGHLIGHT: array students]**

Dua data siswa — Alya Putri dan Bima Saputra.

Seed data ini penting karena memastikan aplikasi langsung bisa dicoba tanpa perlu input data manual dari nol."

---

---

## BAGIAN 5: SETUP INDEXEDDB
**Durasi: ~3 menit | Tampilan: mockBackend.ts baris 130–260**

---

**[SCROLL ke fungsi `openDatabase`]**

"Sekarang masuk ke bagian paling teknis — setup IndexedDB.

IndexedDB adalah database yang built-in di setiap browser modern. Kita tidak perlu install apapun. Datanya persisten — tidak hilang meski halaman di-refresh.

**[HIGHLIGHT: fungsi `openDatabase`]**

Fungsi `openDatabase` membuka koneksi ke database. Parameter pertama `window.indexedDB.open` adalah nama database, parameter kedua adalah versi.

**[HIGHLIGHT: `request.onupgradeneeded`]**

`onupgradeneeded` ini penting — event ini dipanggil ketika database pertama kali dibuat, atau ketika versinya dinaikkan. Di sinilah kita membuat struktur database.

**[HIGHLIGHT: `STORE_NAMES.forEach`]**

Kita loop semua nama store, dan untuk setiap nama yang belum ada, kita buat object store baru dengan `keyPath: 'id'` — artinya field `id` di setiap record menjadi primary key.

**[HIGHLIGHT: `usersStore.createIndex('email', 'email', { unique: true })`]**

Untuk store users, kita tambahkan index pada field email dengan constraint `unique: true` — ini memastikan tidak ada dua user dengan email yang sama, sama seperti `UNIQUE` constraint di SQL.

**(jeda)**

**[SCROLL ke fungsi `bootstrapDatabase`]**

Fungsi `bootstrapDatabase` lebih kompleks. Ini yang dipanggil saat aplikasi pertama kali dimuat.

**[HIGHLIGHT: blok `legacyRaw`]**

Pertama dia cek apakah ada data lama di localStorage — ini untuk migrasi dari versi sebelumnya yang pakai localStorage sebagai storage utama. Kalau ada, data itu dipindahkan ke IndexedDB, lalu key di localStorage dihapus. Ini teknik migration yang bersih.

**[HIGHLIGHT: blok `counts` dan `if (counts.some(...))`]**

Kemudian dia hitung isi masing-masing store. Kalau ada store yang kosong, artinya database baru pertama kali dibuat — jadi dia masukkan seed data.

**[HIGHLIGHT: for loop seeding]**

Perhatikan pattern ini: kita pakai `store.put(item)` bukan `store.add(item)`. Bedanya: `add` gagal kalau ID sudah ada, sedangkan `put` akan overwrite. Ini lebih aman untuk idempotent seeding.

**(jeda)**

**[HIGHLIGHT: variabel `dbPromise` dan fungsi `getDatabase`]**

`dbPromise` adalah singleton — koneksi database hanya dibuat satu kali. Fungsi `getDatabase` mengecek: kalau `dbPromise` belum ada, baru buat. Kalau sudah ada, return yang existing. Ini penting karena membuka IndexedDB itu asynchronous dan mahal — kita tidak mau buka berkali-kali."

---

---

## BAGIAN 6: FUNGSI READ & WRITE STORE
**Durasi: ~1.5 menit | Tampilan: mockBackend.ts baris 255–310**

---

**[SCROLL ke `getAllFromStore` dan `readStore`]**

"Selanjutnya dua fungsi utility untuk membaca data.

**[HIGHLIGHT: `getAllFromStore`]**

`getAllFromStore` adalah fungsi generik yang mengambil semua record dari satu store. Perhatikan type parameter `<T>` di sini — ini TypeScript generics. Fungsi ini bisa dipakai untuk store apapun, dan hasilnya akan memiliki tipe yang benar sesuai `T`.

**[HIGHLIGHT: `readStore`]**

`readStore` memanggil `getAllFromStore` untuk semua lima store secara paralel menggunakan `Promise.all`. Ini efisien karena kelima query dijalankan bersamaan, bukan satu per satu. Hasilnya dikembalikan sebagai `AppStore` yang sudah lengkap.

**(jeda)**

**[SCROLL ke `writeStore`]**

`writeStore` kebalikannya — menerima `AppStore` dan menyimpan semua datanya ke IndexedDB. Dia buka satu transaksi readwrite, lalu `put` semua record dari setiap array ke store yang sesuai. Transaksi di IndexedDB adalah atomic — kalau ada yang gagal, semuanya dibatalkan.

Perhatikan pattern yang konsisten: setiap operasi async dibungkus dengan `void requestToPromise(...)` — helper kecil di atas yang mengkonversi IDBRequest menjadi Promise."

---

---

## BAGIAN 7: FUNGSI AUTENTIKASI
**Durasi: ~2 menit | Tampilan: mockBackend.ts baris 318–400**

---

**[SCROLL ke fungsi `login`]**

"Sekarang kita masuk ke bagian yang langsung berinteraksi dengan pengguna — autentikasi.

**[HIGHLIGHT: seluruh fungsi `login`]**

Fungsi `login` menerima email dan password. Dia load semua data dengan `readStore`, lalu cari user yang emailnya cocok dan passwordnya cocok. Pencarian email pakai `.toLowerCase()` di kedua sisi — ini best practice agar pencarian tidak case-sensitive.

**[HIGHLIGHT: baris `appendLog` dan `return { ok: true, user }`]**

Kalau user ketemu, dia catat aktivitas login ke activityLog, simpan perubahan ke database, lalu return `{ ok: true, user }`. Kalau tidak ketemu, return `{ ok: false, message: '...' }`.

Pattern return object seperti ini lebih baik daripada throw error atau return null — karena pemanggil bisa cek `res.ok` dengan jelas tanpa try-catch.

**(jeda)**

**[HIGHLIGHT: `persistSessionUser`]**

`persistSessionUser` menyimpan data user ke localStorage dengan key `SESSION_KEY`. Ini yang membuat login persisten — kalau kita refresh browser, session masih ada karena data ada di localStorage.

**[HIGHLIGHT: `getStoredSessionUser`]**

`getStoredSessionUser` kebalikannya — membaca data session dari localStorage. Ada try-catch di sini untuk antisipasi kalau data di localStorage corrupt atau tidak valid JSON. Kalau gagal parse, return null — artinya dianggap belum login.

**[HIGHLIGHT: `clearSessionUser`]**

`clearSessionUser` menghapus key session dari localStorage — ini yang dipanggil saat logout.

**(jeda)**

**[SCROLL ke `getAccessibleModules`]**

`getAccessibleModules` adalah fungsi yang sangat penting untuk keamanan. Dia menerima role pengguna dan mengembalikan daftar modul yang boleh diakses.

**[HIGHLIGHT: switch case di getAccessibleModules]**

Admin dapat akses keempat modul. Guru hanya `jurnal`. Role `bk` mendapat `bk` dan `kesiswaan`. Role `wali` hanya `kesiswaan`. Role `siswa` hanya `jurnal` — tapi di sisi UI ada pembatasan lebih lanjut. `ortu` hanya `kesiswaan`.

Perhatikan return type pakai `as const` — ini membuat TypeScript tahu bahwa array ini readonly dan literal, bukan string biasa. Ini meningkatkan type safety di komponen yang menggunakannya."

---

---

## BAGIAN 8: FUNGSI CRUD DATA
**Durasi: ~3 menit | Tampilan: mockBackend.ts baris 400–530**

---

**[SCROLL ke `saveJournalEntry`]**

"Sekarang bagian CRUD — Create, Read, Update, Delete. Kita lihat pola yang digunakan dan kamu akan lihat bahwa semua fungsi mengikuti pola yang sama.

**[HIGHLIGHT: `listJournalEntries`]**

`listJournalEntries` paling sederhana — hanya panggil `readStore()` dan return `store.journalEntries`.

**[HIGHLIGHT: seluruh `saveJournalEntry`]**

`saveJournalEntry` untuk membuat entry baru. Perhatikan parameter pertamanya: `Omit<JournalEntry, 'id' | 'authorEmail'>` — ini TypeScript utility type yang berarti 'tipe JournalEntry tapi tanpa field id dan authorEmail'. Kenapa? Karena `id` dihasilkan otomatis oleh sistem, dan `authorEmail` diterima sebagai parameter terpisah.

**[HIGHLIGHT: `id: Date.now()`]**

`id` diisi dengan `Date.now()` — nilai Unix timestamp dalam milliseconds. Cara ini sederhana dan efektif untuk ID yang unik, meski untuk production lebih baik pakai UUID.

**[HIGHLIGHT: `store.journalEntries.unshift(created)`]**

`unshift` menambahkan entry baru di awal array — bukan di akhir. Ini membuat data terbaru selalu muncul pertama di list.

**[HIGHLIGHT: `appendLog` dan `writeStore`]**

Setelah data ditambahkan ke store di memory, kita log aktivitasnya, lalu simpan ke IndexedDB dengan `writeStore`. Pattern ini konsisten di semua fungsi save/update/delete.

**(jeda)**

**[SCROLL ke `updateJournalEntry`]**

`updateJournalEntry` untuk edit data yang sudah ada. Dia cari index entry berdasarkan `id`, lalu update dengan spread operator. Kalau `id` tidak ditemukan, return `null` — pemanggil bisa cek null ini untuk tahu apakah update berhasil.

**(jeda)**

**[SCROLL ke `deleteJournalEntry`]**

`deleteJournalEntry` pakai teknik yang rapi: simpan panjang array sebelum delete, filter array, lalu bandingkan panjang. Kalau berbeda, artinya ada yang terhapus — return `true`. Kalau sama, ID tidak ditemukan — return `false`.

**(jeda)**

**[HIGHLIGHT: `saveBkCase`, `saveStudent` — tampilkan sekilas]**

Fungsi-fungsi untuk BkCase dan Student mengikuti pola yang persis sama. `saveBkCase`, `updateBkCase`, `deleteBkCase`, `saveStudent`, `updateStudent`, `deleteStudent` — semuanya: read store, modify, log, write store, return result.

Ini adalah contoh yang baik dari konsistensi kode — kalau kamu mengerti satu, kamu mengerti semua."

---

---

## BAGIAN 9: KOMPONEN UTAMA — State & Effects
**Durasi: ~3 menit | Tampilan: src/routes/index.tsx, baris 1–180**

---

**[TAMPILKAN: src/routes/index.tsx, scroll ke atas]**

"Sekarang kita pindah ke file UI utama — `index.tsx`. File ini berisi satu komponen React besar yang mengelola seluruh tampilan aplikasi.

**[HIGHLIGHT: blok import di atas]**

Perhatikan import-nya. Dari `react` kita import `useEffect`, `useMemo`, `useState`. Dari `mockBackend` kita import semua fungsi yang baru saja kita pelajari — `login`, `clearSessionUser`, `listJournalEntries`, `saveJournalEntry`, dan seterusnya.

**(jeda)**

**[SCROLL ke konstanta NEON, BG, BORDER, SHADOW]**

Sebelum komponen utama, ada definisi konstanta visual untuk design system Neo-Brutalism.

**[HIGHLIGHT: `const NEON = { yellow, lime, orange, pink }`]**

Ini adalah palet warna neon yang dipakai di seluruh aplikasi. Semua nilai warna dalam satu objek — mudah diubah dari satu tempat tanpa perlu cari-cari di seluruh file.

**[HIGHLIGHT: `const BORDER` dan `const SHADOW`]**

`BORDER` adalah `4px solid black` — border tebal yang jadi ciri khas design ini. `SHADOW` adalah shadow dengan offset `8px 8px` yang memberi efek kotak timbul. Semua ditulis sebagai konstanta agar mudah diubah terpusat.

**(jeda)**

**[SCROLL ke fungsi `Index()`, highlight blok `useState`]**

Ini adalah state komponen utama. Kita lihat satu per satu.

**[HIGHLIGHT: `activeModule` state]**

`activeModule` menyimpan modul mana yang sedang aktif — nilainya salah satu dari `'jurnal' | 'bk' | 'kesiswaan' | 'pengguna'`. Default-nya `'jurnal'`.

**[HIGHLIGHT: `entries`, `bkCases`, `students`, `users` state]**

Empat state ini menyimpan data dari masing-masing modul yang sudah di-load dari IndexedDB.

**[HIGHLIGHT: `sessionUser` dan `loading` state]**

`sessionUser` menyimpan data user yang sedang login — atau `null` kalau belum login. `loading` untuk tampilkan loading screen sementara aplikasi cek apakah ada session.

**(jeda)**

**[HIGHLIGHT: useEffect pertama — cek session]**

`useEffect` pertama ini berjalan sekali saat komponen pertama kali mount — karena dependency array-nya kosong `[]`. Dia panggil `getStoredSessionUser()` untuk cek localStorage. Kalau ada session, set ke state. Apapun hasilnya, set `loading` ke false.

**[HIGHLIGHT: useEffect kedua — load data]**

`useEffect` kedua ini berjalan setiap kali `sessionUser` berubah. Artinya setiap kali ada login atau logout, data di-reload dari IndexedDB. Dia pakai `Promise.all` untuk load semua data paralel — efisien, karena kelima query berjalan bersamaan.

**[HIGHLIGHT: `useMemo` untuk filtered]**

`useMemo` dipakai untuk komputasi filtered entries. Ini memastikan filter ulang hanya terjadi saat `entries`, `filterKelas`, atau `filterBulan` berubah — bukan setiap render. Penting untuk performa."

---

---

## BAGIAN 10: EVENT HANDLERS
**Durasi: ~2 menit | Tampilan: index.tsx baris 180–260**

---

**[HIGHLIGHT: `handleLogin`]**

"Sekarang kita lihat event handler-nya.

`handleLogin` dipanggil saat form login disubmit. Pertama dia mencegah default form submit behavior dengan `e.preventDefault()`. Lalu panggil fungsi `login` dari mockBackend — ingat, ini async, jadi kita pakai `await`.

Kalau hasilnya `!res.ok`, tampilkan pesan error ke `loginError` state. Kalau berhasil, panggil `persistSessionUser` untuk simpan session ke localStorage, update `sessionUser` state, dan tampilkan toast selamat datang.

**(jeda)**

**[HIGHLIGHT: `handleLogout`]**

`handleLogout` lebih sederhana: hapus session dari localStorage dengan `clearSessionUser`, reset `sessionUser` state ke null, reset activeModule ke jurnal, dan tampilkan toast keluar.

**(jeda)**

**[HIGHLIGHT: `handleDeleteJournal`]**

`handleDeleteJournal` memanggil `deleteJournalEntry` dari backend. Kalau hasilnya `ok`, update state `entries` dengan filter — hapus entry yang ID-nya cocok. Ini cara React untuk update UI tanpa reload data dari database — lebih cepat dan lebih responsif.

Perhatikan `void ...then(...)` bukan `await` — ini karena fungsi ini bukan `async`. `void` mengabaikan return value Promise agar tidak ada warning dari TypeScript.

**(jeda)**

**[HIGHLIGHT: `handleSubmitBk`]**

`handleSubmitBk` memanggil `saveBkCase`, menunggu hasilnya, lalu tambahkan entry baru di awal array state dengan `setBkCases(prev => [created, ...prev])`. Spread operator dengan prepend — data terbaru selalu di atas."

---

---

## BAGIAN 11: RENDER LOGIC & CONDITIONAL UI
**Durasi: ~2 menit | Tampilan: index.tsx baris 260–380**

---

**[SCROLL ke bagian return di fungsi Index()]**

"Sekarang kita lihat bagian render — apa yang sebenarnya ditampilkan ke layar.

**[HIGHLIGHT: `if (loading) return ...`]**

Pertama ada loading check. Kalau `loading` masih true, tampilkan teks loading saja. Ini penting agar tidak ada flicker atau redirect yang tidak perlu saat aplikasi baru mulai.

**(jeda)**

**[HIGHLIGHT: `if (!sessionUser) return (...login form...)`]**

Kalau tidak ada session, render form login. Ini adalah pola early return klasik di React — satu komponen bisa render tampilan berbeda berdasarkan state, tanpa perlu routing.

**[ZOOM ke form login]**

Form login sederhana — dua input untuk email dan password, error message kalau login gagal, dan tombol submit. Dibawahnya ada hint akun demo.

**(jeda)**

**[SCROLL ke return utama setelah login]**

Setelah login, tampilan utama adalah layout flex horizontal — sidebar di kiri dan `main` content di kanan.

**[HIGHLIGHT: komponen `Sidebar`]**

Sidebar menerima `activeModule`, `setActiveModule`, `accessibleModules`, dan state `sidebarOpen` sebagai props. Komponen ini merender tombol navigasi modul.

**[HIGHLIGHT: konten kondisional di dalam `main`]**

Di dalam main, ada Header, lalu badge role/module, kemudian konten yang bervariasi berdasarkan `activeModule`.

**[HIGHLIGHT: ternary bersarang untuk activeModule]**

Kalau `activeModule === 'jurnal'`, render komponen jurnal. Kalau `'bk'`, render `BimbinganKonselingPage`. Kalau `'kesiswaan'`, render `DataKesiswaanPage`. Default ke `ManajemenPenggunaPage`.

Pola ternary bersarang ini lebih ringkas daripada if-else panjang untuk kasus yang sederhana seperti ini."

---

---

## BAGIAN 12: SIDEBAR & ROLE-BASED ACCESS CONTROL
**Durasi: ~1.5 menit | Tampilan: index.tsx, komponen Sidebar**

---

**[SCROLL ke fungsi komponen `Sidebar`]**

"Kita lihat bagaimana RBAC diimplementasi di UI.

**[HIGHLIGHT: `const items` array di Sidebar]**

Sidebar mendefinisikan semua empat item navigasi dalam array. Setiap item punya `id` dan `label`.

**[HIGHLIGHT: `const allowed = accessibleModules.includes(it.id)`]**

Ini kuncinya. Untuk setiap item, kita cek apakah `it.id` ada di `accessibleModules` — yang merupakan hasil dari `getAccessibleModules(role)` dari backend.

**[HIGHLIGHT: `disabled={!allowed}` dan styling berbeda]**

Kalau modul tidak diizinkan, tombolnya di-disable. Tampilannya juga berbeda — warna abu-abu, kursor `not-allowed`, opacity rendah, dan ada label `[NO ACCESS]` di bawahnya.

**[HIGHLIGHT: styling `active ? NEON.lime : '#222'`]**

Modul yang sedang aktif mendapat background neon lime, yang tidak aktif tapi diizinkan tetap hitam, yang tidak diizinkan menjadi gelap dan samar.

Jadi keamanan RBAC ada di dua layer: backend tidak akan melayani operasi yang tidak authorized, dan UI sudah menyembunyikan atau men-disable fitur yang tidak boleh diakses. Ini yang disebut defense in depth."

---

---

## BAGIAN 13: DEMO LANGSUNG DI BROWSER
**Durasi: ~2 menit | Tampilan: Browser, http://localhost:8080**

---

**[DEMO: Buka browser, navigasi ke localhost:8080]**

"Sekarang kita lihat hasilnya di browser.

Ini adalah halaman login. Saya akan login sebagai guru dulu.

**[DEMO: ketik guru@sekolah.test dan password123, klik login]**

Masuk sebagai Guru Budi. Perhatikan sidebar — hanya ada satu item: 'JURNAL MENGAJAR'. Modul BK, Kesiswaan, dan Pengguna tidak muncul sama sekali karena `getAccessibleModules('guru')` hanya mengembalikan `['jurnal']`.

**[DEMO: buat entri jurnal baru, isi form, klik simpan]**

Saya isi form jurnal — tanggal, kelas, mata pelajaran, materi, metode.

Setelah simpan, lihat: toast notifikasi muncul di atas, dan data langsung muncul di tab Riwayat tanpa reload halaman. Ini karena setelah `saveJournalEntry` berhasil, kita langsung update state dengan `setEntries(prev => [created, ...prev])`.

**(jeda)**

**[DEMO: logout, login sebagai admin]**

Sekarang logout dan login sebagai admin. Admin bisa akses semua empat modul — lihat sidebar, semua tombol aktif.

**[DEMO: buka DevTools > Application > IndexedDB > sis-terpadu-db]**

Kalau kita buka DevTools — F12 — tab Application, kemudian IndexedDB, `sis-terpadu-db` — kita bisa lihat semua data yang tersimpan. Di `journalEntries` ada entri yang baru saja kita buat. Di `activityLogs` ada log login dan simpan jurnal yang dicatat otomatis."

---

---

## BAGIAN 14: UNIT TESTING — VITEST
**Durasi: ~1.5 menit | Tampilan: file test + terminal**

---

**[TAMPILKAN: 03_Test_Scripts_and_Automation/unit/mockBackend.test.ts]**

"Aplikasi ini dilengkapi unit test menggunakan Vitest.

**[SCROLL melihat struktur describe dan it block]**

File test ini menguji semua fungsi di mockBackend. Ada test untuk login berhasil, login gagal, CRUD jurnal, CRUD kasus BK, CRUD data siswa, dan manajemen pengguna.

**[HIGHLIGHT: salah satu test case login]**

Contohnya, test ini: 'login dengan kredensial yang valid harus berhasil'. Dia panggil fungsi `login` dengan email dan password yang benar, lalu expect hasilnya `ok: true` dan ada field `user`. Sederhana tapi eksplisit.

**(jeda)**

**[DEMO: buka terminal, jalankan `npm run test:unit`]**

Mari kita jalankan.

**[DEMO: tampilkan output — 30 passed, coverage 78%]**

30 tests, semua passed. Coverage sekitar 78 persen — di atas target minimum 70 persen.

Angka ini berarti 78 persen dari baris kode di `mockBackend.ts` dieksekusi oleh test — artinya kita punya keyakinan yang cukup tinggi bahwa logika bisnis bekerja sesuai spesifikasi."

---

---

## BAGIAN 15: PENUTUP
**Durasi: ~1 menit | Tampilan: VS Code overview**

---

**[TAMPILKAN: VS Code dengan file explorer, dua file utama terlihat]**

"Oke, kita sudah bedah hampir semua bagian penting dari kode SIS-TERPADU.

Untuk merangkum:

`mockBackend.ts` adalah fondasi — dia mendefinisikan tipe data, mengelola koneksi IndexedDB, menyediakan fungsi login dan session management, dan menyediakan semua operasi CRUD untuk empat entitas. Setiap operasi write otomatis mencatat ke activity log.

`index.tsx` adalah komponen React yang menggunakan semua fungsi itu. Dia mengelola state aplikasi, merespons interaksi pengguna lewat event handlers, dan merender UI berbeda berdasarkan siapa yang login dan modul apa yang aktif.

Role-Based Access Control ada di dua layer — backend menentukan apa yang bisa dilakukan, UI menentukan apa yang ditampilkan.

Kalau kamu ingin eksplorasi lebih lanjut: buka file test di `03_Test_Scripts_and_Automation` untuk lihat semua skenario yang diuji, baca `01_Documents/SDD.md` untuk arsitektur dan desain sistem, atau coba tambah field baru ke `JournalEntry` dan lihat bagaimana TypeScript langsung mendeteksi semua tempat yang perlu diupdate.

Terima kasih sudah menonton. Kalau ada pertanyaan tentang bagian tertentu dari kode, tulis di komentar."

---

---

## RINGKASAN TIMELINE VIDEO

| # | Segmen | Durasi | File yang ditampilkan |
|---|--------|--------|-----------------------|
| 1 | Pembukaan | 1:00 | Desktop overview |
| 2 | Struktur folder | 1:30 | VS Code file explorer |
| 3 | Tipe data | 2:30 | mockBackend.ts baris 1–60 |
| 4 | Seed data & konstanta | 2:00 | mockBackend.ts baris 60–130 |
| 5 | Setup IndexedDB | 3:00 | mockBackend.ts baris 130–260 |
| 6 | Fungsi read & write | 1:30 | mockBackend.ts baris 255–310 |
| 7 | Autentikasi | 2:00 | mockBackend.ts baris 318–400 |
| 8 | Fungsi CRUD | 3:00 | mockBackend.ts baris 400–530 |
| 9 | State & Effects | 3:00 | index.tsx baris 1–180 |
| 10 | Event Handlers | 2:00 | index.tsx baris 180–260 |
| 11 | Render Logic | 2:00 | index.tsx baris 260–380 |
| 12 | RBAC di Sidebar | 1:30 | index.tsx komponen Sidebar |
| 13 | Demo browser | 2:00 | Browser localhost:8080 |
| 14 | Unit Testing | 1:30 | Terminal + test file |
| 15 | Penutup | 1:00 | VS Code overview |
| **Total** | | **~28 menit** | |

---

## CATATAN UNTUK PEREKAMAN

**Persiapan sebelum rekam:**
- Jalankan `npm run dev` agar app sudah berjalan di localhost:8080
- Buka VS Code dengan tema yang kontras dan ukuran font minimal 16px
- Tutup aplikasi dan tab browser yang tidak relevan
- Test microphone, pastikan tidak ada noise

**Tips narasi:**
- Baca naskah sampai hafal alurnya — gunakan sebagai panduan, bukan dibaca kata per kata
- Saat highlight kode, pause 1–2 detik sebelum bicara — beri penonton waktu melihat kode
- Saat demo browser, gerakkan mouse pelan agar gerakan terlihat di rekaman
- Kalau salah ucap, diam 3 detik lalu ulangi dari kalimat itu — mudah di-cut saat editing

**Software yang direkomendasikan:**
- Perekam layar: OBS Studio (gratis) atau Loom
- Editor video: DaVinci Resolve (gratis) atau CapCut
- Zoom in kode: gunakan `Ctrl +` di VS Code saat sorot baris penting
