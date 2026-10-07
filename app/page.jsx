import Header from '../components/Header';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import Workspace from '../components/Workspace';
import DataFlow from '../components/DataFlow';
import Limits from '../components/Limits';
import Faq from '../components/Faq';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main id="konten">
        <Hero />
        <HowItWorks />
        <Workspace />
        <DataFlow />
        <Limits />
        <Faq />
      </main>
      <Footer />
    </>
  );
}