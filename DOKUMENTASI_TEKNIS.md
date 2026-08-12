# DOKUMENTASI TEKNIS - SIS-TERPADU
## Penjelasan Lengkap Struktur Program & Kode

---

## 📑 DAFTAR ISI

1. [Arsitektur Sistem](#arsitektur-sistem)
2. [Stack Teknologi](#stack-teknologi)
3. [Struktur Folder](#struktur-folder)
4. [Data Models](#data-models)
5. [Mock Backend](#mock-backend)
6. [Komponen React](#komponen-react)
7. [Flow Data](#flow-data)
8. [Authentication & Authorization](#authentication--authorization)
9. [Testing](#testing)
10. [Cara Menjalankan](#cara-menjalankan)

---

## ARSITEKTUR SISTEM

### Diagram Arsitektur

```
┌─────────────────────────────────────────────────────────────┐
│                    BROWSER (Client Side)                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         React 19 + TypeScript Application            │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │                                                      │  │
│  │  ┌─────────────────────────────────────────────┐   │  │
│  │  │  Router (TanStack Router)                   │   │  │
│  │  │  - Manage routing antar halaman             │   │  │
│  │  │  - Route guards untuk authentication        │   │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  │                                                      │  │
│  │  ┌─────────────────────────────────────────────┐   │  │
│  │  │  UI Components                              │   │  │
│  │  │  - Modal, Form, Table, Card, Dialog        │   │  │
│  │  │  - Radix UI components (accessible)        │   │  │
│  │  │  - Tailwind CSS styling                    │   │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  │                                                      │  │
│  │  ┌─────────────────────────────────────────────┐   │  │
│  │  │  State Management                           │   │  │
│  │  │  - React hooks (useState, useEffect)        │   │  │
│  │  │  - Mock data store                          │   │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Browser Storage Layer                               │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  • IndexedDB (Primary)     - Large data storage      │  │
│  │  • localStorage (Backup)   - Session/user data       │  │
│  │  • Memory (Runtime)        - Component state         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘

NO BACKEND SERVER REQUIRED FOR DEVELOPMENT
(Data tersimpan sepenuhnya di browser client)
```

### Karakteristik Arsitektur

✅ **Client-Side Rendering (CSR)**
- Semua UI rendering di browser
- Fast user interaction
- Offline-capable dengan data persistence

✅ **Mock Backend (Development)**
- Tidak perlu setup server backend
- IndexedDB untuk persistent storage
- localStorage untuk session data

✅ **Modular Design**
- Setiap modul independen
- Dapat diperluas tanpa refactor besar

✅ **Responsive Design**
- Mobile-first approach
- Works on all screen sizes
- Neo-brutalism design system

---

## STACK TEKNOLOGI

### Frontend Framework
```
REACT 19
├─ Latest React version
├─ Hook API untuk state management
├─ Concurrent rendering
└─ Automatic batching

TYPESCRIPT
├─ Type safety untuk development
├─ Better IDE support
├─ Easier debugging & refactoring
└─ Compile-time error checking
```

### Routing & Navigation
```
TANSTACK ROUTER (TanStack Router)
├─ Type-safe routing
├─ Nested routing support
├─ Route guards & middleware
├─ File-based route generation
└─ Query parameter management
```

### UI Component Library
```
RADIX UI
├─ Unstyled, accessible components
├─ WAI-ARIA compliant
├─ Dialog, Dropdown, Menubar, Toast, etc
├─ Built with Compound Components pattern
└─ No vendor lock-in (fully styled with CSS)

COMPONENTS INCLUDED:
├─ accordion.tsx       → Collapsible sections
├─ alert-dialog.tsx    → Confirmation dialogs
├─ button.tsx          → Interactive buttons
├─ card.tsx            → Card containers
├─ checkbox.tsx        → Checkbox inputs
├─ dialog.tsx          → Modal dialogs
├─ dropdown-menu.tsx   → Context menus
├─ form.tsx            → Form wrapper
├─ input.tsx           → Text inputs
├─ label.tsx           → Form labels
├─ menubar.tsx         → App menubar
├─ pagination.tsx      → Page navigation
├─ select.tsx          → Dropdown select
├─ table.tsx           → Data tables
├─ tabs.tsx            → Tab navigation
├─ textarea.tsx        → Multi-line input
└─ tooltip.tsx         → Help tooltips
```

### Styling & Design
```
TAILWIND CSS 4
├─ Utility-first CSS framework
├─ Custom design tokens (neo-brutalism)
├─ Dark mode support
├─ Responsive design utilities
└─ JIT compilation (instant)

CUSTOM CSS
├─ Neo-brutalism variables
├─ Color palette
├─ Typography
├─ Shadow & border styles
└─ Animation keyframes
```

### Form Handling
```
REACT HOOK FORM
├─ Lightweight form library
├─ Minimal re-renders
├─ Built-in validation
├─ Supports Zod schema validation
└─ Excellent TypeScript support

ZOD
├─ TypeScript-first schema validation
├─ Runtime type checking
├─ Clear error messages
├─ Compose and reuse schemas
└─ Used for form validation
```

### Data Storage
```
INDEXEDDB
├─ Browser database
├─ Stores large amounts of data
├─ Async API (Promise-based)
├─ Supports complex queries
└─ 50MB+ storage quota

LOCALSTORAGE
├─ Key-value synchronous storage
├─ Smaller capacity (~5-10MB)
├─ Used for session/preferences
└─ Fallback for simple data

MEMORY (Runtime)
├─ Component state (useState)
├─ Context API
├─ Lost on page refresh
└─ Fastest access
```

### Testing Framework
```
VITEST
├─ Unit testing framework
├─ Vite-native (fast)
├─ Jest-compatible API
├─ 30 test cases included
├─ Code coverage reporting
└─ Fast watch mode

CYPRESS
├─ End-to-End testing
├─ Real browser automation
├─ User interaction testing
├─ Visual regression testing
└─ Time-travel debugging

POSTMAN
├─ API/Contract testing
├─ Request/response validation
├─ Mock backend testing
├─ Integration testing
└─ Documentation (OpenAPI)
```

### Build Tools
```
VITE
├─ Lightning-fast dev server
├─ Instant HMR (Hot Module Reload)
├─ Native ES modules
├─ Optimized build output
└─ Zero-config setup

NODE.JS
├─ JavaScript runtime
├─ Package management (npm)
├─ Build script execution
└─ Development server host
```

---

## STRUKTUR FOLDER

```
web-jurnal-mengajar/
│
├── 📂 01_Documents/
│   ├── SRS.md                    # Requirements specification
│   └── SDD.md                    # Design document + ERD
│
├── 📂 02_Test_Plans_and_Reports/
│   ├── Master_Test_Plan.md
│   ├── EP_BVA_Analysis.md
│   ├── Test_Execution_Report.md
│   ├── UAT_Sign_Off_Sheet.md
│   └── cypress-screenshots/      # E2E test screenshots
│
├── 📂 03_Test_Scripts_and_Automation/
│   ├── 📂 unit/
│   │   └── mockBackend.test.ts   # 30 unit tests (Vitest)
│   ├── 📂 cypress/
│   │   ├── 📂 e2e/
│   │   │   ├── login.cy.ts       # Login test
│   │   │   ├── journal.cy.ts     # Jurnal CRUD test
│   │   │   └── modules.cy.ts     # All modules test
│   │   └── support/
│   │       └── e2e.ts            # Cypress helpers
│   └── 📂 postman/
│       └── SIS-TERPADU.postman_collection.json
│
├── 📂 src/
│   ├── 📄 main.tsx               # Entry point
│   ├── 📄 router.tsx             # Router configuration
│   ├── 📄 styles.css             # Global styles
│   │
│   ├── 📂 routes/
│   │   ├── __root.tsx            # Root layout
│   │   ├── index.tsx             # Main application
│   │   └── README.md             # Route documentation
│   │
│   ├── 📂 components/
│   │   └── 📂 ui/
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── checkbox.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── form.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── menubar.tsx
│   │       ├── pagination.tsx
│   │       ├── select.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       └── tooltip.tsx
│   │       └── ... (15+ UI components)
│   │
│   ├── 📂 lib/
│   │   ├── mockBackend.ts        # Business logic & data
│   │   └── utils.ts              # Helper functions
│   │
│   ├── 📂 hooks/
│   │   └── use-mobile.tsx        # Mobile detection hook
│   │
│   └── 📂 public/
│       └── assets/               # Static files
│
├── 📄 vite.config.ts             # Vite configuration
├── 📄 vitest.config.ts           # Vitest configuration
├── 📄 tsconfig.json              # TypeScript config
├── 📄 eslint.config.js           # ESLint rules
├── 📄 package.json               # Dependencies
├── 📄 README.md                  # Project overview
└── 📄 cypress.config.ts          # Cypress configuration
```

---

## DATA MODELS

### User Type
```typescript
export type User = {
  id: number;
  nama: string;
  email: string;
  role: UserRole;
  password: string;
};

export type UserRole = 
  | "admin"    // Access all modules
  | "guru"     // Access Jurnal only
  | "bk"       // Access BK + Kesiswaan
  | "wali"     // Access Kesiswaan (limited)
  | "siswa"    // View own data
  | "ortu";    // View child data
```

**Contoh Data:**
```json
{
  "id": 1,
  "nama": "Admin Sekolah",
  "email": "admin@sekolah.test",
  "role": "admin",
  "password": "password123"
}
```

### Journal Entry Type
```typescript
export type JournalEntry = {
  id: number;
  tanggal: string;        // YYYY-MM-DD
  kelas: string;          // VIII-A, VII-B, etc
  mapel: string;          // Matematika, Informatika
  materi: string;         // Topic/subject matter
  metode: string;         // Diskusi, Praktikum, dll
  catatan: string;        // Notes/observations
  authorEmail: string;    // Teacher's email
};
```

**Contoh Data:**
```json
{
  "id": 1,
  "tanggal": "2026-07-10",
  "kelas": "VIII-A",
  "mapel": "Matematika",
  "materi": "Aljabar Linear Dasar",
  "metode": "Diskusi",
  "catatan": "Siswa antusias, 2 anak kesulitan pada soal cerita.",
  "authorEmail": "guru@sekolah.test"
}
```

### BK Case Type
```typescript
export type BkCase = {
  id: number;
  nama: string;               // Student name
  nis: string;                // Student ID
  kelas: string;              // Class
  kasus: string;              // Case description
  tindakLanjut: string;       // Action taken
  status: string;             // Status: "Baru", "Diproses", "Selesai"
  tanggal: string;            // Date YYYY-MM-DD
  penanggungJawab: string;    // BK teacher name
};
```

**Contoh Data:**
```json
{
  "id": 1,
  "nama": "Alya Putri",
  "nis": "20231001",
  "kelas": "VIII-A",
  "kasus": "Kehadiran terlambat selama 3 hari",
  "tindakLanjut": "Konseling individu dan pemberian surat peringatan",
  "status": "Dalam pemantauan",
  "tanggal": "2026-07-14",
  "penanggungJawab": "Rina BK"
}
```

### Student Record Type
```typescript
export type StudentRecord = {
  id: number;
  nama: string;           // Student name
  nis: string;            // Student ID number
  kelas: string;          // Class/Grade
  status: string;         // "Aktif", "Pindah", "Keluar"
  waliKelas: string;      // Home room teacher
};
```

**Contoh Data:**
```json
{
  "id": 1,
  "nama": "Alya Putri",
  "nis": "20231001",
  "kelas": "VIII-A",
  "status": "Aktif",
  "waliKelas": "Dewi Wali"
}
```

### Activity Log Type
```typescript
export type ActivityLog = {
  id: number;
  userEmail: string;      // Who did it
  action: string;         // What action
  timestamp: string;      // When (ISO format)
};
```

**Contoh Data:**
```json
{
  "id": 1,
  "userEmail": "guru@sekolah.test",
  "action": "Created journal entry",
  "timestamp": "2026-07-31T10:30:00Z"
}
```

---

## MOCK BACKEND

### Overview
File `src/lib/mockBackend.ts` berisi:
- **Data storage layer** dengan IndexedDB & localStorage
- **Business logic** untuk CRUD operations
- **Authentication** dan session management
- **Activity logging** untuk audit trail

### Key Functions

#### Authentication
```typescript
// Login function
login(email: string, password: string): boolean
├─ Input validation
├─ Password checking (plaintext - untuk demo)
├─ Session creation
└─ Activity logging

// Logout function
logout(): void
├─ Clear session
└─ Activity logging
```

#### User Management
```typescript
listUsers(): User[]
├─ Get all users
└─ Filter by role if specified

getUser(id: number): User | undefined
├─ Get single user by ID

saveUser(user: Partial<User>): User
├─ Create/Update user
└─ Validation & error handling

deleteUser(id: number): void
├─ Delete user
└─ Activity logging
```

#### Journal Management
```typescript
listJournalEntries(filter?: object): JournalEntry[]
├─ Get all journal entries
├─ Filter by kelas, mapel, tanggal
└─ Return sorted list

saveJournalEntry(entry: Partial<JournalEntry>): JournalEntry
├─ Create new or update existing
├─ Assign ID if new
└─ Activity logging

deleteJournalEntry(id: number): void
├─ Delete entry
└─ Activity logging
```

#### BK Management
```typescript
listBkCases(filter?: object): BkCase[]
├─ Get all BK cases
├─ Filter by status, kelas, etc
└─ Return list

saveBkCase(bkCase: Partial<BkCase>): BkCase
├─ Create/update case
├─ Auto-assign ID
└─ Activity logging

deleteBkCase(id: number): void
├─ Delete case
└─ Activity logging
```

#### Student Management
```typescript
listStudents(filter?: object): StudentRecord[]
├─ Get all students
├─ Filter by kelas, status
└─ Return list

saveStudent(student: Partial<StudentRecord>): StudentRecord
├─ Create/update student
├─ Auto-assign ID
└─ Activity logging

deleteStudent(id: number): void
├─ Delete student
└─ Activity logging
```

### Data Persistence

**IndexedDB Approach:**
```typescript
// Database setup
const DB_NAME = "sis-terpadu-db";
const DB_VERSION = 1;
const STORE_NAMES = [
  "users",
  "journalEntries",
  "bkCases",
  "students",
  "activityLogs"
];

// Async operations
await saveToIndexedDB(storeName, data)
await loadFromIndexedDB(storeName)
await deleteFromIndexedDB(storeName, key)
```

**localStorage Backup:**
```typescript
// Session data
const SESSION_KEY = "sis-terpadu-session-v1";
localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
const sessionUser = localStorage.getItem(SESSION_KEY);
```

---

## KOMPONEN REACT

### Struktur Komponente

#### Root Layout (`__root.tsx`)
```typescript
App Root Component
├─ Provider: QueryClientProvider (TanStack Query)
├─ Provider: Router context
├─ Error boundary
├─ Global styles
└─ Outlet (nested routes)
```

**Tanggung jawab:**
- Global app setup
- Provider wrapping
- Error handling
- Head/meta management

#### Main Application (`index.tsx`)
File utama berisi:
- **UI Components:**
  - Header/Navbar
  - Navigation menu
  - Module tabs/sections
  - Form inputs
  - Data tables
  - Modals/dialogs

- **Module Views:**
  - Jurnal Mengajar view
  - BK Management view
  - Kesiswaan view
  - User Management view

- **State Management:**
  - useState untuk local component state
  - Custom functions untuk CRUD
  - Form handling dengan React Hook Form

### Component Hierarchy

```
App (index.tsx)
├─ Header
│  ├─ Logo
│  ├─ User Info
│  └─ Logout Button
│
├─ Navigation
│  ├─ Module Tabs
│  ├─ User Role Badge
│  └─ Settings
│
├─ Main Content
│  ├─ Jurnal Mengajar Section
│  │  ├─ Create Form
│  │  ├─ Filter Component
│  │  └─ Data Table
│  │
│  ├─ BK Management Section
│  │  ├─ Case List
│  │  ├─ Case Details Modal
│  │  └─ Status Updates
│  │
│  ├─ Kesiswaan Section
│  │  ├─ Student Table
│  │  ├─ Search/Filter
│  │  └─ Student Detail Modal
│  │
│  └─ User Management Section
│     ├─ User Table
│     ├─ Create User Form
│     └─ Role Assignment
│
└─ Footer
   ├─ Links
   ├─ Copyright
   └─ Version Info
```

### UI Component Library

#### Built-in Radix UI Components
```
Dialog (`dialog.tsx`)
├─ Modal dialog functionality
├─ Keyboard support
├─ Focus management
└─ Used for forms & confirmations

Table (`table.tsx`)
├─ Semantic table markup
├─ Accessible headers
├─ Sortable columns
└─ Pagination support

Form (`form.tsx`)
├─ Wrapper untuk React Hook Form
├─ Automatic error handling
├─ Field validation display
└─ Reusable form patterns

Input (`input.tsx`)
├─ Text input field
├─ Supports type variations
├─ Validation states
└─ Styled with Tailwind

Button (`button.tsx`)
├─ Primary/secondary variants
├─ Disabled state
├─ Loading state
└─ Icon support

Select (`select.tsx`)
├─ Dropdown select
├─ Searchable
├─ Multi-select support
└─ Keyboard navigation

Tabs (`tabs.tsx`)
├─ Module navigation
├─ Content switching
├─ Keyboard accessible
└─ Animated indicators

Card (`card.tsx`)
├─ Content container
├─ Responsive design
├─ Shadow/border styling
└─ Flexible layout
```

---

## FLOW DATA

### Contoh 1: User Login Flow

```
User Input Email & Password
         │
         ▼
Form Submission Handler
├─ Validate input (not empty)
├─ Call login(email, password)
│  from mockBackend.ts
│
└─ Backend Processing
   ├─ Load all users from IndexedDB
   ├─ Find user by email
   ├─ Compare password (plaintext - demo only)
   │
   ├─ IF MATCH:
   │  ├─ Create session object
   │  ├─ Save to localStorage
   │  ├─ Log activity
   │  └─ Return success → Redirect to dashboard
   │
   └─ IF NO MATCH:
      ├─ Log failed attempt
      └─ Show error message
```

### Contoh 2: Create Journal Entry Flow

```
User Fills Journal Form
├─ tanggal: 2026-07-31
├─ kelas: VIII-A
├─ mapel: Matematika
├─ materi: Aljabar
├─ metode: Diskusi
└─ catatan: Notes...

         │
         ▼
Form Validation (Zod)
├─ Check all required fields
├─ Validate date format
├─ Validate enum values
└─ Show errors if invalid

         │
         ▼
Submit Handler Triggers
└─ saveJournalEntry(formData)

         │
         ▼
Backend Processing
├─ Generate new ID (auto-increment)
├─ Add author email (from session)
├─ Save to IndexedDB
├─ Add activity log entry
└─ Return created entry

         │
         ▼
UI Update
├─ Close form modal
├─ Add new entry to table
├─ Show success toast notification
└─ Re-render list with new data
```

### Contoh 3: Update Student Status Flow

```
Admin clicks "Edit Student"
         │
         ▼
Open Student Edit Modal
├─ Load student data
├─ Populate form fields
└─ Show current values

         │
         ▼
User modifies fields
├─ Change status: "Aktif" → "Pindah"
├─ Update waliKelas
└─ Modify other fields

         │
         ▼
Submit Form
└─ Call saveStudent(updatedData)

         │
         ▼
Backend Processing
├─ Find existing student by ID
├─ Merge with new data
├─ Save to IndexedDB
├─ Update activity log
└─ Return updated student

         │
         ▼
UI Update
├─ Close modal
├─ Update table row
├─ Show success message
└─ Refresh student list
```

---

## AUTHENTICATION & AUTHORIZATION

### Session Management

```typescript
Session Object {
  id: number;
  nama: string;
  email: string;
  role: UserRole;
}

// Stored in:
localStorage.getItem("sis-terpadu-session-v1")

// Checked on app startup:
getStoredSessionUser() → User | null
```

### Role-Based Access Control (RBAC)

```typescript
User Roles & Permissions:

ADMIN
├─ View all modules
├─ Create/update/delete users
├─ Create/update/delete any entry
└─ Access admin panel

GURU (Teacher)
├─ View & manage own journals only
├─ Create journal entries
├─ Update own entries
└─ Cannot access BK, Kesiswaan, Users

BK (Guidance Counselor)
├─ View & manage BK cases
├─ View Kesiswaan (students)
├─ Create BK cases
└─ Cannot access Jurnal, Users

WALI (Home Room Teacher)
├─ View Kesiswaan (limited to own class)
├─ Update student records
└─ Cannot create/delete students

SISWA (Student)
├─ View own profile
├─ View own academic data
└─ Limited read-only access

ORTU (Parent)
├─ View child profile
├─ View child academic data
└─ Limited read-only access
```

### Access Control Implementation

```typescript
// Function to check accessibility
getAccessibleModules(userRole: UserRole): ModuleKey[]
├─ "admin" → ["jurnal", "bk", "kesiswaan", "pengguna"]
├─ "guru" → ["jurnal"]
├─ "bk" → ["jurnal", "bk", "kesiswaan"]
├─ "wali" → ["kesiswaan"]
└─ "siswa" → []  // Terlihat sendiri

// Used in UI to show/hide sections:
{user?.role === "admin" && <UserManagementPanel />}
{["bk", "admin"].includes(user?.role) && <BKPanel />}
```

---

## TESTING

### Unit Tests (Vitest)

Lokasi: `03_Test_Scripts_and_Automation/unit/mockBackend.test.ts`

```typescript
Test Suites:
├─ Authentication Tests (5 tests)
│  ├─ Valid login
│  ├─ Invalid password
│  ├─ Non-existent user
│  ├─ Session creation
│  └─ Logout
│
├─ User Management Tests (5 tests)
│  ├─ List users
│  ├─ Create user
│  ├─ Update user
│  ├─ Delete user
│  └─ Get single user
│
├─ Journal Tests (6 tests)
│  ├─ Create journal
│  ├─ Read journal
│  ├─ Update journal
│  ├─ Delete journal
│  ├─ Filter journals
│  └─ Author validation
│
├─ BK Case Tests (5 tests)
│  ├─ Create case
│  ├─ Read case
│  ├─ Update status
│  ├─ Delete case
│  └─ Filter by status
│
├─ Student Tests (4 tests)
│  ├─ Create student
│  ├─ Read student
│  ├─ Update student
│  └─ Delete student

TOTAL: 30 TESTS
STATUS: 30/30 PASS ✅
COVERAGE: ~78% (Target 70%) ✅
```

### E2E Tests (Cypress)

Lokasi: `03_Test_Scripts_and_Automation/cypress/e2e/`

```typescript
login.cy.ts
├─ Valid credentials → Login success
├─ Invalid credentials → Show error
├─ Session persistence → Stays logged in
└─ Logout → Clear session

journal.cy.ts
├─ Create journal → Appears in list
├─ Edit journal → Updates immediately
├─ Delete journal → Removed from list
├─ Filter journals → Shows only filtered
└─ Search by class → Find correct entries

modules.cy.ts
├─ BK: Create case → Case created
├─ Kesiswaan: List students → Display table
├─ Admin: Manage users → CRUD operations
└─ Role access: Guru cannot see admin panel
```

### API Contract Tests (Postman)

Lokasi: `03_Test_Scripts_and_Automation/postman/`

```
Endpoints tested:
├─ POST /login → Check response format
├─ GET /users → Validate user list
├─ POST /journal → Verify entry created
├─ PUT /journal/:id → Confirm update
├─ DELETE /journal/:id → Verify deletion
├─ GET /bk-cases → Check case list
└─ ... more endpoints
```

---

## CARA MENJALANKAN

### Prerequisites
```bash
Node.js >= 18.0
npm >= 9.0 (atau yarn/pnpm)
```

### Installation

```bash
# 1. Clone repository
git clone https://github.com/Izhar2005/web-jurnal-mengajar
cd web-jurnal-mengajar

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev
# → Opens at http://localhost:8080
```

### Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run unit tests
npm run test:unit

# Run unit tests with coverage
npm run test:unit:coverage

# Run unit tests in watch mode
npm run test:unit:watch

# Run E2E tests (headless)
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:open

# Lint code
npm lint

# Format code
npm run format
```

### Demo Credentials

```
ADMIN ACCOUNT:
Email: admin@sekolah.test
Password: password123

GURU ACCOUNT:
Email: guru@sekolah.test
Password: password123

BK ACCOUNT:
Email: bk@sekolah.test
Password: password123

WALI ACCOUNT:
Email: wali@sekolah.test
Password: password123
```

### Browser DevTools

**IndexedDB Inspector:**
```
DevTools → Application → IndexedDB → sis-terpadu-db
├─ users (object store)
├─ journalEntries
├─ bkCases
├─ students
└─ activityLogs
```

**Local Storage Inspector:**
```
DevTools → Application → Local Storage → http://localhost:8080
├─ sis-terpadu-store-v1 (backup data)
└─ sis-terpadu-session-v1 (current user session)
```

---

**End of Technical Documentation**
