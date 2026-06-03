import {
  ArrowDown,
  Download,
  Factory,
  Linkedin,
  Mail,
  PackageCheck,
  Phone,
  TrendingDown,
} from "lucide-react";
import { achievements, profile } from "../data/profileData.js";
import Reveal from "./Reveal.jsx";

function Hero() {
  return (
    <section id="accueil" className="hero section-dark">
      <div className="hero-bg" aria-hidden="true" />
      <div className="container hero-layout">
        <Reveal className="hero-copy">
          <span className="eyebrow">
            <Factory size={16} />
            Plasturgie, approvisionnement & coordination fournisseurs
          </span>
          <h1>{profile.name}</h1>
          <p className="hero-title">{profile.title}</p>
          <p className="hero-tagline">{profile.tagline}</p>

          <div className="hero-actions">
            <a className="btn btn-primary" href={profile.cvUrl} download>
              <Download size={18} />
              Télécharger le CV
            </a>
            <a className="btn btn-secondary" href="#contact">
              <Mail size={18} />
              Me contacter
            </a>
            <a
              className="btn btn-ghost"
              href={profile.contact.linkedinUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin size={18} />
              Voir LinkedIn
            </a>
          </div>

          <div className="hero-contact" aria-label="Coordonnées rapides">
            <span>
              <Phone size={16} />
              {profile.contact.phone}
            </span>
            <span>
              <Mail size={16} />
              {profile.contact.email}
            </span>
          </div>
        </Reveal>

        <Reveal className="hero-visual" delay={120}>
          <div className="profile-orbit">
            <div className="profile-card">
              <div className="avatar">
                <img src={profile.photoUrl} alt="Mohamed Amine Noomen" />
              </div>
              <div>
                <strong>Assistant achats industriels</strong>
                <p>Approvisionnement, fournisseurs, coûts et flux.</p>
              </div>
            </div>
            <div className="signal-card signal-top">
              <PackageCheck size={20} />
              Cycle de commande maîtrisé
            </div>
            <div className="signal-card signal-bottom">
              <TrendingDown size={20} />
              Optimisation achats mesurable
            </div>
          </div>

          <div className="hero-metrics" aria-label="Réalisations clés">
            {achievements.slice(0, 2).map((item) => (
              <div key={item.value}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
      <a className="scroll-cue" href="#profil" aria-label="Aller au profil">
        <ArrowDown size={20} />
      </a>
    </section>
  );
}

export default Hero;
