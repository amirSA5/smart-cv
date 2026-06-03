import { Download, Linkedin } from "lucide-react";
import { profile } from "../data/profileData.js";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>© 2026 Mohamed Amine Noomen. Portfolio professionnel.</p>
        <div>
          <a href={profile.cvUrl} download>
            <Download size={17} />
            CV
          </a>
          <a href={profile.contact.linkedinUrl} target="_blank" rel="noreferrer">
            <Linkedin size={17} />
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
