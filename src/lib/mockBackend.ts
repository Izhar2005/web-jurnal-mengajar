export type UserRole = "admin" | "guru" | "bk" | "wali" | "siswa" | "ortu";

export type User = {
  id: number;
  nama: string;
  email: string;
  role: UserRole;
  password: string;
};

export type JournalEntry = {
  id: number;
  tanggal: string;
  kelas: string;
  mapel: string;
  materi: string;
  metode: string;
  catatan: string;
  authorEmail: string;
};

export type BkCase = {
  id: number;
  nama: string;
  nis: string;
  kelas: string;
  kasus: string;
  tindakLanjut: string;
  status: string;
  tanggal: string;
  penanggungJawab: string;
};

export type StudentRecord = {
  id: number;
  nama: string;
  nis: string;
  kelas: string;
  status: string;
  waliKelas: string;
};

export type ActivityLog = {
  id: number;
  userEmail: string;
  action: string;
  timestamp: string;
};

type AppStore = {
  users: User[];
  journalEntries: JournalEntry[];
  bkCases: BkCase[];
  students: StudentRecord[];
  activityLogs: ActivityLog[];
};

type StoreName = "users" | "journalEntries" | "bkCases" | "students" | "activityLogs";

const STORAGE_KEY = "sis-terpadu-store-v1";
const SESSION_KEY = "sis-terpadu-session-v1";
const DB_NAME = "sis-terpadu-db";
const DB_VERSION = 1;
const STORE_NAMES: StoreName[] = ["users", "journalEntries", "bkCases", "students", "activityLogs"];

const seedStore: AppStore = {
  users: [
    { id: 1, nama: "Admin Sekolah", email: "admin@sekolah.test", role: "admin", password: "password123" },
    { id: 2, nama: "Budi Guru", email: "guru@sekolah.test", role: "guru", password: "password123" },
    { id: 3, nama: "Rina BK", email: "bk@sekolah.test", role: "bk", password: "password123" },
    { id: 4, nama: "Dewi Wali", email: "wali@sekolah.test", role: "wali", password: "password123" },
    { id: 5, nama: "Siswa A", email: "siswa@sekolah.test", role: "siswa", password: "password123" },
  ],
  journalEntries: [
    {
      id: 1,
      tanggal: "2026-07-10",
      kelas: "VIII-A",
      mapel: "Matematika",
      materi: "Aljabar Linear Dasar",
      metode: "Diskusi",
      catatan: "Siswa antusias, 2 anak kesulitan pada soal cerita.",
      authorEmail: "guru@sekolah.test",
    },
    {
      id: 2,
      tanggal: "2026-07-12",
      kelas: "VII-B",
      mapel: "Informatika",
      materi: "Struktur Data Array",
      metode: "Praktikum",
      catatan: "Lab komputer 3 unit bermasalah.",
      authorEmail: "guru@sekolah.test",
    },
  ],
  bkCases: [
    {
      id: 1,
      nama: "Alya Putri",
      nis: "20231001",
      kelas: "VIII-A",
      kasus: "Kehadiran terlambat selama 3 hari",
      tindakLanjut: "Konseling individu dan pemberian surat peringatan",
      status: "Dalam pemantauan",
      tanggal: "2026-07-14",
      penanggungJawab: "Rina BK",
    },
  ],
  students: [
    { id: 1, nama: "Alya Putri", nis: "20231001", kelas: "VIII-A", status: "Aktif", waliKelas: "Dewi Wali" },
    { id: 2, nama: "Bima Saputra", nis: "20231002", kelas: "VII-B", status: "Aktif", waliKelas: "Dewi Wali" },
  ],
  activityLogs: [],
};

function createDefaultStore(): AppStore {
  return JSON.parse(JSON.stringify(seedStore));
}

function mergeUsers(seedUsers: User[], loadedUsers: User[] | undefined): User[] {
  const merged = new Map<string, User>();

  seedUsers.forEach((user) => {
    merged.set(user.email.toLowerCase(), user);
  });

  (loadedUsers ?? []).forEach((user) => {
    const key = user.email.toLowerCase();
    const existing = merged.get(key);
    merged.set(key, existing ? { ...existing, ...user } : user);
  });

  return Array.from(merged.values());
}

function normalizeStore(store: Partial<AppStore> | null | undefined): AppStore {
  const defaultStore = createDefaultStore();

  return {
    users: mergeUsers(defaultStore.users, store?.users),
    journalEntries: Array.isArray(store?.journalEntries) ? store.journalEntries : defaultStore.journalEntries,
    bkCases: Array.isArray(store?.bkCases) ? store.bkCases : defaultStore.bkCases,
    students: Array.isArray(store?.students) ? store.students : defaultStore.students,
    activityLogs: Array.isArray(store?.activityLogs) ? store.activityLogs : defaultStore.activityLogs,
  };
}

/* v8 ignore start */
function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed"));
  });
}

function waitForTransaction(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("IndexedDB transaction failed"));
    transaction.onabort = () => reject(new Error("IndexedDB transaction aborted"));
  });
}

