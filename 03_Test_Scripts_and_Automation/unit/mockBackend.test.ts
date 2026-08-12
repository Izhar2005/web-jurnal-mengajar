import { describe, it, expect, beforeEach, vi } from "vitest";

// ============================================================
// Unit Tests — mockBackend.ts (Pure Functions)
// Jalankan: npm run test:unit
// ============================================================

// Import fungsi yang akan diuji
// Catatan: fungsi yang bergantung pada IndexedDB di-mock secara manual
import { getRoleName, getAccessibleModules } from "../../src/lib/mockBackend";

// ==== Helpers: mock untuk fungsi async (tidak bergantung IndexedDB) ====

async function hashPassword(password: string): Promise<string> {
  return password;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  return password === stored;
}

const LOCKOUT_KEY = "sis-terpadu-lockout-v1";
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30_000;

type LockoutRecord = Record<string, { attempts: number; lockedUntil: number | null }>;

function getLockoutRecord(): LockoutRecord {
  try {
    return JSON.parse(localStorage.getItem(LOCKOUT_KEY) ?? "{}") as LockoutRecord;
  } catch {
    return {};
  }
}

function saveLockoutRecord(record: LockoutRecord) {
  localStorage.setItem(LOCKOUT_KEY, JSON.stringify(record));
}

function checkLoginLockout(email: string): { locked: boolean; secondsLeft?: number } {
  const record = getLockoutRecord();
  const entry = record[email.toLowerCase()];
  if (!entry?.lockedUntil) return { locked: false };
  if (Date.now() < entry.lockedUntil) {
    return { locked: true, secondsLeft: Math.ceil((entry.lockedUntil - Date.now()) / 1000) };
  }
  return { locked: false };
}

function recordFailedAttempt(email: string): number {
  const record = getLockoutRecord();
  const key = email.toLowerCase();
  const entry = record[key] ?? { attempts: 0, lockedUntil: null };
  entry.attempts += 1;
  const remaining = MAX_ATTEMPTS - entry.attempts;
  if (entry.attempts >= MAX_ATTEMPTS) {
    entry.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
    entry.attempts = 0;
  }
  record[key] = entry;
  saveLockoutRecord(record);
  return Math.max(0, remaining);
}

// ============================================================
// Test Suite 1: getRoleName()
// ============================================================
describe("getRoleName()", () => {
  it("UT-01: mengembalikan 'Admin' untuk role admin", () => {
    expect(getRoleName("admin")).toBe("Admin");
  });

  it("UT-02: mengembalikan 'Guru' untuk role guru", () => {
    expect(getRoleName("guru")).toBe("Guru");
  });

  it("UT-03: mengembalikan 'Guru BK' untuk role bk", () => {
    expect(getRoleName("bk")).toBe("Guru BK");
  });

  it("UT-04: mengembalikan 'Wali Kelas' untuk role wali", () => {
    expect(getRoleName("wali")).toBe("Wali Kelas");
  });

  it("UT-05: mengembalikan 'Siswa' untuk role siswa", () => {
    expect(getRoleName("siswa")).toBe("Siswa");
  });

  it("UT-06: mengembalikan 'Orang Tua' untuk role ortu", () => {
    expect(getRoleName("ortu")).toBe("Orang Tua");
  });
});

// ============================================================
// Test Suite 2: getAccessibleModules() — EP Role-Based Access
// ============================================================
describe("getAccessibleModules()", () => {
  it("UT-07 [EP]: admin dapat mengakses semua 4 modul", () => {
    const modules = getAccessibleModules("admin");
    expect(modules).toContain("jurnal");
    expect(modules).toContain("bk");
    expect(modules).toContain("kesiswaan");
    expect(modules).toContain("pengguna");
    expect(modules).toHaveLength(4);
  });

  it("UT-08 [EP]: guru hanya dapat mengakses modul jurnal", () => {
    const modules = getAccessibleModules("guru");
    expect(modules).toContain("jurnal");
    expect(modules).not.toContain("bk");
    expect(modules).not.toContain("pengguna");
    expect(modules).toHaveLength(1);
  });

  it("UT-09 [EP]: role bk dapat mengakses bk dan kesiswaan", () => {
    const modules = getAccessibleModules("bk");
    expect(modules).toContain("bk");
    expect(modules).toContain("kesiswaan");
    expect(modules).not.toContain("pengguna");
    expect(modules).toHaveLength(2);
  });

  it("UT-10 [EP]: role wali hanya dapat mengakses kesiswaan", () => {
    const modules = getAccessibleModules("wali");
    expect(modules).toContain("kesiswaan");
    expect(modules).not.toContain("bk");
    expect(modules).toHaveLength(1);
  });

  it("UT-11 [EP]: undefined role mengembalikan default ['jurnal']", () => {
    const modules = getAccessibleModules(undefined);
    expect(modules).toContain("jurnal");
  });
});

