# CODE WALKTHROUGH
## Penjelasan Detail Kode Program SIS-TERPADU

---

## 📑 DAFTAR ISI

1. [Entry Point (main.tsx)](#entry-point-main.tsx)
2. [Router Configuration](#router-configuration)
3. [Main Application Component](#main-application-component)
4. [Mock Backend Deep Dive](#mock-backend-deep-dive)
5. [UI Components Usage](#ui-components-usage)
6. [State Management Pattern](#state-management-pattern)
7. [Form Handling](#form-handling)
8. [Data Flow Examples](#data-flow-examples)
9. [Custom Hooks](#custom-hooks)
10. [Styling System](#styling-system)

---

## ENTRY POINT (main.tsx)

### File Location
```
src/main.tsx
```

### Code Structure
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { router } from './router';
import './styles.css';

// Initialize app
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found in DOM');
}

// Render with React 19
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

### Penjelasan Line-by-Line

```typescript
import React from 'react';
```
- Import React library (needed for JSX)
- Even though modern React doesn't need it for JSX, explicit import is safer

```typescript
import ReactDOM from 'react-dom/client';
```
- Import ReactDOM client API
- `.client` adalah modern React 18+ API
- Diganti dari `react-dom` yang deprecated

```typescript
import { router } from './router';
```
- Import router configuration
- Router berisi semua routes aplikasi
- File ini manage navigasi antar halaman

```typescript
import './styles.css';
```
- Import global CSS styling
- Tailwind CSS + custom styles
- Loaded pertama kali aplikasi dimulai

```typescript
const rootElement = document.getElementById('root');
```
- Get DOM element dengan id "root"
- Element ini di `public/index.html`
- React akan render di sini

```typescript
if (!rootElement) {
  throw new Error('Root element not found in DOM');
}
```
- Error check untuk development
- Jika tidak ada root element, crash early
- Help debug setup issues

```typescript
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```
- Create root untuk React rendering
- `React.StrictMode` = extra dev checks
- `RouterProvider` = provide router context untuk seluruh app

### Execution Flow
```
main.tsx loads
  ↓
DOM loaded (index.html)
  ↓
React renders to #root element
  ↓
RouterProvider wraps everything
  ↓
App ready for user interaction
```

---

## ROUTER CONFIGURATION

### File Location
```
src/router.tsx
```

### Simplified Code Example
```typescript
import { RootRoute, Router, Route } from '@tanstack/react-router';
import Root from './routes/__root';
import Index from './routes/index';

// Define root route
const rootRoute = new RootRoute({
  component: Root,
  errorComponent: ErrorComponent,
});

// Define application route
const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index,
  beforeLoad: ({ context }) => {
    // Middleware: check if user logged in
    const session = getStoredSessionUser();
    if (!session) {
      // Redirect to login if not authenticated
      throw redirect({ to: '/login' });
    }
  },
});

// Create route tree
const routeTree = rootRoute.addChildren([indexRoute]);

// Create and export router
export const router = new Router({ routeTree });
```

### Key Concepts

**Route Guards (beforeLoad):**
```typescript
beforeLoad: ({ context }) => {
  const session = getStoredSessionUser();
  if (!session) {
    // Check if user is authenticated
    // If not, redirect to login
    throw redirect({ to: '/login' });
  }
  
  // If here, user is logged in
  // Continue to route
}
```

Purpose:
- Prevent unauthorized access
- Check user permissions
- Load data before component renders
- Redirect if needed

**Route Structure:**
```
Root (Layout)
  └── Index (Main App)
        └── Nested components (tabs, modules)
```

### Navigation in Components
```typescript
// Import useNavigate hook
import { useNavigate } from '@tanstack/react-router';

function MyComponent() {
  const navigate = useNavigate();
  
  const handleLogin = async () => {
    // ... login logic
    
    // Navigate to dashboard after login
    navigate({ to: '/' });
  };
  
  return (
    <button onClick={handleLogin}>Login</button>
  );
}
```

---

## MAIN APPLICATION COMPONENT

### File Location
```
src/routes/index.tsx
```

### High-Level Structure
```typescript
export default function Index() {
  // STATE
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeModule, setActiveModule] = useState<ModuleType>('jurnal');
  
  // EFFECTS
  useEffect(() => {
    // Load session on component mount
    const session = getStoredSessionUser();
    setCurrentUser(session);
  }, []);
  
  // HANDLERS
  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };
  
  const handleModuleClick = (module: ModuleType) => {
    setActiveModule(module);
  };
  
  // RENDER
  return (
    <div className="app-container neo-brutalism">
      <Header user={currentUser} onLogout={handleLogout} />
      <Navigation 
        activeModule={activeModule}
        onModuleClick={handleModuleClick}
      />
      <MainContent 
        activeModule={activeModule}
        user={currentUser}
      />
      <Footer />
    </div>
  );
}
```

### Component Breakdown

#### 1. State Management
```typescript
// Manage current logged-in user
const [currentUser, setCurrentUser] = useState<User | null>(null);

// Track which tab/module is active
const [activeModule, setActiveModule] = useState<ModuleType>('jurnal');

// Local state untuk jurnal list (loaded from mockBackend)
const [journals, setJournals] = useState<JournalEntry[]>([]);

// Form state untuk jurnal baru
const [newJournalForm, setNewJournalForm] = useState({
  tanggal: '',
  kelas: '',
  mapel: '',
  materi: '',
  metode: '',
  catatan: '',
});
```

#### 2. Effects (Lifecycle)
```typescript
// Load session on mount
useEffect(() => {
  const session = getStoredSessionUser();
  if (session) {
    setCurrentUser(session);
  } else {
    // Redirect to login if no session
    navigate({ to: '/login' });
  }
}, []); // Empty dependency = run once on mount

// Reload journals when activeModule changes
useEffect(() => {
  if (activeModule === 'jurnal') {
    const entries = listJournalEntries();
    setJournals(entries);
  }
}, [activeModule]);

// Auto-save to localStorage periodically
useEffect(() => {
  const saveInterval = setInterval(() => {
    localStorage.setItem(
      'sis-terpadu-store-v1',
      JSON.stringify(journals)
    );
  }, 30000); // Every 30 seconds
  
  return () => clearInterval(saveInterval); // Cleanup
}, [journals]);
```

#### 3. Event Handlers
```typescript
// Handle logout
const handleLogout = () => {
  logout(); // Clear session from mockBackend
  setCurrentUser(null);
  navigate({ to: '/login' });
};

// Handle module tab click
const handleModuleClick = (module: ModuleType) => {
  setActiveModule(module);
};

// Handle form change
const handleJournalFormChange = (field: string, value: any) => {
  setNewJournalForm(prev => ({
    ...prev,
    [field]: value
  }));
};

// Handle form submit
const handleSaveJournal = async () => {
  // Validate form
  if (!newJournalForm.tanggal || !newJournalForm.kelas) {
    alert('Please fill all required fields');
    return;
  }
  
  // Save to backend
  try {
    const saved = saveJournalEntry(newJournalForm);
    
    // Update UI
    setJournals(prev => [...prev, saved]);
    
    // Reset form
    setNewJournalForm({
      tanggal: '',
      kelas: '',
      // ... reset other fields
    });
    
    // Show success message
    showToast('Jurnal berhasil dibuat', 'success');
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error');
  }
};
```

#### 4. Render Logic
```typescript
return (
  <div className="app-container neo-brutalism">
    {/* Header: User info & logout */}
    <header className="bg-neon-yellow text-black p-4">
      <h1>SIS-TERPADU</h1>
      <p>Welcome, {currentUser?.nama}</p>
      <button onClick={handleLogout}>Logout</button>
    </header>
    
    {/* Navigation: Module tabs */}
    <nav className="tabs flex">
      {getAccessibleModules(currentUser?.role).map(mod => (
        <button
          key={mod}
          onClick={() => handleModuleClick(mod)}
          className={activeModule === mod ? 'active' : ''}
        >
          {mod.toUpperCase()}
        </button>
      ))}
    </nav>
    
    {/* Main content: Module-specific content */}
    <main className="content-area p-4">
      {activeModule === 'jurnal' && (
        <JournalModule 
          user={currentUser}
          journals={journals}
          onSave={handleSaveJournal}
        />
      )}
      
      {activeModule === 'bk' && (
        <BKModule user={currentUser} />
      )}
      
      {activeModule === 'kesiswaan' && (
        <StudentModule user={currentUser} />
      )}
      
      {activeModule === 'pengguna' && currentUser?.role === 'admin' && (
        <UserModule />
      )}
    </main>
    
    {/* Footer */}
    <footer className="bg-gray-900 text-white p-4">
      <p>&copy; 2026 SIS-TERPADU</p>
    </footer>
  </div>
);
```

---

## MOCK BACKEND DEEP DIVE

### File Location
```
src/lib/mockBackend.ts
```

### Database Initialization
```typescript
// Database configuration
const DB_NAME = 'sis-terpadu-db';
const DB_VERSION = 1;

const STORE_NAMES = [
  'users',
  'journalEntries',
  'bkCases',
  'students',
  'activityLogs',
];

// Initialize IndexedDB
function initializeDB(): IDBDatabase {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    // First time opening: create object stores
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create users store
      if (!db.objectStoreNames.contains('users')) {
        const userStore = db.createObjectStore('users', {
          keyPath: 'id',
          autoIncrement: true,
        });
        userStore.createIndex('email', 'email', { unique: true });
        
        // Add seed data
        userStore.add({
          id: 1,
          nama: 'Admin Sekolah',
          email: 'admin@sekolah.test',
          role: 'admin',
          password: 'password123',
        });
      }
      
      // Create journalEntries store
      if (!db.objectStoreNames.contains('journalEntries')) {
        const journalStore = db.createObjectStore('journalEntries', {
          keyPath: 'id',
          autoIncrement: true,
        });
        journalStore.createIndex('authorEmail', 'authorEmail');
        journalStore.createIndex('tanggal', 'tanggal');
      }
      
      // ... similar for other stores
    };
  });
}
```

### Authentication Implementation
```typescript
export function login(email: string, password: string): User | null {
  // Get from IndexedDB
  const db = initializeDB();
  
  return new Promise((resolve) => {
    const transaction = db.transaction(['users'], 'readonly');
    const store = transaction.objectStore('users');
    const index = store.index('email');
    
    const request = index.get(email);
    
    request.onsuccess = () => {
      const user = request.result;
      
      // Validate password (plaintext - for demo only!)
      if (user && user.password === password) {
        // Create session
        const session = {
          id: user.id,
          nama: user.nama,
          email: user.email,
          role: user.role,
        };
        
        // Save session to localStorage
        localStorage.setItem(
          'sis-terpadu-session-v1',
          JSON.stringify(session)
        );
        
        // Log activity
        logActivity(email, 'Login successful');
        
        resolve(user);
      } else {
        logActivity(email, 'Login failed - invalid password');
        resolve(null);
      }
    };
  });
}

export function logout(): void {
  const session = getStoredSessionUser();
  if (session) {
    logActivity(session.email, 'Logout');
  }
  localStorage.removeItem('sis-terpadu-session-v1');
}

export function getStoredSessionUser(): User | null {
  const sessionJson = localStorage.getItem('sis-terpadu-session-v1');
  if (!sessionJson) return null;
  
  try {
    return JSON.parse(sessionJson);
  } catch {
    return null;
  }
}
```

### CRUD Operations
```typescript
// CREATE & UPDATE
export function saveJournalEntry(
  entry: Partial<JournalEntry>
): JournalEntry {
  const db = initializeDB();
  const session = getStoredSessionUser();
  
  if (!session) {
    throw new Error('No session user');
  }
  
  // Create/update entry
  const journalEntry: JournalEntry = {
    id: entry.id || Date.now(), // Use timestamp for new entries
    tanggal: entry.tanggal || '',
    kelas: entry.kelas || '',
    mapel: entry.mapel || '',
    materi: entry.materi || '',
    metode: entry.metode || '',
    catatan: entry.catatan || '',
    authorEmail: session.email, // Add author
  };
  
  return new Promise((resolve) => {
    const transaction = db.transaction(['journalEntries'], 'readwrite');
    const store = transaction.objectStore('journalEntries');
    
    // Insert or update
    const request = entry.id
      ? store.put(journalEntry) // Update
      : store.add(journalEntry); // Insert
    
    request.onsuccess = () => {
      logActivity(session.email, 'Created/updated journal entry');
      resolve(journalEntry);
    };
  });
}

// READ
export function listJournalEntries(
  filter?: { kelas?: string; mapel?: string }
): JournalEntry[] {
  const db = initializeDB();
  const entries: JournalEntry[] = [];
  
  return new Promise((resolve) => {
    const transaction = db.transaction(['journalEntries'], 'readonly');
    const store = transaction.objectStore('journalEntries');
    const request = store.getAll();
    
    request.onsuccess = () => {
      let results = request.result;
      
      // Apply filters
      if (filter?.kelas) {
        results = results.filter(e => e.kelas === filter.kelas);
      }
      if (filter?.mapel) {
        results = results.filter(e => e.mapel === filter.mapel);
      }
      
      resolve(results);
    };
  });
}

// DELETE
export function deleteJournalEntry(id: number): void {
  const db = initializeDB();
  const session = getStoredSessionUser();
  
  return new Promise((resolve) => {
    const transaction = db.transaction(['journalEntries'], 'readwrite');
    const store = transaction.objectStore('journalEntries');
    const request = store.delete(id);
    
    request.onsuccess = () => {
      if (session) {
        logActivity(session.email, `Deleted journal entry ${id}`);
      }
      resolve();
    };
  });
}
```

### Activity Logging
```typescript
export function logActivity(
  userEmail: string,
  action: string
): void {
  const db = initializeDB();
  const log: ActivityLog = {
    id: Date.now(),
    userEmail,
    action,
    timestamp: new Date().toISOString(),
  };
  
  const transaction = db.transaction(['activityLogs'], 'readwrite');
  const store = transaction.objectStore('activityLogs');
  store.add(log);
}

export function getActivityLogs(): ActivityLog[] {
  const db = initializeDB();
  const logs: ActivityLog[] = [];
  
  return new Promise((resolve) => {
    const transaction = db.transaction(['activityLogs'], 'readonly');
    const store = transaction.objectStore('activityLogs');
    const request = store.getAll();
    
    request.onsuccess = () => {
      resolve(request.result.reverse()); // Newest first
    };
  });
}
```

---

## UI COMPONENTS USAGE

### Button Component
```typescript
// Location: src/components/ui/button.tsx

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// Define button variants using CVA
const buttonVariants = cva(
  // Base styles applied to all buttons
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Define Button type props
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

// Button component with forwardRef for ref passing
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);

Button.displayName = 'Button';

export { Button, buttonVariants };
```

### Usage dalam Component
```typescript
import { Button } from '@/components/ui/button';

export function MyComponent() {
  return (
    <div className="flex gap-4">
      {/* Primary button (default) */}
      <Button onClick={() => console.log('Clicked')}>
        Click Me
      </Button>
      
      {/* Destructive button (delete) */}
      <Button variant="destructive">
        Delete
      </Button>
      
      {/* Outline button (secondary action) */}
      <Button variant="outline">
        Cancel
      </Button>
      
      {/* Small button */}
      <Button size="sm">
        Submit
      </Button>
      
      {/* Large button */}
      <Button size="lg">
        Continue
      </Button>
      
      {/* Ghost button (minimal) */}
      <Button variant="ghost">
        Clear
      </Button>
    </div>
  );
}
```

### Dialog Component
```typescript
// Location: src/components/ui/dialog.tsx

import { forwardRef } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

// Dialog wrapper component
const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

// Content (the actual modal box)
const DialogContent = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%]",
        className
      )}
      {...props}
    />
  </DialogPrimitive.Portal>
));

const DialogHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);

const DialogTitle = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle };
```

### Usage dalam Component
```typescript
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function EditForm() {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Edit Journal</Button>
      </DialogTrigger>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Jurnal Mengajar</DialogTitle>
        </DialogHeader>
        
        <form className="space-y-4">
          <input
            type="date"
            placeholder="Tanggal"
            className="w-full border p-2"
          />
          <input
            type="text"
            placeholder="Kelas"
            className="w-full border p-2"
          />
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // Save logic
              setOpen(false);
            }}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

---

## STATE MANAGEMENT PATTERN

### Pattern: Lifting State Up
```typescript
// Parent Component (Dashboard)
function Dashboard() {
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  
  // Define handlers at parent level
  const handleAddJournal = (newJournal: JournalEntry) => {
    setJournals([...journals, newJournal]);
  };
  
  const handleDeleteJournal = (id: number) => {
    setJournals(journals.filter(j => j.id !== id));
  };
  
  // Pass state & handlers to child components
  return (
    <>
      <JournalForm onAdd={handleAddJournal} />
      <JournalTable 
        journals={journals}
        onDelete={handleDeleteJournal}
      />
    </>
  );
}

// Child Component (Table)
interface JournalTableProps {
  journals: JournalEntry[];
  onDelete: (id: number) => void;
}

function JournalTable({ journals, onDelete }: JournalTableProps) {
  return (
    <table>
      <tbody>
        {journals.map(journal => (
          <tr key={journal.id}>
            <td>{journal.tanggal}</td>
            <td>{journal.kelas}</td>
            <td>
              <button onClick={() => onDelete(journal.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Pattern: Local Component State
```typescript
// Component manages own state
function JournalForm() {
  const [formData, setFormData] = useState({
    tanggal: '',
    kelas: '',
    mapel: '',
    materi: '',
  });
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleSubmit = async () => {
    // Save to backend
    const saved = await saveJournalEntry(formData);
    
    // Reset form
    setFormData({
      tanggal: '',
      kelas: '',
      mapel: '',
      materi: '',
    });
    
    // Notify parent via callback
    props.onSuccess(saved);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.tanggal}
        onChange={(e) => handleChange('tanggal', e.target.value)}
      />
      {/* more inputs */}
      <button type="submit">Save</button>
    </form>
  );
}
```

---

## FORM HANDLING

### Using React Hook Form with Zod
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define validation schema with Zod
const journalSchema = z.object({
  tanggal: z.string().min(1, 'Tanggal wajib diisi'),
  kelas: z.string().min(1, 'Kelas wajib dipilih'),
  mapel: z.string().min(1, 'Mapel wajib dipilih'),
  materi: z.string()
    .min(1, 'Materi wajib diisi')
    .max(100, 'Materi max 100 karakter'),
  metode: z.string().min(1, 'Metode wajib dipilih'),
  catatan: z.string().optional(),
});

type JournalFormData = z.infer<typeof journalSchema>;

// Component
function JournalFormComponent() {
  const { register, handleSubmit, formState: { errors } } = useForm<JournalFormData>({
    resolver: zodResolver(journalSchema),
  });
  
  const onSubmit = async (data: JournalFormData) => {
    try {
      const saved = await saveJournalEntry(data);
      console.log('Saved:', saved);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Tanggal:</label>
        <input
          type="date"
          {...register('tanggal')}
        />
        {errors.tanggal && (
          <span className="text-red-500">{errors.tanggal.message}</span>
        )}
      </div>
      
      <div>
        <label>Kelas:</label>
        <select {...register('kelas')}>
          <option value="">Pilih Kelas</option>
          <option value="VII-A">VII-A</option>
          <option value="VII-B">VII-B</option>
          <option value="VIII-A">VIII-A</option>
        </select>
        {errors.kelas && (
          <span className="text-red-500">{errors.kelas.message}</span>
        )}
      </div>
      
      <button type="submit">Simpan</button>
    </form>
  );
}
```

---

## DATA FLOW EXAMPLES

### Data Flow 1: Create Journal Entry

```
User fills form
    ↓
handleSubmit triggered
    ↓
Zod validation
├─ Valid → Continue
└─ Invalid → Show errors

    ↓
Call saveJournalEntry(data)
    ↓
mockBackend.ts
├─ Get current session
├─ Add authorEmail to data
├─ Generate new ID
├─ Save to IndexedDB
├─ Log activity
└─ Return created entry

    ↓
Update component state
├─ setJournals(prev => [...prev, newEntry])
└─ Reset form

    ↓
UI updates
├─ Close modal
├─ Show success toast
├─ Add new row to table
└─ Display new entry
```

### Data Flow 2: Update Student Status

```
Admin clicks "Edit"
    ↓
Modal opens
├─ Load student data
├─ Populate form fields
└─ Show current values

    ↓
User modifies fields
├─ Change status: "Aktif" → "Pindah"
└─ Update other fields

    ↓
Submit form
    ↓
Zod validation
    ↓
Call saveStudent(updatedData)
    ↓
mockBackend.ts
├─ Find existing student by ID
├─ Merge old + new data
├─ Save to IndexedDB (PUT operation)
├─ Log activity
└─ Return updated student

    ↓
Update component state
├─ Update journals array
└─ Close modal

    ↓
UI updates
├─ Tabel refresh
├─ Show success message
└─ New status visible
```

### Data Flow 3: Filter & Search

```
User types in search box
    ↓
onChange event triggers
    ↓
Update search state
├─ setSearchQuery(value)
└─ Trigger filter

    ↓
Filter logic
├─ Get all data
├─ Filter by query
│  └─ Compare: name includes query OR NIS includes query
├─ Sort results
└─ Return filtered list

    ↓
UI updates
├─ Table re-renders
├─ Shows only matching rows
└─ Updates row count
```

---

## CUSTOM HOOKS

### useMobile Hook
```typescript
// Location: src/hooks/use-mobile.tsx

import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768; // 768px is md breakpoint in Tailwind

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
  );
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return isMobile;
}
```

### Usage in Component
```typescript
import { useIsMobile } from '@/hooks/use-mobile';

export function ResponsiveComponent() {
  const isMobile = useIsMobile();
  
  return (
    <div>
      {isMobile ? (
        // Mobile layout
        <MobileLayout />
      ) : (
        // Desktop layout
        <DesktopLayout />
      )}
    </div>
  );
}
```

### Custom useForm Hook
```typescript
function useJournalForm() {
  const [formData, setFormData] = useState({
    tanggal: '',
    kelas: '',
    mapel: '',
    materi: '',
    metode: '',
    catatan: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const saved = await saveJournalEntry(formData);
      setFormData({ /* reset */ });
      return saved;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const reset = () => {
    setFormData({ /* initial state */ });
    setError(null);
  };
  
  return {
    formData,
    isLoading,
    error,
    handleChange,
    handleSubmit,
    reset,
  };
}

// Usage
function MyComponent() {
  const form = useJournalForm();
  
  return (
    <form onSubmit={async () => {
      await form.handleSubmit();
    }}>
      <input
        value={form.formData.tanggal}
        onChange={(e) => form.handleChange('tanggal', e.target.value)}
      />
      {form.error && <p className="text-red-500">{form.error}</p>}
      <button disabled={form.isLoading}>
        {form.isLoading ? 'Loading...' : 'Save'}
      </button>
    </form>
  );
}
```

---

## STYLING SYSTEM

### Tailwind CSS Integration
```css
/* src/styles.css */

@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

/* Custom CSS variables */
:root {
  --color-neon-yellow: #FFFF00;
  --color-neon-green: #00FF00;
  --color-neon-orange: #FF6B00;
  --color-neon-pink: #FF3EA5;
}

/* Neo-brutalism theme */
@layer components {
  .neo-brutalism {
    @apply bg-black text-white;
    @apply border-4 border-white;
    @apply shadow-none;
    @apply contrast-150;
  }
  
  .btn-neon {
    @apply px-6 py-3;
    @apply font-bold;
    @apply bg-neon-yellow text-black;
    @apply border-2 border-black;
    @apply hover:bg-neon-green transition-all;
  }
  
  .card-neo {
    @apply p-4;
    @apply bg-black;
    @apply border-2 border-white;
    @apply hover:shadow-[0_0_20px_rgba(255,255,0,0.5)];
  }
}

/* Custom animations */
@keyframes glitch {
  0% {
    clip-path: inset(40% 0 61% 0);
    transform: translate(-2px, -2px);
  }
  20% {
    clip-path: inset(92% 0 1% 0);
    transform: translate(2px, 2px);
  }
  40% {
    clip-path: inset(43% 0 1% 0);
    transform: translate(-2px, 2px);
  }
  60% {
    clip-path: inset(25% 0 58% 0);
    transform: translate(2px, -2px);
  }
  80% {
    clip-path: inset(54% 0 7% 0);
    transform: translate(-2px, -2px);
  }
  100% {
    clip-path: inset(58% 0 43% 0);
    transform: translate(2px, 2px);
  }
}

.glitch {
  animation: glitch 2s infinite;
}
```

### Usage in Components
```typescript
// Using Tailwind utilities
function Card({ title, children }) {
  return (
    <div className="bg-white border-2 border-gray-800 p-6 shadow-lg hover:shadow-xl transition-shadow">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
}

// Using custom classes from @layer
function NeoButton() {
  return (
    <button className="btn-neon">
      Click Me
    </button>
  );
}

// Combining multiple classes
function Dashboard() {
  return (
    <div className="neo-brutalism min-h-screen">
      <div className="card-neo">
        <p>Neo-brutalism styled card</p>
      </div>
    </div>
  );
}
```

---

**End of Code Walkthrough**

Untuk detail lebih lanjut tentang file-file tertentu:
- Lihat source code langsung di `src/` folder
- Check VSCode IntelliSense (hover over functions/types)
- Read inline comments di kode
- Check TypeScript types (`.d.ts` files if any)
