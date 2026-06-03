import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Achievements from "./components/Achievements.jsx";
import Experience from "./components/Experience.jsx";
import Skills from "./components/Skills.jsx";
import Education from "./components/Education.jsx";
import Strengths from "./components/Strengths.jsx";
import Languages from "./components/Languages.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Achievements />
        <Experience />
        <Skills />
        <Education />
        <Strengths />
        <Languages />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