let dbPromise: Promise<IDBDatabase> | null = null;

async function openDatabase(): Promise<IDBDatabase> {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    throw new Error("IndexedDB is not available in this browser");
  }

  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      STORE_NAMES.forEach((storeName) => {
        if (!database.objectStoreNames.contains(storeName)) {
          database.createObjectStore(storeName, { keyPath: "id" });
        }
      });

      const transaction = request.transaction;
      if (!transaction) {
        return;
      }

      const usersStore = transaction.objectStore("users");
      usersStore.createIndex("email", "email", { unique: true });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Failed to open IndexedDB"));
  });
}

async function bootstrapDatabase(): Promise<IDBDatabase> {
  const database = await openDatabase();

  if (typeof window !== "undefined") {
    const legacyRaw = window.localStorage.getItem(STORAGE_KEY);
    if (legacyRaw) {
      try {
        const parsed = JSON.parse(legacyRaw) as Partial<AppStore>;
        const normalized = normalizeStore(parsed);
        await writeStore(normalized);
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore migration errors and continue with seeded data
      }
    }
  }

  const transaction = database.transaction(STORE_NAMES, "readwrite");
  const counts = await Promise.all(
    STORE_NAMES.map((storeName) => requestToPromise<number>(transaction.objectStore(storeName).count())),
  );

  if (counts.some((count) => count === 0)) {
    const seedTransaction = database.transaction(STORE_NAMES, "readwrite");
    const seedStores = Object.fromEntries(
      STORE_NAMES.map((storeName) => [storeName, seedTransaction.objectStore(storeName)]),
    ) as Record<StoreName, IDBObjectStore>;

    for (const user of seedStore.users) {
      void requestToPromise(seedStores.users.put(user));
    }
    for (const entry of seedStore.journalEntries) {
      void requestToPromise(seedStores.journalEntries.put(entry));
    }
    for (const bkCase of seedStore.bkCases) {
      void requestToPromise(seedStores.bkCases.put(bkCase));
    }
    for (const student of seedStore.students) {
      void requestToPromise(seedStores.students.put(student));
    }
    for (const log of seedStore.activityLogs) {
      void requestToPromise(seedStores.activityLogs.put(log));
    }

    await waitForTransaction(seedTransaction);
  } else {
    await waitForTransaction(transaction);
  }

  return database;
}

async function getDatabase(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = bootstrapDatabase();
  }
  return dbPromise;
}

async function getAllFromStore<T>(storeName: StoreName): Promise<T[]> {
  const database = await getDatabase();
  const transaction = database.transaction([storeName], "readonly");
  const store = transaction.objectStore(storeName);
  return requestToPromise<T[]>(store.getAll());
}

async function readStore(): Promise<AppStore> {
  if (typeof window === "undefined") {
    return createDefaultStore();
  }

  const [users, journalEntries, bkCases, students, activityLogs] = await Promise.all([
    getAllFromStore<User>("users"),
    getAllFromStore<JournalEntry>("journalEntries"),
    getAllFromStore<BkCase>("bkCases"),
    getAllFromStore<StudentRecord>("students"),
    getAllFromStore<ActivityLog>("activityLogs"),
  ]);

  return {
    users: users.length > 0 ? users : createDefaultStore().users,
    journalEntries: journalEntries.length > 0 ? journalEntries : createDefaultStore().journalEntries,
    bkCases: bkCases.length > 0 ? bkCases : createDefaultStore().bkCases,
    students: students.length > 0 ? students : createDefaultStore().students,
    activityLogs: activityLogs.length > 0 ? activityLogs : createDefaultStore().activityLogs,
  };
}

async function writeStore(store: AppStore) {
  if (typeof window === "undefined") {
    return;
  }

  const database = await getDatabase();
  const transaction = database.transaction(STORE_NAMES, "readwrite");
  const stores = Object.fromEntries(
    STORE_NAMES.map((storeName) => [storeName, transaction.objectStore(storeName)]),
  ) as Record<StoreName, IDBObjectStore>;

  for (const user of store.users) {
    void requestToPromise(stores.users.put(user));
  }
  for (const entry of store.journalEntries) {
    void requestToPromise(stores.journalEntries.put(entry));
  }
  for (const bkCase of store.bkCases) {
    void requestToPromise(stores.bkCases.put(bkCase));
  }
  for (const student of store.students) {
    void requestToPromise(stores.students.put(student));
  }
  for (const log of store.activityLogs) {
    void requestToPromise(stores.activityLogs.put(log));
  }

  await waitForTransaction(transaction);
}

/* v8 ignore stop */

/* v8 ignore next 3 */
function appendLog(store: AppStore, userEmail: string, action: string) {
  store.activityLogs.unshift({
    id: Date.now(),
    userEmail,
    action,
    timestamp: new Date().toISOString(),
  });
}

/* v8 ignore start */
export async function login(email: string, password: string) {
  const store = await readStore();
  const user = store.users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);

  if (!user) {
    return { ok: false, message: "Email atau password salah." };
  }

  appendLog(store, user.email, "login");
  await writeStore(store);

  return { ok: true, user };
}

