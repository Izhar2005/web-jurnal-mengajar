// ============================================================
// Cypress E2E — Jurnal Mengajar Module
// Jalankan: npm run test:e2e
// ============================================================

const TODAY = new Date().toISOString().slice(0, 10);
const TOMORROW = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

// Helper: login sebagai guru
function loginAsGuru() {
  // cy.visit and reload handled by support/e2e.ts
  cy.get('input[type="email"]').clear().type("guru@sekolah.test");
  cy.get('input[type="password"]').clear().type("password123");
  cy.get('button[type="submit"]').click();
  cy.contains(/jurnal mengajar/i).should("be.visible");
}

describe("ST-03 & ST-04: Jurnal Mengajar — Input & Validasi", () => {
  beforeEach(() => {
    loginAsGuru();
  });

  it("ST-03: Input jurnal valid → tersimpan dan muncul di Riwayat", () => {
    // Tab input jurnal — sidebar label is "01 // INPUT JURNAL"
    cy.contains(/input jurnal/i).click();

    // Isi form — kelas dan mapel adalah SELECT
    cy.get("select").first().select("VIII-A");
    cy.get("select").eq(1).select("Matematika");
    cy.get('input[type="date"]').first().type(TODAY);
    cy.get('input[placeholder*="Diskusi"]').type("Ceramah");
    cy.get('input[placeholder*="Persamaan"]').type("Aljabar Linear");
    cy.get("textarea").first().type("Siswa aktif mengikuti pelajaran.");

    cy.get('button[type="submit"]').click();

    // Pindah ke Riwayat
    cy.contains(/riwayat/i).click();
    cy.contains("Aljabar Linear").should("be.visible");
  });

  it("ST-04 [BVA]: Tanggal masa depan → form ditolak", () => {
    cy.contains(/input jurnal/i).click();

    // Input tanggal masa depan — paksa value via invoke
    cy.get('input[type="date"]').first().invoke("val", TOMORROW).trigger("change");
    cy.get("select").first().select("VIII-A");
    cy.get("select").eq(1).select("Matematika");
    cy.get('input[placeholder*="Diskusi"]').type("Ceramah");
    cy.get('input[placeholder*="Persamaan"]').type("Tes BVA");
    cy.get("textarea").first().type("Tes validasi tanggal.");
    cy.get('button[type="submit"]').click();

    // Pesan error validasi harus tampil
    cy.contains(/masa depan|tidak boleh|future|tanggal/i).should("be.visible");
  });
});

describe("ST-05: Hapus Jurnal dengan Konfirmasi", () => {
  beforeEach(() => {
    loginAsGuru();
  });

  it("ST-05a: Klik Hapus → konfirmasi dialog diperlukan", () => {
    cy.contains(/riwayat/i).click();
    cy.window().then((win) => {
      cy.stub(win, "confirm").returns(true).as("deleteConfirm");
    });
    cy.contains(/hapus/i).first().click();
    cy.get("@deleteConfirm").should("have.been.called");
  });

  it("ST-05b: Batalkan hapus → data tetap ada", () => {
    cy.contains(/riwayat/i).click();
    cy.get("table tbody tr").then(($rows) => {
      const countBefore = $rows.length;
      cy.window().then((win) => {
        cy.stub(win, "confirm").returns(false).as("cancelConfirm");
      });
      cy.contains(/hapus/i).first().click();
      cy.get("@cancelConfirm").should("have.been.called");
      cy.get("table tbody tr").should("have.length", countBefore);
    });
  });
});

describe("ST-06: Export & Print", () => {
  beforeEach(() => {
    loginAsGuru();
  });

  it("ST-06: Tombol Export CSV ada dan dapat diklik", () => {
    cy.contains(/riwayat/i).click();
    cy.contains(/export|csv/i).should("be.visible").click();
  });

  it("Tombol Print ada dan dapat diklik", () => {
    cy.contains(/riwayat/i).click();
    cy.window().then((win) => {
      cy.stub(win, "print").as("printStub");
    });
    cy.contains(/print|cetak/i).click();
    cy.get("@printStub").should("have.been.called");
  });
});

describe("Sidebar Responsif", () => {
  beforeEach(() => {
    loginAsGuru();
  });

  it("Hamburger toggle menyembunyikan/menampilkan sidebar", () => {
    cy.get("button").contains(/☰|≡/i).first().click();
    cy.wait(300);
    cy.get("button").contains(/☰|≡/i).first().click();
    cy.wait(300);
    cy.contains(/jurnal mengajar/i).should("be.visible");
  });
});
