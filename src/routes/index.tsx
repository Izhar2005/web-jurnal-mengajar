import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";
import {
  clearSessionUser,
  deleteJournalEntry,
  deleteStudent,
  getAccessibleModules,
  getRoleName,
  getStoredSessionUser,
  listBkCases,
  listJournalEntries,
  listStudents,
  listUsers,
  login,
  persistSessionUser,
  saveBkCase,
  saveJournalEntry,
  saveStudent,
  type BkCase,
  type JournalEntry,
  type StudentRecord,
  type User,
  type UserRole,
} from "../lib/mockBackend";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SIS-TERPADU // Jurnal Mengajar" },
      {
        name: "description",
        content:
          "Modul Jurnal Mengajar pada Sistem Sekolah Terintegrasi — antarmuka neo-brutalist untuk guru.",
      },
      { property: "og:title", content: "SIS-TERPADU // Jurnal Mengajar" },
      {
        property: "og:description",
        content: "Dashboard jurnal mengajar bergaya neo-brutalism.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

// ============================================================
// Neo-Brutalism Teaching Journal — Single Page App


type ModuleKey = "jurnal" | "bk" | "kesiswaan" | "pengguna";

const NEON = {
  yellow: "#FFFF00",
  lime: "#00FF00",
  orange: "#FF6B00",
  pink: "#FF3EA5",
};

const BG = "#F4F4F0";
const BLACK = "#000000";

const BORDER = `4px solid ${BLACK}`;
const SHADOW = `8px 8px 0px 0px ${BLACK}`;
const SHADOW_SM = `5px 5px 0px 0px ${BLACK}`;

const fontDisplay =
  '"Archivo Black", "Arial Black", Impact, system-ui, sans-serif';
const fontBody = '"Inter", system-ui, -apple-system, sans-serif';
const fontMono = '"JetBrains Mono", "Courier New", monospace';

// Data seed untuk tabel riwayat
const SEED: JournalEntry[] = [
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
  {
    id: 3,
    tanggal: "2026-07-14",
    kelas: "VIII-B",
    mapel: "Bahasa Inggris",
    materi: "Narrative Text",
    metode: "Ceramah",
    catatan: "-",
    authorEmail: "guru@sekolah.test",
  },
];

function Index() {
  const [activeModule, setActiveModule] = useState<ModuleKey>("jurnal");
  const [tab, setTab] = useState<"input" | "riwayat" | "rekap">("input");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [bkCases, setBkCases] = useState<BkCase[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [sessionUser, setSessionUser] = useState<User | null>(null);
  const [loginForm, setLoginForm] = useState({ email: "guru@sekolah.test", password: "password123" });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [filterKelas, setFilterKelas] = useState("SEMUA");
  const [filterBulan, setFilterBulan] = useState("SEMUA");

  useEffect(() => {
    const stored = getStoredSessionUser();
    if (stored) {
      setSessionUser(stored);
      setLoading(false);
      return;
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    async function load() {
      const [journalData, bkData, studentData, userData] = await Promise.all([
        listJournalEntries(),
        listBkCases(),
        listStudents(),
        listUsers(),
      ]);
      setEntries(journalData);
      setBkCases(bkData);
      setStudents(studentData);
      setUsers(userData);
    }
    void load();
  }, [sessionUser]);

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      const okKelas = filterKelas === "SEMUA" || e.kelas === filterKelas;
      const bulan = e.tanggal.slice(0, 7);
      const okBulan = filterBulan === "SEMUA" || bulan === filterBulan;
      return okKelas && okBulan;
    });
  }, [entries, filterKelas, filterBulan]);

  const bulanUnik = useMemo(
    () => Array.from(new Set(entries.map((e) => e.tanggal.slice(0, 7)))).sort(),
    [entries],
  );

  const accessibleModules = useMemo(() => getAccessibleModules(sessionUser?.role), [sessionUser]);

  function handleSubmitJurnal(entry: Omit<JournalEntry, "id" | "authorEmail">) {
    if (!sessionUser) return;
    void saveJournalEntry(entry, sessionUser.email).then((created) => {
      setEntries((prev) => [created, ...prev]);
      setToast("DATA JURNAL BERHASIL DISIMPAN & TERSINKRONISASI KE DATABASE UTAMA!");
      setTab("riwayat");
      window.setTimeout(() => setToast(null), 3500);
    });
  }

  function handleDeleteJournal(id: number) {
    if (!sessionUser) return;
    if (!window.confirm("Yakin ingin menghapus jurnal ini?")) return;
    void deleteJournalEntry(id, sessionUser.email).then((ok) => {
      if (ok) {
        setEntries((prev) => prev.filter((item) => item.id !== id));
        setToast("DATA JURNAL TERHAPUS");
        window.setTimeout(() => setToast(null), 2000);
      }
    });
  }

  function handleSubmitBk(entry: Omit<BkCase, "id">) {
    if (!sessionUser) return;
    void saveBkCase(entry, sessionUser.email).then((created) => {
      setBkCases((prev) => [created, ...prev]);
      setToast("DATA BK BERHASIL DISIMPAN");
      window.setTimeout(() => setToast(null), 2500);
    });
  }

  function handleSubmitUser(entry: Omit<User, "id">) {
    if (!sessionUser) return;
    const newUser: User = { ...entry, id: Date.now() };
    setUsers((prev) => [newUser, ...prev]);
    setToast("PENGGUNA BARU DITAMBAHKAN");
    window.setTimeout(() => setToast(null), 2500);
  }

  function handleSubmitStudent(entry: Omit<StudentRecord, "id">) {
    if (!sessionUser) return;
    void saveStudent(entry, sessionUser.email).then((created) => {
      setStudents((prev) => [created, ...prev]);
      setToast("DATA SISWA BERHASIL DISIMPAN");
      window.setTimeout(() => setToast(null), 2500);
    });
  }

  function handleDeleteStudent(id: number) {
    if (!sessionUser) return;
    void deleteStudent(id, sessionUser.email).then((ok) => {
      if (ok) {
        setStudents((prev) => prev.filter((item) => item.id !== id));
        setToast("DATA SISWA TERHAPUS");
        window.setTimeout(() => setToast(null), 2000);
      }
    });
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoginError(null);
    const res = await login(loginForm.email, loginForm.password);
    if (!res.ok || !res.user) {
      setLoginError(res.message ?? "Login gagal");
      return;
    }

    persistSessionUser(res.user);
    setSessionUser(res.user);
    setToast(`SELAMAT DATANG, ${res.user.nama.toUpperCase()}`);
    window.setTimeout(() => setToast(null), 2500);
  }

  function handleLogout() {
    clearSessionUser();
    setSessionUser(null);
    setActiveModule("jurnal");
    setToast("KELUAR DARI SISTEM");
    window.setTimeout(() => setToast(null), 2000);
  }

  const moduleTitle = activeModule === "bk" ? "BIMBINGAN KONSELING" : activeModule === "kesiswaan" ? "DATA KESISWAAN" : activeModule === "pengguna" ? "MANAJEMEN PENGGUNA" : "JURNAL MENGAJAR";

  if (loading) {
    return <div style={{ padding: 24, fontFamily: fontDisplay }}>MEMUAT SISTEM...</div>;
  }

  if (!sessionUser) {
    return (
      <div style={{ minHeight: "100vh", background: BG, color: BLACK, padding: 32, fontFamily: fontBody }}>
        <div style={{ maxWidth: 520, margin: "0 auto", background: "#fff", border: BORDER, boxShadow: SHADOW, padding: 24 }}>
          <SectionTitle text="LOGIN SIS-TERPADU" accent={NEON.yellow} />
          <p style={{ marginTop: 16, fontFamily: fontMono, fontSize: 13 }}>Gunakan akun demo berikut: admin, guru, bk, wali, siswa.</p>
          <form onSubmit={handleLogin} style={{ display: "grid", gap: 14, marginTop: 20 }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" style={inputStyle} value={loginForm.email} onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input type="password" style={inputStyle} value={loginForm.password} onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))} />
            </div>
            {loginError && <div style={{ background: "#FFE0E0", border: BORDER, padding: 10, fontFamily: fontMono, fontSize: 12 }}>{loginError}</div>}
            <button type="submit" style={{ padding: "12px 18px", background: NEON.lime, border: BORDER, cursor: "pointer", fontFamily: fontDisplay, boxShadow: SHADOW_SM }}>▶ MASUK</button>
          </form>
          <div style={{ marginTop: 16, fontFamily: fontMono, fontSize: 12, lineHeight: 1.6 }}>
            Demo akun: admin@sekolah.test / password123<br />
            guru@sekolah.test / password123<br />
            bk@sekolah.test / password123<br />
            wali@sekolah.test / password123
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG,
        color: BLACK,
        fontFamily: fontBody,
        display: "flex",
      }}
    >
      {/* Google Fonts inline load — sederhana, tanpa config */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@400;700&display=swap"
      />

      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} accessibleModules={accessibleModules} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main style={{ flex: 1, padding: 32, minWidth: 0 }}>
        <Header activeModule={activeModule} sessionUser={sessionUser} onLogout={handleLogout} />

        <div style={{ marginTop: 16, fontFamily: fontMono, fontSize: 12, background: BLACK, color: NEON.yellow, display: "inline-block", padding: "6px 10px", border: BORDER }}>
          ROLE: {getRoleName(sessionUser.role).toUpperCase()} | MODULE: {moduleTitle}
        </div>

        {activeModule === "jurnal" ? (
          <>
            <TabBar tab={tab} setTab={setTab} />

            <div style={{ marginTop: 28 }}>
              {tab === "input" && <FormJurnal onSubmit={handleSubmitJurnal} />}
              {tab === "riwayat" && (
                <RiwayatJurnal
                  data={filtered}
                  filterKelas={filterKelas}
                  setFilterKelas={setFilterKelas}
                  filterBulan={filterBulan}
                  setFilterBulan={setFilterBulan}
                  bulanOptions={bulanUnik}
                  onDelete={handleDeleteJournal}
                />
              )}
              {tab === "rekap" && <RekapJurnal data={entries} />}
            </div>
          </>
        ) : activeModule === "bk" ? (
          <BimbinganKonselingPage onSubmit={handleSubmitBk} bkCases={bkCases} />
        ) : activeModule === "kesiswaan" ? (
          <DataKesiswaanPage onSubmit={handleSubmitStudent} students={students} onDelete={handleDeleteStudent} />
        ) : (
          <ManajemenPenggunaPage users={users} onSubmit={handleSubmitUser} />
        )}
      </main>

      {toast && <Toast message={toast} />}
    </div>
  );
}

