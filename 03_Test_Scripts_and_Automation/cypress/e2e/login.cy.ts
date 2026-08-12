// ============================================================
// Cypress E2E — Login & Authentication
// Jalankan: npm run test:e2e
// ============================================================

describe("ST-01 & ST-02: Login & Authentication", () => {
  // beforeEach hook is handled by support/e2e.ts

  it("ST-01: Login berhasil sebagai Admin → dashboard tampil", () => {
    cy.get('input[type="email"]').clear().type("admin@sekolah.test");
    cy.get('input[type="password"]').clear().type("password123");
    cy.get('button[type="submit"]').click();

    // Semua modul harus tampil di sidebar setelah admin login
    cy.contains(/jurnal mengajar/i).should("be.visible");
    cy.contains(/bimbingan konseling/i).should("be.visible");
    cy.contains(/kesiswaan/i).should("be.visible");
    cy.contains(/pengguna/i).should("be.visible");
  });

  it("ST-02: Login dengan password salah → pesan error tampil", () => {
    cy.get('input[type="email"]').clear().type("admin@sekolah.test");
    cy.get('input[type="password"]').clear().type("passwordSalah");
    cy.get('button[type="submit"]').click();

    // Pesan error dari mockBackend.ts
    cy.contains(/email atau password salah/i).should("be.visible");
  });

  it("BVA Login: Gagal 5x → tetap tampil pesan error (tidak ada lockout UI)", () => {
    for (let i = 0; i < 5; i++) {
      cy.get('input[type="email"]').clear().type("admin@sekolah.test");
      cy.get('input[type="password"]').clear().type("salah");
      cy.get('button[type="submit"]').click();
      cy.wait(300);
    }

    // Setiap percobaan menampilkan pesan error
    cy.contains(/email atau password salah/i).should("be.visible");
  });

  it("Login sebagai Guru → hanya modul Jurnal tersedia", () => {
    cy.get('input[type="email"]').clear().type("guru@sekolah.test");
    cy.get('input[type="password"]').clear().type("password123");
    cy.get('button[type="submit"]').click();

    cy.contains(/jurnal mengajar/i).should("be.visible");
    // Modul admin tidak tersedia untuk guru
    cy.contains(/\[NO ACCESS\]/i).should("exist");
  });

  it("ST-10: Logout → kembali ke halaman login", () => {
    cy.get('input[type="email"]').clear().type("admin@sekolah.test");
    cy.get('input[type="password"]').clear().type("password123");
    cy.get('button[type="submit"]').click();

    cy.contains(/jurnal mengajar/i).should("be.visible");
    // Tombol logout adalah teks "LOGOUT"
    cy.contains("LOGOUT").click();

    // Halaman login harus muncul kembali
    cy.get('input[type="email"]').should("be.visible");
  });
});
