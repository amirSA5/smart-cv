import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import ClientsPage from "./pages/ClientsPage";
import CVFormPage from "./pages/CVFormPage";
import CVPreviewPage from "./pages/CVPreviewPage";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "rounded-md px-3 py-2 text-sm font-bold transition",
    isActive ? "bg-evergreen text-white" : "text-slate-600 hover:text-evergreen",
  ].join(" ");

const App = () => (
  <div className="min-h-screen overflow-x-hidden bg-paper">
    <header className="no-print border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-evergreen">
            Smart CV Builder
          </p>
          <h1 className="mt-2 break-words text-xl font-black leading-tight tracking-tight text-charcoal sm:text-3xl">
            Bilingual CV editor and live A4 preview
          </h1>
        </div>
        <nav className="flex flex-wrap gap-2">
          <NavLink className={navLinkClass} to="/clients">
            Clients
          </NavLink>
          <NavLink className={navLinkClass} to="/cv/new?lang=en">
            New CV
          </NavLink>
        </nav>
      </div>
    </header>

    <Routes>
      <Route path="/" element={<Navigate replace to="/clients" />} />
      <Route path="/clients" element={<ClientsPage />} />
      <Route path="/cv/new" element={<CVFormPage />} />
      <Route path="/cv/edit/:id" element={<CVFormPage />} />
      <Route path="/cv/preview/:id" element={<CVPreviewPage />} />
      <Route path="*" element={<Navigate replace to="/clients" />} />
    </Routes>
  </div>
);

export default App;
