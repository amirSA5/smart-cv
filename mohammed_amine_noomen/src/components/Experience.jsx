import { BriefcaseBusiness, MapPin } from "lucide-react";
import { experiences } from "../data/profileData.js";
import Reveal from "./Reveal.jsx";

function Experience() {
  return (
    <section id="experience" className="section section-light">
      <div className="container section-heading">
        <Reveal>
          <span className="section-kicker">Expérience</span>
          <h2>Un parcours entre achats industriels, opérations et développement commercial.</h2>
        </Reveal>
      </div>

      <div className="container timeline">
        {experiences.map((experience, index) => (
          <Reveal key={`${experience.company}-${experience.period}`} className="timeline-item" delay={index * 80}>
            <div className="timeline-marker" aria-hidden="true">
              <BriefcaseBusiness size={18} />
            </div>
            <article className="experience-card">
              <div className="experience-top">
                <div>
                  <span className="period">{experience.period}</span>
                  <h3>{experience.role}</h3>
                  <p className="company">
                    {experience.company}
                    <span>
                      <MapPin size={15} />
                      {experience.location}
                    </span>
                  </p>
                </div>
              </div>
              <p className="experience-description">{experience.description}</p>
              <ul>
                {experience.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default Experience;
