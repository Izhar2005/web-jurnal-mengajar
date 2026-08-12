// ============================================================
// Cypress E2E — BK, Kesiswaan, & Pengguna Modules
// Jalankan: npm run test:e2e
// ============================================================

function loginAs(email: string) {
  // cy.visit and reload handled by support/e2e.ts
  cy.get('input[type="email"]').clear().type(email);
  cy.get('input[type="password"]').clear().type("password123");
  cy.get('button[type="submit"]').click();
  cy.wait(500);
}

// ============================================================
// BK Module Tests
// ============================================================
describe("ST-07: Bimbingan Konseling", () => {
  beforeEach(() => {
    loginAs("bk@sekolah.test");
  });

  it("ST-07a: Navigasi ke modul BK", () => {
    cy.contains(/bimbingan konseling/i).click();
    cy.contains(/kasus|bk/i).should("be.visible");
  });

  it("ST-07b: Tambah kasus BK baru → muncul di daftar", () => {
    cy.contains(/bimbingan konseling/i).click();
    cy.contains(/tambah|form bk/i).click();

    // Isi form BK (sesuaikan selector dengan implementasi aktual)
    cy.get('input').filter('[placeholder*="Nama"]').first().type("Budi Santoso");
    cy.get('input').filter('[placeholder*="NIS"]').first().type("12345");
    cy.get('input').filter('[placeholder*="Kelas"]').first().type("IX-A");
    cy.get('input').filter('[placeholder*="Kasus"]').first().type("Keterlambatan");

    cy.get('button[type="submit"]').click();

    // Kasus baru harus tampil
    cy.contains("Budi Santoso").should("be.visible");
  });

  it("ST-07c: Pencarian real-time di daftar BK", () => {
    cy.contains(/bimbingan konseling/i).click();

    cy.get('input[placeholder*="cari"], input[placeholder*="Cari"], input[placeholder*="search"]')
      .first()
      .type("Alya");

    // Entri yang mengandung 'Alya' harus tampil (dari seed data)
    cy.contains("Alya Putri").should("be.visible");
  });
});

// ============================================================
// Kesiswaan Module Tests
// ============================================================
describe("ST-08: Data Kesiswaan", () => {
  beforeEach(() => {
    loginAs("wali@sekolah.test");
  });

  it("ST-08a: Navigasi ke modul Kesiswaan", () => {
    cy.contains(/data kesiswaan/i).click();
    cy.contains(/siswa|kesiswaan/i).should("be.visible");
  });

  it("ST-08b: Daftar siswa tampil dengan badge status", () => {
    cy.contains(/data kesiswaan/i).click();

    // Minimal satu siswa dengan status Aktif
    cy.contains("Aktif").should("be.visible");
  });

  it("ST-08c: Pencarian siswa berdasarkan nama", () => {
    cy.contains(/data kesiswaan/i).click();

    cy.get('input[placeholder*="cari"], input[placeholder*="Cari"]')
      .first()
      .type("Rina");

    cy.wait(300);

    // Hasil pencarian relevan (tidak ditemukan = tampil pesan kosong)
    cy.get("body").then(($body) => {
      const text = $body.text().toLowerCase();
      const hasResult = text.includes("rina") || text.includes("tidak ada");
      expect(hasResult).to.be.true;
    });
  });
});

// ============================================================
// Manajemen Pengguna Tests (Admin Only)
// ============================================================
describe("ST-09: Manajemen Pengguna", () => {
  beforeEach(() => {
    loginAs("admin@sekolah.test");
  });

  it("ST-09a: Navigasi ke modul Pengguna (Admin only)", () => {
    cy.contains(/manajemen pengguna/i).click();
    cy.contains(/pengguna|user/i).should("be.visible");
  });

  it("ST-09b: Daftar pengguna dan statistik role tampil", () => {
    cy.contains(/manajemen pengguna/i).click();

    // Statistik jumlah pengguna per role
    cy.contains(/admin/i).should("be.visible");
    cy.contains(/guru/i).should("be.visible");
  });

  it("ST-09c: Tambah pengguna baru", () => {
    cy.contains(/manajemen pengguna/i).click();

    cy.get('input[placeholder*="Nama"]').first().type("User Test Baru");
    cy.get('input[placeholder*="email"], input[type="email"]').last().type("testuastas@sekolah.test");
    cy.get('input[placeholder*="Password"], input[type="password"]').last().type("test123");

    // Pilih role
    cy.get('select').first().select("guru");

    cy.get('button[type="submit"]').click();

    // User baru harus muncul
    cy.contains("User Test Baru").should("be.visible");
  });
});
