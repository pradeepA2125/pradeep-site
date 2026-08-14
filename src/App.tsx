import Nav from "./components/Nav";
import Atmosphere from "./components/Atmosphere";
import Hero from "./components/Hero";
import Evidence from "./components/Evidence";
import Building from "./components/Building";
import Work from "./components/Work";
import Interstitial from "./components/Interstitial";
import Training from "./components/Training";
import Riding from "./components/Riding";
import Contact from "./components/Contact";

/**
 * Section order is load-bearing: evidence sits immediately after the hero so
 * the emotional opening is paid for straight away, and the life sections never
 * move above the work.
 */
export default function App() {
  return (
    <>
      {/* The night journey behind everything — see Atmosphere for the arc. */}
      <Atmosphere />
      <Nav />
      <main>
        <Hero />
        <Evidence />
        <Building />
        <Work />
        <Interstitial />
        <Training />
        <Riding />
        <Contact />
      </main>
    </>
  );
}
