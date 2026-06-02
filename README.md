# Smart CV Builder

A React CV builder with a MongoDB-backed client database. Users can create, edit, list, search, duplicate, delete, preview, and download English and French CV versions for the same client while choosing between multiple saved CV templates.

## Features

- React + Vite + TypeScript frontend
- Node.js + Express + MongoDB + Mongoose backend
- Tailwind CSS dashboard and A4 resume styling
- `react-hook-form` editor with dynamic skills, education, experience, achievements, languages, and certifications
- Axios API service for database persistence
- One client record with shared contact details and `versions.en` / `versions.fr`
- Template selection before creating a CV
- Two templates: Modern Sidebar and Tech Professional
- Client list with search, language status, duplicate, delete confirmation, and language-specific PDF download
- English/French editor and preview switcher
- Clone workflow to prepare French from English or English from French without fake translation
- Optional import of old localStorage CV data into MongoDB
- Fixed A4 preview and PDF export with `html2canvas` and `jsPDF`
- Two-page CV support with safe margins and readable continuation sections

## Frontend Setup

```bash
npm install
npm run dev
```

The frontend runs on the Vite URL, usually `http://localhost:5173`.

Optional frontend environment variable:

```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

If omitted, the app uses `http://localhost:5000/api`.

## Backend Setup

```bash
cd backend
npm install
```

Edit `backend/.env`:

```bash
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Start the API:

```bash
npm run dev
```

The API mounts CV routes at:

```text
http://localhost:5000/api/cv-clients
```

## App Routes

- `/clients` - list/search all CV clients
- `/templates` - choose a CV template before creating a client
- `/cv/new?template=modern-sidebar&lang=en` - create a new CV with the existing sidebar template
- `/cv/new?template=tech-professional&lang=en` - create a new CV with the white/black Tech Professional template
- `/cv/edit/:id?lang=en` - edit one language version of an existing client
- `/cv/preview/:id?lang=fr` - preview and download one language version

## API Routes

- `GET /api/cv-clients`
- `GET /api/cv-clients/:id`
- `POST /api/cv-clients`
- `PUT /api/cv-clients/:id`
- `DELETE /api/cv-clients/:id`
- `POST /api/cv-clients/:id/duplicate`
- `GET /api/cv-clients/:id/versions/:lang`
- `PUT /api/cv-clients/:id/versions/:lang`
- `POST /api/cv-clients/:id/versions/:fromLang/clone/:toLang`

`lang`, `fromLang`, and `toLang` must be `en` or `fr`.

## Build

```bash
npm run build
```

## Notes

- Existing clients without a `template.id` are treated as `modern-sidebar`.
- The approved Modern Sidebar template is unchanged: dark sidebar, contact band, image frame, section titles, and two-page support remain.
- The Tech Professional template uses a white background, black typography, horizontal contact line, clean dividers, and maps skills to Area of Expertise, achievements to Key Achievements, and certifications/languages to Additional Information.
- Shared client fields stay outside versions: full name, email, phone, location, website, and photo URL.
- Language-specific fields stay inside each version: job title, profile, skills, experience, education, achievements, certifications, and languages.
- The preview uses fixed A4 page nodes (`794px x 1123px`) scaled responsively so the downloaded PDF matches the visible preview.
- PDF files are named `FullName-CV-EN.pdf` or `FullName-CV-FR.pdf`.
- `backend/.env` must contain a real MongoDB URI before backend CRUD routes can be tested.
