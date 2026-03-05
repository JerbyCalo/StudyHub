# 📚 StudyHub

A student-focused notes and file sharing web app. Organize notes by subject, upload files, and collaborate with classmates using share codes — all in one clean, mobile-friendly interface.

## Live Demo

https://studyhub-byjc.vercel.app/

## ✨ Features

- **Authentication** — Register and login with email/password via Firebase Auth
- **Subjects** — Create subjects with a custom color and icon; join others via a 6-character share code
- **Notes** — Write rich-text notes using a Tiptap editor (bold, italic, headings, lists, code blocks)
- **File Uploads** — Upload PDFs, DOCX, images, and more via Uploadthing; files are scoped per subject
- **Real-time Updates** — Subject, note, and file lists update live using Firestore `onSnapshot`
- **Share System** — Each subject has a unique share code; members can copy and share it with classmates
- **Toast Notifications** — All user actions provide instant feedback via react-hot-toast
- **Loading States** — Spinner feedback on every async action; skeleton loaders on lists
- **Empty States** — Friendly empty state UI for subjects, notes, and files
- **Error Boundary** — NoteEditor is wrapped in a React error boundary with a graceful fallback
- **Mobile Responsive** — Collapsible sidebar with backdrop overlay, responsive grids, truncated filenames

## 🛠️ Tech Stack

| Layer            | Tool / Library          |
| ---------------- | ----------------------- |
| Framework        | Next.js 16 (App Router) |
| Language         | JavaScript (JSX)        |
| Styling          | Tailwind CSS v4         |
| Icons            | Lucide React            |
| Auth             | Firebase Authentication |
| Database         | Firebase Firestore      |
| File Storage     | Uploadthing             |
| Rich Text Editor | Tiptap v3               |
| Toast            | react-hot-toast         |
| Date Utility     | date-fns                |
| ID Generator     | uuid                    |

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file at the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

UPLOADTHING_TOKEN=
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/login/        ← Login page
│   ├── (auth)/register/     ← Register page
│   ├── dashboard/           ← Subject grid + join by code
│   ├── subject/[subjectId]/ ← Notes + files for a subject
│   ├── note/new/            ← Create a new note
│   ├── note/[noteId]/       ← View / edit a note
│   ├── api/uploadthing/     ← Uploadthing route handler
│   └── layout.js            ← Root layout with Toaster
├── components/
│   ├── layout/              ← Navbar, Sidebar
│   ├── subject/             ← SubjectCard, SubjectGrid, AddSubjectModal
│   ├── notes/               ← NoteCard, NoteEditor, NoteEditorBoundary, NoteList
│   ├── files/               ← FileCard, FileList, FileUploader
│   ├── share/               ← ShareLinkModal
│   └── ui/                  ← EmptyState, LoadingSpinner
├── hooks/
│   ├── useAuth.js           ← Auth state, login, register, logout
│   ├── useSubjects.js       ← Subjects CRUD + join by code
│   ├── useNotes.js          ← Notes CRUD (subcollection)
│   ├── useFiles.js          ← File upload + delete (subcollection)
│   └── useRequireAuth.js    ← Redirect guard for protected pages
└── lib/
    └── firebase.js          ← Firebase app + Firestore + Auth instances
```

## 🔐 Firestore Security Rules

See [`firestore.rules`](./firestore.rules) for the full ruleset. In summary:

- Users can only read/write their own profile document
- Only subject members can read subjects, notes, and files
- Any authenticated user can create a subject
- Only the subject owner can delete a subject

## Developer

Built by **Jerby B. Calo**
