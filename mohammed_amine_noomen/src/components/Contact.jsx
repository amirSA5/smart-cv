import { Globe, Linkedin, Mail, MapPin, Phone, Send } from "lucide-react";
import { profile } from "../data/profileData.js";
import Reveal from "./Reveal.jsx";

function Contact() {
  const mailto = `mailto:${profile.contact.email}?subject=Contact%20portfolio%20Mohamed%20Amine%20Noomen`;

  return (
    <section id="contact" className="section contact-section section-dark">
      <div className="container contact-layout">
        <Reveal className="contact-copy">
          <span className="section-kicker">Contact</span>
          <h2>Disponible pour échanger sur un poste en achats industriels ou supply chain.</h2>
          <p>
            Pour une opportunité en plasturgie, approvisionnement, coordination fournisseurs ou
            optimisation achats, vous pouvez le contacter directement.
          </p>

          <div className="contact-cards">
            <a href={`tel:${profile.contact.phone.replaceAll(" ", "")}`}>
              <Phone size={20} />
              <span>{profile.contact.phone}</span>
            </a>
            <a href={`mailto:${profile.contact.email}`}>
              <Mail size={20} />
              <span>{profile.contact.email}</span>
            </a>
            <a href={profile.contact.linkedinUrl} target="_blank" rel="noreferrer">
              <Linkedin size={20} />
              <span>{profile.contact.linkedin}</span>
            </a>
            <a href={profile.contact.websiteUrl} target="_blank" rel="noreferrer">
              <Globe size={20} />
              <span>{profile.contact.website}</span>
            </a>
            <span>
              <MapPin size={20} />
              {profile.contact.location}
            </span>
          </div>
        </Reveal>

        <Reveal className="contact-form-wrap" delay={120}>
          <form className="contact-form" action={mailto} method="post" encType="text/plain">
            <label>
              Nom
              <input type="text" name="nom" placeholder="Votre nom" required />
            </label>
            <label>
              Email
              <input type="email" name="email" placeholder="votre.email@entreprise.fr" required />
            </label>
            <label>
              Message
              <textarea
                name="message"
                rows="5"
                placeholder="Votre message ou opportunité..."
                required
              />
            </label>
            <button className="btn btn-primary" type="submit">
              <Send size={18} />
              Envoyer
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

export default Contact;