// ---------- SIDEBAR ---------------------------------------------------------
function Sidebar({
  activeModule,
  setActiveModule,
  accessibleModules,
  sidebarOpen,
  setSidebarOpen,
}: {
  activeModule: ModuleKey;
  setActiveModule: (module: ModuleKey) => void;
  accessibleModules: readonly ModuleKey[];
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}) {
  const items: { id: ModuleKey; label: string }[] = [
    { id: "jurnal", label: "JURNAL MENGAJAR" },
    { id: "bk", label: "BIMBINGAN KONSELING" },
    { id: "kesiswaan", label: "DATA KESISWAAN" },
    { id: "pengguna", label: "MANAJEMEN PENGGUNA" },
  ];

  return (
    <aside
      style={{
        width: sidebarOpen ? 280 : 56,
        background: BLACK,
        color: "#fff",
        padding: sidebarOpen ? 24 : "24px 8px",
        borderRight: BORDER,
        display: "flex",
        flexDirection: "column",
        gap: 24,
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "hidden",
        transition: "width 0.2s ease",
      }}
    >
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{ background: "none", border: "2px solid #fff", color: "#fff", cursor: "pointer", fontFamily: fontDisplay, padding: "4px 8px", alignSelf: "flex-start" }}
        aria-label="toggle sidebar"
      >
        ☰
      </button>
      <div
        style={{
          background: NEON.yellow,
          color: BLACK,
          border: `4px solid #fff`,
          padding: "14px 12px",
          fontFamily: fontDisplay,
          fontSize: 22,
          letterSpacing: 1,
          boxShadow: `6px 6px 0px 0px #fff`,
        }}
      >
        SIS//TERPADU
      </div>

      <div style={{ fontFamily: fontMono, fontSize: 11, opacity: 0.7 }}>
        {"// SISTEM SEKOLAH TERINTEGRASI v2.6"}
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((it) => {
          const active = activeModule === it.id;
          const allowed = accessibleModules.includes(it.id);
          return (
            <button
              key={it.id}
              onClick={() => allowed && setActiveModule(it.id)}
              disabled={!allowed}
              style={{
                textAlign: "left",
                padding: "14px 14px",
                fontFamily: fontDisplay,
                fontSize: 14,
                letterSpacing: 0.5,
                border: `3px solid #fff`,
                background: active ? NEON.lime : "#222",
                color: active ? BLACK : allowed ? "#fff" : "#666",
                cursor: allowed ? "pointer" : "not-allowed",
                boxShadow: active ? `5px 5px 0px 0px ${NEON.pink}` : "none",
                textTransform: "uppercase",
                opacity: allowed ? 1 : 0.55,
              }}
            >
              {active ? "▶ " : "• "}
              {it.label}
              {!allowed && <span style={{ display: "block", fontFamily: fontMono, fontSize: 9, marginTop: 4 }}>[NO ACCESS]</span>}
            </button>
          );
        })}
      </nav>

      <div style={{ marginTop: "auto" }}>
        <div
          style={{
            background: "#fff",
            color: BLACK,
            border: `4px solid ${NEON.yellow}`,
            padding: 14,
            boxShadow: `5px 5px 0px 0px ${NEON.orange}`,
          }}
        >
          <div style={{ fontFamily: fontMono, fontSize: 10, opacity: 0.7 }}>
            LOGGED-IN USER
          </div>
          <div
            style={{
              fontFamily: fontDisplay,
              fontSize: 18,
              marginTop: 4,
              textTransform: "uppercase",
            }}
          >
            Bpk. Andika W.
          </div>
          <div
            style={{
              display: "inline-block",
              marginTop: 8,
              background: BLACK,
              color: "#fff",
              padding: "4px 8px",
              fontFamily: fontMono,
              fontSize: 11,
              fontWeight: 700,
              border: `2px solid ${BLACK}`,
            }}
          >
            ROLE: GURU (MAPEL)
          </div>
        </div>
      </div>
    </aside>
  );
}

