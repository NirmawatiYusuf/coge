import Header from '../components/Header';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import Workspace from '../components/Workspace';
import ClaudeEvaluation from '../components/ClaudeEvaluation';
import Traction from '../components/Traction';
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
        <ClaudeEvaluation />
        <Traction />
        <DataFlow />
        <Limits />
        <Faq />
      </main>
      <Footer />
    </>
  );
}