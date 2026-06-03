import { CheckCircle2, ClipboardList, Factory, Route } from "lucide-react";
import { profile } from "../data/profileData.js";
import Reveal from "./Reveal.jsx";

const focusAreas = [
  {
    icon: Factory,
    title: "Environnement industriel",
    text: "Lecture des priorités terrain, suivi des pièces et coordination avec production et entrepôt.",
  },
  {
    icon: ClipboardList,
    title: "Cycle achat complet",
    text: "Demandes de devis, comparaison des offres, commandes, relances et suivi des livraisons.",
  },
  {
    icon: Route,
    title: "Approvisionnement fiable",
    text: "Organisation des réceptions, anticipation des besoins et communication interservices.",
  },
];

function About() {
  return (
    <section id="profil" className="section section-light">
      <div className="container two-column">
        <Reveal>
          <span className="section-kicker">Profil</span>
          <h2>Un profil achats construit pour l'industrie et la performance opérationnelle.</h2>
        </Reveal>

        <Reveal delay={100} className="about-content">
          <p>{profile.summary}</p>
          <div className="profile-proof">
            <CheckCircle2 size={20} />
            <span>
              Positionnement cible : achats industriels, plasturgie, supply chain, coordination
              fournisseurs et optimisation budgétaire.
            </span>
          </div>
        </Reveal>
      </div>

      <div className="container focus-grid">
        {focusAreas.map((area, index) => {
          const Icon = area.icon;
          return (
            <Reveal key={area.title} className="focus-card" delay={index * 90}>
              <Icon size={24} />
              <h3>{area.title}</h3>
              <p>{area.text}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export default About;