// ---------- HEADER ----------------------------------------------------------
function Header({ activeModule, sessionUser, onLogout }: { activeModule: ModuleKey; sessionUser: User | null; onLogout: () => void }) {
  const meta =
    activeModule === "bk"
      ? {
          badge: "// MODULE_ACTIVE :: GUIDANCE_CENTER",
          title: "Bimbingan Konseling.",
          desc: "Pantau perkembangan siswa, catatan konseling, dan tindak lanjut intervensi secara terstruktur.",
          status: "LIVE",
        }
      : activeModule === "kesiswaan"
        ? {
            badge: "// MODULE_ACTIVE :: STUDENT_DATA",
            title: "Data Kesiswaan.",
            desc: "Kelola data siswa, kelas, absensi, dan progress akademik dalam satu panel yang ringkas.",
            status: "SYNC",
          }
        : activeModule === "pengguna"
          ? {
              badge: "// MODULE_ACTIVE :: USER_MANAGEMENT",
              title: "Manajemen Pengguna.",
              desc: "Atur akses akun guru, staf, dan admin dengan kontrol role yang jelas dan aman.",
              status: "SECURE",
            }
          : {
              badge: "// MODULE_ACTIVE :: TEACHING_JOURNAL",
              title: "Jurnal Mengajar.",
              desc: "Catat, arsipkan, dan analisa aktivitas mengajar harian Anda. Semua data tersinkron langsung ke Database Utama Sekolah.",
              status: "ONLINE",
            };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        flexWrap: "wrap",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: fontMono,
            fontSize: 12,
            background: BLACK,
            color: NEON.lime,
            display: "inline-block",
            padding: "4px 8px",
            marginBottom: 10,
          }}
        >
          {meta.badge}
        </div>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontSize: 44,
            margin: 0,
            lineHeight: 1,
            textTransform: "uppercase",
            letterSpacing: -1,
          }}
        >
          {meta.title}
        </h1>
        <p
          style={{
            marginTop: 8,
            fontSize: 14,
            maxWidth: 640,
          }}
        >
          {meta.desc}
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div
          style={{
            background: NEON.pink,
            border: BORDER,
            padding: "12px 16px",
            fontFamily: fontDisplay,
            fontSize: 14,
            boxShadow: SHADOW_SM,
            textTransform: "uppercase",
          }}
        >
          STATUS: <span style={{ background: BLACK, color: NEON.lime, padding: "2px 6px" }}>{meta.status}</span>
        </div>
        {sessionUser && (
          <button onClick={onLogout} style={{ background: "#fff", border: BORDER, padding: "10px 12px", fontFamily: fontDisplay, cursor: "pointer", boxShadow: SHADOW_SM }}>
            LOGOUT
          </button>
        )}
      </div>
    </div>
  );
}