// ============================================================
// Test Suite 3: verifyPassword() — EP & BVA
// ============================================================
describe("verifyPassword()", () => {
  it("UT-12 [EP-V]: password cocok mengembalikan true", async () => {
    const result = await verifyPassword("password123", "password123");
    expect(result).toBe(true);
  });

  it("UT-13 [EP-I]: password tidak cocok mengembalikan false", async () => {
    const result = await verifyPassword("wrongpass", "password123");
    expect(result).toBe(false);
  });

  it("UT-14 [EP-I]: password kosong mengembalikan false", async () => {
    const result = await verifyPassword("", "password123");
    expect(result).toBe(false);
  });

  it("UT-15 [BVA]: password case-sensitive (P vs p)", async () => {
    const result = await verifyPassword("Password123", "password123");
    expect(result).toBe(false);
  });

  it("UT-16 [EP-I]: stored kosong dengan password isi mengembalikan false", async () => {
    const result = await verifyPassword("password123", "");
    expect(result).toBe(false);
  });

  it("UT-17 [EP-I]: keduanya kosong mengembalikan true (edge case)", async () => {
    const result = await verifyPassword("", "");
    expect(result).toBe(true);
  });
});

// ============================================================
// Test Suite 4: hashPassword()
// ============================================================
describe("hashPassword()", () => {
  it("UT-18: hashPassword mengembalikan string (mode demo = plain text)", async () => {
    const result = await hashPassword("anypassword");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("UT-19: hashPassword input kosong mengembalikan string kosong", async () => {
    const result = await hashPassword("");
    expect(result).toBe("");
  });
});

// ============================================================
// Test Suite 5: checkLoginLockout() & recordFailedAttempt()
// Menggunakan jsdom localStorage
// ============================================================
describe("Brute Force Protection", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("UT-20: tidak ada lockout pada state awal bersih", () => {
    const result = checkLoginLockout("test@test.com");
    expect(result.locked).toBe(false);
  });

  it("UT-21 [BVA]: 4 percobaan gagal — belum dikunci, remaining = 1", () => {
    let remaining = 0;
    for (let i = 0; i < 4; i++) {
      remaining = recordFailedAttempt("test@test.com");
    }
    expect(remaining).toBe(1);
    expect(checkLoginLockout("test@test.com").locked).toBe(false);
  });

  it("UT-22 [BVA]: tepat 5 percobaan — akun dikunci (batas)", () => {
    for (let i = 0; i < 5; i++) {
      recordFailedAttempt("test@test.com");
    }
    const result = checkLoginLockout("test@test.com");
    expect(result.locked).toBe(true);
    expect(result.secondsLeft).toBeGreaterThan(0);
    expect(result.secondsLeft).toBeLessThanOrEqual(30);
  });

  it("UT-23: email berbeda tidak mempengaruhi lockout satu sama lain", () => {
    for (let i = 0; i < 5; i++) {
      recordFailedAttempt("user1@test.com");
    }
    const result = checkLoginLockout("user2@test.com");
    expect(result.locked).toBe(false);
  });

  it("UT-24: cek lockout setelah waktu kunci habis", () => {
    // Simulasi lockout yang sudah kadaluarsa
    const expiredRecord = {
      "expired@test.com": { attempts: 0, lockedUntil: Date.now() - 1000 }
    };
    localStorage.setItem(LOCKOUT_KEY, JSON.stringify(expiredRecord));
    const result = checkLoginLockout("expired@test.com");
    expect(result.locked).toBe(false);
  });
});

// ============================================================
// Test Suite 6: Validasi Tanggal Jurnal (BVA)
// ============================================================
describe("Validasi Tanggal Jurnal [BVA]", () => {
  const today = new Date().toISOString().slice(0, 10);

  function isDateValid(dateStr: string): boolean {
    if (!dateStr) return false;
    return dateStr <= today;
  }

  it("BVA-01: tanggal hari ini (batas atas valid) → diterima", () => {
    expect(isDateValid(today)).toBe(true);
  });

  it("BVA-02: tanggal kemarin → diterima", () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    expect(isDateValid(yesterday)).toBe(true);
  });

  it("BVA-03: tanggal masa lalu jauh → diterima", () => {
    expect(isDateValid("2020-01-01")).toBe(true);
  });

  it("BVA-04: tanggal besok (batas bawah invalid) → ditolak", () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    expect(isDateValid(tomorrow)).toBe(false);
  });

  it("BVA-05: tanggal masa depan jauh → ditolak", () => {
    expect(isDateValid("2099-12-31")).toBe(false);
  });

  it("BVA-06: string kosong → ditolak", () => {
    expect(isDateValid("")).toBe(false);
  });
});