export function persistSessionUser(user: User) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getStoredSessionUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function clearSessionUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}
/* v8 ignore stop */

export function getAccessibleModules(role: UserRole | undefined) {
  switch (role) {
    case "admin":
      return ["jurnal", "bk", "kesiswaan", "pengguna"] as const;
    case "guru":
      return ["jurnal"] as const;
    case "bk":
      return ["bk", "kesiswaan"] as const;
    case "wali":
      return ["kesiswaan"] as const;
    case "siswa":
      return ["jurnal"] as const;
    case "ortu":
      return ["kesiswaan"] as const;
    default:
      return ["jurnal"] as const;
  }
}

export function getRoleName(role: UserRole) {
  switch (role) {
    case "admin":
      return "Admin";
    case "guru":
      return "Guru";
    case "bk":
      return "Guru BK";
    case "wali":
      return "Wali Kelas";
    case "siswa":
      return "Siswa";
    case "ortu":
      return "Orang Tua";
    default:
      return role;
  }
}

/* v8 ignore start */
export async function listJournalEntries() {
  const store = await readStore();
  return store.journalEntries;
}

export async function saveJournalEntry(entry: Omit<JournalEntry, "id" | "authorEmail"> & { authorEmail?: string }, authorEmail: string) {
  const store = await readStore();
  const created: JournalEntry = {
    id: Date.now(),
    ...entry,
    authorEmail,
  };
  store.journalEntries.unshift(created);
  appendLog(store, authorEmail, "simpan-jurnal");
  await writeStore(store);
  return created;
}

export async function updateJournalEntry(id: number, entry: Omit<JournalEntry, "id" | "authorEmail"> & { authorEmail?: string }, userEmail: string) {
  const store = await readStore();
  const index = store.journalEntries.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const updated: JournalEntry = {
    ...store.journalEntries[index],
    ...entry,
    id,
    authorEmail: entry.authorEmail ?? store.journalEntries[index].authorEmail,
  };
  store.journalEntries[index] = updated;
  appendLog(store, userEmail, "edit-jurnal");
  await writeStore(store);
  return updated;
}

export async function deleteJournalEntry(id: number, userEmail: string) {
  const store = await readStore();
  const before = store.journalEntries.length;
  store.journalEntries = store.journalEntries.filter((item) => item.id !== id);
  if (store.journalEntries.length !== before) {
    appendLog(store, userEmail, "hapus-jurnal");
    await writeStore(store);
    return true;
  }
  return false;
}

export async function listBkCases() {
  const store = await readStore();
  return store.bkCases;
}

export async function saveBkCase(entry: Omit<BkCase, "id">, userEmail: string) {
  const store = await readStore();
  const created: BkCase = {
    id: Date.now(),
    ...entry,
  };
  store.bkCases.unshift(created);
  appendLog(store, userEmail, "simpan-bk");
  await writeStore(store);
  return created;
}

export async function updateBkCase(id: number, entry: Omit<BkCase, "id">, userEmail: string) {
  const store = await readStore();
  const index = store.bkCases.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const updated: BkCase = { ...store.bkCases[index], ...entry, id };
  store.bkCases[index] = updated;
  appendLog(store, userEmail, "edit-bk");
  await writeStore(store);
  return updated;
}

export async function deleteBkCase(id: number, userEmail: string) {
  const store = await readStore();
  const before = store.bkCases.length;
  store.bkCases = store.bkCases.filter((item) => item.id !== id);
  if (store.bkCases.length !== before) {
    appendLog(store, userEmail, "hapus-bk");
    await writeStore(store);
    return true;
  }
  return false;
}

export async function listStudents() {
  const store = await readStore();
  return store.students;
}

export async function saveStudent(student: Omit<StudentRecord, "id">, userEmail: string) {
  const store = await readStore();
  const created: StudentRecord = {
    id: Date.now(),
    ...student,
  };
  store.students.unshift(created);
  appendLog(store, userEmail, "simpan-siswa");
  await writeStore(store);
  return created;
}

export async function updateStudent(id: number, student: Omit<StudentRecord, "id">, userEmail: string) {
  const store = await readStore();
  const index = store.students.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const updated: StudentRecord = { ...store.students[index], ...student, id };
  store.students[index] = updated;
  appendLog(store, userEmail, "edit-siswa");
  await writeStore(store);
  return updated;
}

export async function deleteStudent(id: number, userEmail: string) {
  const store = await readStore();
  const before = store.students.length;
  store.students = store.students.filter((item) => item.id !== id);
  if (store.students.length !== before) {
    appendLog(store, userEmail, "hapus-siswa");
    await writeStore(store);
    return true;
  }
  return false;
}

export async function listUsers() {
  const store = await readStore();
  return store.users;
}

export async function getDashboardSummary(role: UserRole | undefined) {
  const store = await readStore();
  return {
    totalStudents: store.students.length,
    totalJournalEntries: store.journalEntries.length,
    totalBkCases: store.bkCases.length,
    totalUsers: store.users.length,
    role,
  };
}
/* v8 ignore stop */
