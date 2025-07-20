import Navbar from "./Navbar";
import Hero from "./animation/Hero";
import About from "./about/About";
import Projects from "./Projects";
import Blog from "./Blog";
import Contact from "./Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Blog />
        <Contact />
      </main>
    </>
  );
}