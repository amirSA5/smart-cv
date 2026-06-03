import { Boxes, ChartNoAxesCombined, Handshake, ListChecks, Network, Settings } from "lucide-react";
import { skillGroups } from "../data/profileData.js";
import Reveal from "./Reveal.jsx";

const icons = [Settings, Boxes, Handshake, ChartNoAxesCombined, Network, ListChecks];

function Skills() {
  return (
    <section id="competences" className="section skills-section">
      <div className="container section-heading centered">
        <Reveal>
          <span className="section-kicker">Compétences</span>
          <h2>Compétences regroupées par enjeux métiers.</h2>
          <p>
            Une base solide pour accompagner les équipes achats, supply chain et production dans le
            suivi quotidien des besoins industriels.
          </p>
        </Reveal>
      </div>

      <div className="container skills-grid">
        {skillGroups.map((group, index) => {
          const Icon = icons[index] ?? Settings;
          return (
            <Reveal key={group.title} className="skill-card" delay={index * 70}>
              <div className="skill-heading">
                <Icon size={24} />
                <h3>{group.title}</h3>
              </div>
              <ul>
                {group.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export default Skills;
