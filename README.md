# Smart CV Builder

A React CV builder with a MongoDB-backed client database. Users can create, edit, list, search, duplicate, delete, preview, and download CVs while keeping the approved two-page resume template and PDF export.

## Features

- React + Vite + TypeScript frontend
- Node.js + Express + MongoDB + Mongoose backend
- Tailwind CSS dashboard and A4 resume styling
- `react-hook-form` editor with dynamic skills, education, experience, languages, and certifications
- Axios API service for database persistence
- Client list with search, duplicate, delete confirmation, and PDF download
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
- `/cv/new` - create a new CV client
- `/cv/edit/:id` - edit an existing CV client
- `/cv/preview/:id` - preview and download one client CV

## API Routes

- `GET /api/cv-clients`
- `GET /api/cv-clients/:id`
- `POST /api/cv-clients`
- `PUT /api/cv-clients/:id`
- `DELETE /api/cv-clients/:id`
- `POST /api/cv-clients/:id/duplicate`

## Build

```bash
npm run build
```

## Notes

- The approved CV template is unchanged: dark sidebar, contact band, image frame, section titles, and two-page support remain.
- The preview uses fixed A4 page nodes (`794px x 1123px`) scaled responsively so the downloaded PDF matches the visible preview.
- PDF files are named `FullName-CV.pdf`.
- `backend/.env` must contain a real MongoDB URI before backend CRUD routes can be tested.