// ---------- TAB BAR ---------------------------------------------------------
function TabBar({
  tab,
  setTab,
}: {
  tab: string;
  setTab: (t: "input" | "riwayat" | "rekap") => void;
}) {
  const tabs: { id: "input" | "riwayat" | "rekap"; label: string; color: string }[] = [
    { id: "input", label: "01 // INPUT JURNAL", color: NEON.yellow },
    { id: "riwayat", label: "02 // RIWAYAT", color: NEON.lime },
    { id: "rekap", label: "03 // REKAP", color: NEON.orange },
  ];
  return (
    <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
      {tabs.map((t) => {
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              fontFamily: fontDisplay,
              fontSize: 14,
              padding: "12px 20px",
              border: BORDER,
              background: active ? t.color : "#fff",
              color: BLACK,
              cursor: "pointer",
              boxShadow: active ? SHADOW_SM : `3px 3px 0px 0px ${BLACK}`,
              transform: active ? "translate(-2px,-2px)" : "none",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------- MODULE CONTENT -------------------------------------------------
function BimbinganKonselingPage({ onSubmit, bkCases }: { onSubmit: (entry: Omit<BkCase, "id">) => void; bkCases: BkCase[] }) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ nama: "", nis: "", kelas: "", kasus: "", tindakLanjut: "", status: "Baru", tanggal: new Date().toISOString().slice(0, 10), penanggungJawab: "" });

  const filtered = bkCases.filter((c) =>
    c.nama.toLowerCase().includes(search.toLowerCase()) ||
    c.kasus.toLowerCase().includes(search.toLowerCase())
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(form);
    setForm({ nama: "", nis: "", kelas: "", kasus: "", tindakLanjut: "", status: "Baru", tanggal: new Date().toISOString().slice(0, 10), penanggungJawab: "" });
    setShowForm(false);
  }

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <Card>
        <SectionTitle text="BIMBINGAN KONSELING // MODULE" accent={NEON.pink} />
        <div style={{ marginTop: 18, display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <div style={{ border: BORDER, padding: 16, background: NEON.yellow }}>
            <div style={{ fontFamily: fontDisplay, fontSize: 12, letterSpacing: 1 }}>KELAS PRIORITAS</div>
            <div style={{ fontFamily: fontDisplay, fontSize: 28, marginTop: 8 }}>12 SISWA</div>
            <div style={{ fontFamily: fontMono, fontSize: 12, marginTop: 6 }}>3 kasus butuh penanganan khusus</div>
          </div>
          <div style={{ border: BORDER, padding: 16, background: "#fff" }}>
            <div style={{ fontFamily: fontDisplay, fontSize: 12, letterSpacing: 1 }}>STATUS MINGGUAN</div>
            <div style={{ fontFamily: fontMono, fontSize: 13, marginTop: 8, lineHeight: 1.7 }}>
              • 4 sesi selesai<br />
              • 2 evaluasi menunggu<br />
              • 1 rujukan belum ditindaklanjuti
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle text="DAFTAR KASUS BK" accent={NEON.lime} />
        <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <input
            placeholder="Cari nama atau kasus..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...inputStyle, maxWidth: 320 }}
          />
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ padding: "10px 16px", background: NEON.lime, border: BORDER, cursor: "pointer", fontFamily: fontDisplay, fontSize: 13 }}
          >
            ▶ TAMBAH KASUS BK
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: 16, display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            <div><label style={labelStyle}>Nama Siswa *</label><input placeholder="Nama Siswa" style={inputStyle} value={form.nama} onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))} required /></div>
            <div><label style={labelStyle}>NIS *</label><input placeholder="NIS" style={inputStyle} value={form.nis} onChange={(e) => setForm((f) => ({ ...f, nis: e.target.value }))} required /></div>
            <div><label style={labelStyle}>Kelas *</label><input placeholder="Kelas" style={inputStyle} value={form.kelas} onChange={(e) => setForm((f) => ({ ...f, kelas: e.target.value }))} required /></div>
            <div><label style={labelStyle}>Kasus *</label><input placeholder="Kasus" style={inputStyle} value={form.kasus} onChange={(e) => setForm((f) => ({ ...f, kasus: e.target.value }))} required /></div>
            <div><label style={labelStyle}>Tindak Lanjut</label><input placeholder="Tindak Lanjut" style={inputStyle} value={form.tindakLanjut} onChange={(e) => setForm((f) => ({ ...f, tindakLanjut: e.target.value }))} /></div>
            <div><label style={labelStyle}>Penanggung Jawab</label><input placeholder="Penanggung Jawab" style={inputStyle} value={form.penanggungJawab} onChange={(e) => setForm((f) => ({ ...f, penanggungJawab: e.target.value }))} /></div>
            <div style={{ gridColumn: "1 / -1" }}>
              <button type="submit" style={{ padding: "12px 20px", background: NEON.lime, border: BORDER, cursor: "pointer", fontFamily: fontDisplay, fontSize: 14 }}>▶ SIMPAN</button>
            </div>
          </form>
        )}

        <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
          {filtered.length === 0 && <div style={{ fontFamily: fontMono, fontSize: 13, opacity: 0.6 }}>Tidak ada data kasus.</div>}
          {filtered.map((c) => (
            <div key={c.id} style={{ border: BORDER, padding: 12 }}>
              <div style={{ fontFamily: fontDisplay, fontSize: 14 }}>{c.nama} — {c.kelas}</div>
              <div style={{ fontFamily: fontMono, fontSize: 12, marginTop: 4 }}>NIS: {c.nis} | Kasus: {c.kasus}</div>
              <div style={{ fontFamily: fontMono, fontSize: 12, marginTop: 4 }}>Status: <strong>{c.status}</strong> | {c.tanggal}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function DataKesiswaanPage({ onSubmit, students, onDelete }: { onSubmit: (entry: Omit<StudentRecord, "id">) => void; students: StudentRecord[]; onDelete?: (id: number) => void }) {
  const [search, setSearch] = useState("");
  const items = [
    "Kelas VII-A: 32 siswa",
    "Kelas VIII-B: 30 siswa",
    "Kehadiran rata-rata minggu ini: 97%",
  ];

  const filtered = students.filter((s) =>
    s.nama.toLowerCase().includes(search.toLowerCase()) ||
    s.nis.includes(search) ||
    s.kelas.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <Card>
        <SectionTitle text="DATA KESISWAAN // MODULE" accent={NEON.lime} />
        <div style={{ marginTop: 18, display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <div style={{ border: BORDER, padding: 16, background: NEON.lime }}>
            <div style={{ fontFamily: fontDisplay, fontSize: 12, letterSpacing: 1 }}>JUMLAH SISWA</div>
            <div style={{ fontFamily: fontDisplay, fontSize: 28, marginTop: 8 }}>312</div>
          </div>
          <div style={{ border: BORDER, padding: 16, background: "#fff" }}>
            <div style={{ fontFamily: fontDisplay, fontSize: 12, letterSpacing: 1 }}>KELAS AKTIF</div>
            <div style={{ fontFamily: fontDisplay, fontSize: 28, marginTop: 8 }}>12</div>
          </div>
          <div style={{ border: BORDER, padding: 16, background: NEON.yellow }}>
            <div style={{ fontFamily: fontDisplay, fontSize: 12, letterSpacing: 1 }}>ABSENSI HARI INI</div>
            <div style={{ fontFamily: fontDisplay, fontSize: 28, marginTop: 8 }}>96%</div>
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle text="RINGKASAN SISWA" accent={NEON.orange} />
        <ul style={{ paddingLeft: 18, fontFamily: fontMono, fontSize: 13, lineHeight: 1.8, marginTop: 16 }}>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Card>

      <Card>
        <SectionTitle text="DAFTAR SISWA" accent={NEON.yellow} />
        <div style={{ marginTop: 12, marginBottom: 16 }}>
          <input
            placeholder="Cari nama, NIS, atau kelas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...inputStyle, maxWidth: 360 }}
          />
        </div>
        <div style={{ display: "grid", gap: 12 }}>
          {filtered.length === 0 && <div style={{ fontFamily: fontMono, fontSize: 13, opacity: 0.6 }}>Tidak ada data siswa.</div>}
          {filtered.map((student) => (
            <div key={student.id} style={{ border: BORDER, padding: 12, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontFamily: fontDisplay, fontSize: 14 }}>{student.nama}</div>
                <div style={{ fontFamily: fontMono, fontSize: 12, marginTop: 4 }}>NIS: {student.nis} • Kelas: {student.kelas}</div>
                <span style={{ display: "inline-block", marginTop: 4, fontFamily: fontMono, fontSize: 11, background: student.status === "Aktif" ? NEON.lime : NEON.orange, border: BORDER, padding: "2px 8px" }}>{student.status}</span>
              </div>
              <button onClick={() => onDelete?.(student.id)} style={{ background: NEON.orange, border: BORDER, padding: "8px 10px", fontFamily: fontDisplay, cursor: "pointer" }}>HAPUS</button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ManajemenPenggunaPage({ users, onSubmit }: { users: User[]; onSubmit: (entry: Omit<User, "id">) => void }) {
  const [form, setForm] = useState({ nama: "", email: "", password: "", role: "guru" as User["role"] });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(form);
    setForm({ nama: "", email: "", password: "", role: "guru" });
  }

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <Card>
        <SectionTitle text="MANAJEMEN PENGGUNA // MODULE" accent={NEON.orange} />
        <div style={{ marginTop: 18, display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <div style={{ border: BORDER, padding: 16, background: NEON.orange }}>
            <div style={{ fontFamily: fontDisplay, fontSize: 12, letterSpacing: 1 }}>TOTAL AKUN</div>
            <div style={{ fontFamily: fontDisplay, fontSize: 28, marginTop: 8 }}>{users.length}</div>
          </div>
          <div style={{ border: BORDER, padding: 16, background: "#fff" }}>
            <div style={{ fontFamily: fontDisplay, fontSize: 12, letterSpacing: 1 }}>AKSES TERBARU</div>
            <div style={{ fontFamily: fontMono, fontSize: 13, marginTop: 8, lineHeight: 1.6 }}>
              2 akun baru ditambahkan<br />
              1 reset password tertunda
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle text="TAMBAH PENGGUNA BARU" accent={NEON.pink} />
        <form onSubmit={handleSubmit} style={{ marginTop: 16, display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <div><label style={labelStyle}>Nama *</label><input placeholder="Nama Lengkap" style={inputStyle} value={form.nama} onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))} required /></div>
          <div><label style={labelStyle}>Email *</label><input type="email" placeholder="email@sekolah.test" style={inputStyle} value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required /></div>
          <div><label style={labelStyle}>Password *</label><input type="password" placeholder="Password" style={inputStyle} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required /></div>
          <div>
            <label style={labelStyle}>Role *</label>
            <select style={inputStyle} value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as User["role"] }))}>
              <option value="admin">admin</option>
              <option value="guru">guru</option>
              <option value="bk">bk</option>
              <option value="wali">wali</option>
              <option value="siswa">siswa</option>
            </select>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <button type="submit" style={{ padding: "12px 20px", background: NEON.lime, border: BORDER, cursor: "pointer", fontFamily: fontDisplay, fontSize: 14 }}>▶ TAMBAH PENGGUNA</button>
          </div>
        </form>
      </Card>

      <Card>
        <SectionTitle text="DAFTAR PENGGUNA" accent={NEON.yellow} />
        <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
          {users.map((u) => (
            <div key={u.id} style={{ border: BORDER, padding: 12, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontFamily: fontDisplay, fontSize: 14 }}>{u.nama}</div>
                <div style={{ fontFamily: fontMono, fontSize: 12, marginTop: 4 }}>{u.email} • Role: <strong>{u.role}</strong></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ---------- CARD wrapper ----------------------------------------------------
function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: BORDER,
        boxShadow: SHADOW,
        padding: 24,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ---------- FORM ------------------------------------------------------------
const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  border: BORDER,
  background: "#fff",
  fontFamily: fontBody,
  fontSize: 15,
  fontWeight: 700,
  outline: "none",
  boxShadow: `3px 3px 0px 0px ${BLACK}`,
  borderRadius: 0,
};

const labelStyle: CSSProperties = {
  fontFamily: fontDisplay,
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: 1,
  marginBottom: 6,
  display: "block",
};

function FormJurnal({
  onSubmit,
}: {
  onSubmit: (entry: Omit<JournalEntry, "id" | "authorEmail">) => void;
}) {
  const [form, setForm] = useState({
    kelas: "",
    mapel: "",
    tanggal: "",
    materi: "",
    metode: "",
    catatan: "",
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [dateError, setDateError] = useState<string | null>(null);
  const [pressed, setPressed] = useState(false);

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k as string]) setErrors((e) => ({ ...e, [k]: false }));
    if (k === "tanggal") setDateError(null);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    setDateError(null);
    const newErrors: Record<string, boolean> = {};
    (Object.keys(form) as (keyof typeof form)[]).forEach((k) => {
      if (!form[k].trim()) newErrors[k] = true;
    });
    if (form.tanggal && form.tanggal > new Date().toISOString().slice(0, 10)) {
      setDateError("Tanggal tidak boleh masa depan (future date).");
      return;
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    onSubmit(form);
    setForm({ kelas: "", mapel: "", tanggal: "", materi: "", metode: "", catatan: "" });
  }

  const errStyle = (k: string): CSSProperties =>
    errors[k]
      ? { ...inputStyle, background: "#FFE0E0", borderColor: "#B00020" }
      : inputStyle;

  return (
    <Card>
      <SectionTitle text="INPUT JURNAL // HARIAN" accent={NEON.yellow} />

      <form
        onSubmit={submit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 20,
          marginTop: 20,
        }}
      >
        <div>
          <label style={labelStyle}>Pilih Kelas *</label>
          <select
            style={errStyle("kelas")}
            value={form.kelas}
            onChange={(e) => update("kelas", e.target.value)}
          >
            <option value="">— PILIH —</option>
            <option>VII-A</option>
            <option>VII-B</option>
            <option>VIII-A</option>
            <option>VIII-B</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Mata Pelajaran *</label>
          <select
            style={errStyle("mapel")}
            value={form.mapel}
            onChange={(e) => update("mapel", e.target.value)}
          >
            <option value="">— PILIH —</option>
            <option>Matematika</option>
            <option>Informatika</option>
            <option>Bahasa Inggris</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Tanggal Mengajar *</label>
          <input
            type="date"
            style={errStyle("tanggal")}
            value={form.tanggal}
            onChange={(e) => update("tanggal", e.target.value)}
          />
        </div>

        <div>
          <label style={labelStyle}>Metode Pembelajaran *</label>
          <input
            type="text"
            placeholder="Diskusi / Ceramah / Praktikum"
            style={errStyle("metode")}
            value={form.metode}
            onChange={(e) => update("metode", e.target.value)}
          />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Materi Pembelajaran *</label>
          <input
            type="text"
            placeholder="Contoh: Persamaan Kuadrat Bab 3"
            style={errStyle("materi")}
            value={form.materi}
            onChange={(e) => update("materi", e.target.value)}
          />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Catatan Pembelajaran / Hambatan *</label>
          <textarea
            rows={4}
            placeholder="Tulis catatan hambatan siswa, keaktifan kelas, dsb."
            style={{ ...errStyle("catatan"), resize: "vertical", fontFamily: fontBody }}
            value={form.catatan}
            onChange={(e) => update("catatan", e.target.value)}
          />
        </div>

        <div style={{ gridColumn: "1 / -1", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <button
            type="submit"
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
            onMouseLeave={() => setPressed(false)}
            style={{
              padding: "16px 28px",
              fontFamily: fontDisplay,
              fontSize: 18,
              letterSpacing: 1,
              textTransform: "uppercase",
              background: NEON.lime,
              color: BLACK,
              border: BORDER,
              cursor: "pointer",
              boxShadow: pressed ? `0px 0px 0px ${BLACK}` : SHADOW,
              transform: pressed ? "translate(8px, 8px)" : "none",
              transition: "transform 60ms linear, box-shadow 60ms linear",
            }}
          >
            ▶ SIMPAN & SINKRONISASI
          </button>
          {Object.keys(errors).length > 0 && (
            <span
              style={{
                background: "#B00020",
                color: "#fff",
                padding: "6px 10px",
                fontFamily: fontMono,
                fontSize: 12,
                border: BORDER,
              }}
            >
              ! FIELD KOSONG TERDETEKSI
            </span>
          )}
          {dateError && (
            <span
              style={{
                background: "#B00020",
                color: "#fff",
                padding: "6px 10px",
                fontFamily: fontMono,
                fontSize: 12,
                border: BORDER,
              }}
            >
              ! {dateError}
            </span>
          )}
        </div>
      </form>
    </Card>
  );
}

// ---------- RIWAYAT ---------------------------------------------------------
function RiwayatJurnal({
  data,
  filterKelas,
  setFilterKelas,
  filterBulan,
  setFilterBulan,
  bulanOptions,
  onDelete,
}: {
  data: JournalEntry[];
  filterKelas: string;
  setFilterKelas: (v: string) => void;
  filterBulan: string;
  setFilterBulan: (v: string) => void;
  bulanOptions: string[];
  onDelete?: (id: number) => void;
}) {
  return (
    <Card>
      <SectionTitle text="RIWAYAT JURNAL // ARSIP" accent={NEON.lime} />

      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 20,
          flexWrap: "wrap",
          padding: 14,
          border: BORDER,
          background: BG,
        }}
      >
        <div>
          <label style={labelStyle}>FILTER KELAS</label>
          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            style={{ ...inputStyle, minWidth: 160 }}
          >
            <option value="SEMUA">SEMUA KELAS</option>
            <option>VII-A</option>
            <option>VII-B</option>
            <option>VIII-A</option>
            <option>VIII-B</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>FILTER BULAN</label>
          <select
            value={filterBulan}
            onChange={(e) => setFilterBulan(e.target.value)}
            style={{ ...inputStyle, minWidth: 180 }}
          >
            <option value="SEMUA">SEMUA BULAN</option>
            {bulanOptions.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
        <div
          style={{
            marginLeft: "auto",
            alignSelf: "flex-end",
            fontFamily: fontMono,
            fontSize: 12,
            background: BLACK,
            color: NEON.yellow,
            padding: "8px 12px",
            border: BORDER,
          }}
        >
          TOTAL: {data.length} ENTRI
        </div>
        <button
          onClick={() => {
            const rows = data.map((r) => `${r.tanggal},${r.kelas},${r.mapel},"${r.materi}","${r.metode}","${r.catatan}"`);
            const csv = ["tanggal,kelas,mapel,materi,metode,catatan", ...rows].join("\n");
            const a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
            a.download = "jurnal-export.csv";
            a.click();
          }}
          style={{ padding: "8px 14px", background: NEON.lime, border: BORDER, cursor: "pointer", fontFamily: fontDisplay, fontSize: 12, alignSelf: "flex-end" }}
        >
          ▶ EXPORT CSV
        </button>
        <button
          onClick={() => window.print()}
          style={{ padding: "8px 14px", background: NEON.pink, border: BORDER, cursor: "pointer", fontFamily: fontDisplay, fontSize: 12, alignSelf: "flex-end" }}
        >
          ▶ PRINT / PDF
        </button>
      </div>

      <div style={{ marginTop: 20, overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: fontMono,
            fontSize: 13,
            minWidth: 780,
          }}
        >
          <thead>
            <tr style={{ background: BLACK, color: "#fff" }}>
              {["TANGGAL", "KELAS", "MAPEL", "MATERI", "METODE", "STATUS"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: 12,
                    textAlign: "left",
                    border: BORDER,
                    fontFamily: fontDisplay,
                    fontSize: 12,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: 24,
                    textAlign: "center",
                    border: BORDER,
                    background: "#fff",
                  }}
                >
                  [ TIDAK ADA DATA UNTUK FILTER INI ]
                </td>
              </tr>
            )}
            {data.map((r, i) => (
              <tr
                key={r.id}
                style={{
                  background: i % 2 === 0 ? "#fff" : "#FAFAF5",
                }}
              >
                <td style={tdStyle}>{r.tanggal}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      background: NEON.yellow,
                      border: `2px solid ${BLACK}`,
                      padding: "2px 6px",
                    }}
                  >
                    {r.kelas}
                  </span>
                </td>
                <td style={tdStyle}>{r.mapel}</td>
                <td style={tdStyle}>{r.materi}</td>
                <td style={tdStyle}>{r.metode}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      background: BLACK,
                      color: NEON.lime,
                      padding: "4px 8px",
                      fontFamily: fontDisplay,
                      fontSize: 10,
                      letterSpacing: 0.5,
                      border: `2px solid ${BLACK}`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    ● TERINTEGRASI DI DATABASE UTAMA
                  </span>
                </td>
                <td style={tdStyle}>
                  <button
                    onClick={() => onDelete?.(r.id)}
                    style={{
                      background: NEON.orange,
                      border: BORDER,
                      padding: "6px 10px",
                      fontFamily: fontDisplay,
                      fontSize: 10,
                      cursor: "pointer",
                    }}
                  >
                    HAPUS
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

const tdStyle: CSSProperties = {
  padding: 12,
  border: BORDER,
  verticalAlign: "top",
};

// ---------- REKAP -----------------------------------------------------------
function RekapJurnal({ data }: { data: JournalEntry[] }) {
  const now = new Date();
  const bulanIni = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const totalBulanIni = data.filter((d) => d.tanggal.startsWith(bulanIni)).length;
  const jamMengajar = totalBulanIni * 2; // asumsi 2 jam per sesi
  const kelasUnik = new Set(data.map((d) => d.kelas)).size;
  const capaian = Math.min(100, Math.round((data.length / 20) * 100)); // target 20 sesi

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div
        style={{
          display: "grid",
          gap: 20,
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        }}
      >
        <BigStat
          label="TOTAL JAM MENGAJAR / BULAN INI"
          value={jamMengajar}
          suffix="JAM"
          bg={NEON.yellow}
        />
        <BigStat
          label="JUMLAH KELAS DIAJAR"
          value={kelasUnik}
          suffix="KELAS"
          bg={NEON.orange}
        />
        <BigStat
          label="TOTAL ENTRI JURNAL"
          value={data.length}
          suffix="ENTRI"
          bg={NEON.pink}
        />
      </div>

      <Card>
        <SectionTitle text="CAPAIAN KURIKULUM // SEMESTER" accent={NEON.lime} />
        <div style={{ marginTop: 16, fontFamily: fontMono, fontSize: 13 }}>
          Target: 20 sesi mengajar per semester — <b>{capaian}%</b> tercapai.
        </div>
        <div
          style={{
            marginTop: 14,
            display: "flex",
            gap: 4,
            border: BORDER,
            padding: 4,
            background: "#fff",
          }}
        >
          {Array.from({ length: 20 }).map((_, i) => {
            const filled = i < Math.round((capaian / 100) * 20);
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 28,
                  background: filled ? NEON.lime : "#EEE",
                  border: `2px solid ${BLACK}`,
                }}
              />
            );
          })}
        </div>
        <div
          style={{
            marginTop: 10,
            fontFamily: fontMono,
            fontSize: 11,
            opacity: 0.7,
          }}
        >
          {"// PROGRESS_BAR :: BLOCK_STYLE :: BRUTAL"}
        </div>
      </Card>

      <Card style={{ background: BLACK, color: "#fff" }}>
        <div style={{ fontFamily: fontDisplay, fontSize: 20, textTransform: "uppercase" }}>
          Ringkasan Sinkronisasi
        </div>
        <p style={{ fontFamily: fontMono, fontSize: 13, lineHeight: 1.6 }}>
          Seluruh {data.length} entri jurnal telah tersinkronisasi dengan{" "}
          <span style={{ background: NEON.lime, color: BLACK, padding: "2px 6px" }}>
            DATABASE UTAMA
          </span>
          . Modul BK, Data Kesiswaan, dan Manajemen Pengguna dapat mengakses data
          ini secara read-only.
        </p>
      </Card>
    </div>
  );
}

function BigStat({
  label,
  value,
  suffix,
  bg,
}: {
  label: string;
  value: number;
  suffix: string;
  bg: string;
}) {
  return (
    <div
      style={{
        background: bg,
        border: BORDER,
        boxShadow: SHADOW,
        padding: 20,
      }}
    >
      <div style={{ fontFamily: fontDisplay, fontSize: 12, letterSpacing: 1 }}>
        {label}
      </div>
      <div
        style={{
          fontFamily: fontMono,
          fontSize: 64,
          lineHeight: 1,
          fontWeight: 700,
          marginTop: 8,
        }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <div
        style={{
          fontFamily: fontDisplay,
          fontSize: 14,
          background: BLACK,
          color: "#fff",
          display: "inline-block",
          padding: "3px 8px",
          marginTop: 8,
        }}
      >
        {suffix}
      </div>
    </div>
  );
}

// ---------- SHARED ----------------------------------------------------------
function SectionTitle({ text, accent }: { text: string; accent: string }) {
  return (
    <div
      style={{
        display: "inline-block",
        background: accent,
        border: BORDER,
        padding: "6px 12px",
        fontFamily: fontDisplay,
        fontSize: 16,
        letterSpacing: 1,
        textTransform: "uppercase",
        boxShadow: `4px 4px 0px 0px ${BLACK}`,
      }}
    >
      {text}
    </div>
  );
}

function Toast({ message }: { message: string }) {
  return (
    <div
      role="status"
      style={{
        position: "fixed",
        right: 32,
        bottom: 32,
        background: NEON.lime,
        color: BLACK,
        border: BORDER,
        boxShadow: SHADOW,
        padding: "14px 18px",
        fontFamily: fontDisplay,
        fontSize: 14,
        maxWidth: 380,
        textTransform: "uppercase",
        zIndex: 50,
        animation: "none",
      }}
    >
      ✓ {message}
    </div>
  );
}
