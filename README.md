# DIU Job Utsob 2026 — Live NFC Card Branding & Generation System

A live digital card personalization studio and event activation web application built for **Skill Jobs** at **DIU Job Utsob 2026** (organized by Daffodil International University Career Development Center - CDC).

---

## 🌟 System Overview & Workflow

This system is an **internal event operations platform** (not a public student self-registration site):

1. **Attendee Intake**: The Skill Jobs team enters attendee details (Full Name, Phone, Email) via the Admin Panel (`/admin`).
2. **Instant Card Personalization**: The system automatically personalizes the official NFC card with dynamic typography scaling and designated name positioning.
3. **High-Resolution PNG**: Sharp composites the card into a 1200 × 756 px @ 300 DPI lossless PNG, available for immediate download (`JOB_UTSOB_2026_[NAME].png`).
4. **Live Venue TV Broadcast**: The card is broadcast in real time to the 16:9 LED display (`/display`) with smooth 3D entrance animations and zero page refresh.
5. **Strict TV Privacy**: The venue TV screen strictly displays only the attendee's name and branded card design (never phone numbers, emails, or database IDs).
6. **Data Export**: The admin team can download the full database at any time via **Excel (.xlsx)** or **CSV (UTF-8 BOM)**.

---

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router) & TypeScript
- **Styling**: Tailwind CSS & Lucide React
- **Animations**: Framer Motion (3D tilt, floating, entrance, sparkles)
- **Image Generation**: Sharp (Lossless PNG card compositing)
- **Database & ORM**: PostgreSQL & Prisma ORM (with seamless local fallback)
- **Validation**: Zod & React Hook Form
- **Data Export**: ExcelJS (styled, filtered workbook) & RFC 4180 UTF-8 BOM CSV
- **Notifications**: Sonner

---

## 📁 Application Routes

| Route | Role | Description |
|---|---|---|
| `/` | Portal Overview | Launchpad directing to Admin Console and Live TV Display |
| `/admin` | Admin Panel | Fast student data entry, live card preview, PNG downloads, student records, and display controls |
| `/admin/login` | Authentication | Secure credential-based login for Skill Jobs team |
| `/display` | Live Venue Display | 16:9 cinematic full-screen LED TV presentation with SSE real-time synchronization |
| `/api/admin/students` | Admin API | CRUD and search endpoint for attendee registrations |
| `/api/admin/students/[id]` | Admin API | Card regeneration and manual TV broadcast trigger |
| `/api/admin/display` | Display API | Controls for Pause, Resume, and Return to Welcome screen |
| `/api/admin/export/excel` | Export API | Generates `JOB_UTSOB_2026_STUDENT_DATA.xlsx` |
| `/api/admin/export/csv` | Export API | Generates `JOB_UTSOB_2026_STUDENT_DATA.csv` |
| `/api/display/current` | Public Display API | Privacy-safe endpoint returning only name and card URL |
| `/api/display/events` | SSE Stream | Real-time push updates for live TV display |

---

## 🔑 Default Credentials

- **Admin Email**: `admin@skill.jobs`
- **Password**: `JobUtsob2026@SkillJobs`

---

## 🛠️ Getting Started

### 1. Installation

```bash
npm install
```

### 2. Environment Variables

Create `.env` based on `.env.example`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/job_utsob_nfc?schema=public"
ADMIN_EMAIL="admin@skill.jobs"
ADMIN_PASSWORD="JobUtsob2026@SkillJobs"
JWT_SECRET="job-utsob-2026-nfc-branding-super-secure-jwt-secret-key-diu"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

*Note: If local PostgreSQL is not running during local event testing, the system automatically uses resilient local persistence so operations never stop.*

### 3. Database Migration (PostgreSQL)

```bash
npx prisma db push
```

### 4. Running the Application

Development mode:
```bash
npm run dev
```

Production build & start:
```bash
npm run build
npm start
```

---

## 🎨 NFC Card Template Customization

- The system includes a built-in luxury Obsidian & Gold event pass card generator embedding the official **Job Utsob 2026** logo, **Skill Jobs** branding, EMV chip, and contactless waves.
- To use an external pre-designed background template, place your PNG or JPG file at:
  - `public/assets/nfc-card-template.png` (or `.jpg`)
- The system will automatically detect and overlay attendee names directly on your supplied image!
