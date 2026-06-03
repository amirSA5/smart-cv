import { Brain, Gauge, Handshake, ShieldCheck, Target, Users, Zap } from "lucide-react";
import { strengths } from "../data/profileData.js";
import Reveal from "./Reveal.jsx";

const icons = [Target, ShieldCheck, Handshake, Brain, Zap, Gauge, Users];

function Strengths() {
  return (
    <section className="section strengths-section">
      <div className="container section-heading centered">
        <Reveal>
          <span className="section-kicker">Atouts</span>
          <h2>Des qualités alignées avec les exigences des achats industriels.</h2>
        </Reveal>
      </div>

      <div className="container strengths-grid">
        {strengths.map((strength, index) => {
          const Icon = icons[index] ?? ShieldCheck;
          return (
            <Reveal key={strength} className="strength-card" delay={index * 60}>
              <Icon size={23} />
              <span>{strength}</span>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export default Strengths;
