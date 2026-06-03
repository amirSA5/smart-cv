import { BarChart3, BadgeEuro, Layers3 } from "lucide-react";
import { achievements } from "../data/profileData.js";
import Reveal from "./Reveal.jsx";

const icons = [BadgeEuro, BarChart3, Layers3];

function Achievements() {
  return (
    <section id="realisations" className="section achievements-section">
      <div className="container section-heading centered">
        <Reveal>
          <span className="section-kicker">Réalisations</span>
          <h2>Des résultats concrets sur les coûts, les offres et le suivi achats.</h2>
          <p>
            Des contributions mesurables dans des environnements où chaque commande, relance et
            comparaison fournisseur compte.
          </p>
        </Reveal>
      </div>

      <div className="container achievement-grid">
        {achievements.map((achievement, index) => {
          const Icon = icons[index] ?? BarChart3;
          return (
            <Reveal key={achievement.value} className="achievement-card" delay={index * 100}>
              <div className="achievement-icon">
                <Icon size={26} />
              </div>
              <strong>{achievement.value}</strong>
              <span>{achievement.label}</span>
              <p>{achievement.text}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export default Achievements;
