import { useEffect, useState } from "react";
import { Download, FileText, Menu, X } from "lucide-react";
import { navItems, profile } from "../data/profileData.js";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 1080) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <nav className="navbar container" aria-label="Navigation principale">
        <a className="brand" href="#accueil" onClick={closeMenu}>
          <span className="brand-mark">MN</span>
          <span>
            <strong>Mohamed Amine</strong>
            <small>Achats industriels</small>
          </span>
        </a>

        <button
          className="nav-toggle"
          type="button"
          aria-controls="primary-navigation"
          aria-expanded={open}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div id="primary-navigation" className={`nav-links ${open ? "is-open" : ""}`}>
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
          <a className="nav-download" href={profile.cvUrl} download onClick={closeMenu}>
            <Download size={17} />
            CV
          </a>
          <a className="nav-download" href={profile.motivationLetterUrl} download onClick={closeMenu}>
            <FileText size={17} />
            Lettre
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
