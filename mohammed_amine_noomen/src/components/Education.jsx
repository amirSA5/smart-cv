import { GraduationCap, MapPin } from "lucide-react";
import { education } from "../data/profileData.js";
import Reveal from "./Reveal.jsx";

function Education() {
  return (
    <section id="formation" className="section section-light">
      <div className="container two-column education-layout">
        <Reveal>
          <span className="section-kicker">Formation</span>
          <h2>Formation en management commercial et sciences de gestion.</h2>
          <p className="section-note">
            Un socle business qui renforce la compréhension des enjeux achats, négociation,
            relation fournisseur et pilotage opérationnel.
          </p>
        </Reveal>

        <div className="education-list">
          {education.map((item, index) => (
            <Reveal key={item.degree} className="education-card" delay={index * 100}>
              <GraduationCap size={24} />
              <div>
                <span>{item.period}</span>
                <h3>{item.degree}</h3>
                <p>{item.school}</p>
                <small>
                  <MapPin size={14} />
                  {item.location}
                </small>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Education;
