import HeroSection from './hero/Hero.jsx';
import FeaturesSection from './features/features.jsx';
import HowItWorks from './how_it_works/HowItWorks.jsx';
import StudentBenefits from './student_benefits/StudentBenefits.jsx';
import Testimonials from './testimonials/Testimonials.jsx';
import CallToAction from './call_to_action/CallToAction.jsx';
import HomeFooter from '../../../components/layout/HomeFooter.jsx';
import './Home.css';

function Home() {

  return (
    <>    <div id="home">
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <StudentBenefits />
      <Testimonials />
      <CallToAction />
    </div>
    <HomeFooter />
    
    </>

  );
}

export default Home;