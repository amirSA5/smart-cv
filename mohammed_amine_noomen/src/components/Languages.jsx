import { Dumbbell, Languages as LanguagesIcon, Trophy } from "lucide-react";
import { interests, languages } from "../data/profileData.js";
import Reveal from "./Reveal.jsx";

function Languages() {
  return (
    <section className="section compact-section section-light">
      <div className="container language-interest-grid">
        <Reveal className="info-panel">
          <span className="section-kicker">Langues</span>
          <h2>Communication professionnelle multilingue.</h2>
          <div className="language-list">
            {languages.map((language) => (
              <div key={language.name}>
                <LanguagesIcon size={20} />
                <span>{language.name}</span>
                <strong>{language.level}</strong>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="info-panel accent-panel" delay={100}>
          <span className="section-kicker">Centres d'intérêt</span>
          <h2>Discipline, régularité et esprit d'équipe.</h2>
          <div className="interest-list">
            {interests.map((interest, index) => {
              const Icon = index === 0 ? Dumbbell : Trophy;
              return (
                <span key={interest}>
                  <Icon size={19} />
                  {interest}
                </span>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Languages;
