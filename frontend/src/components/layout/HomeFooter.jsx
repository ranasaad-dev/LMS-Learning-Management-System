import React from "react";
import { Link } from "react-router-dom";
import './HomeFooter.css';
function HomeFooter () {
    return(
        <div className="footer-container">
{/* Section 1: Brand/About */}
<div className="footer-section">
  <h3 className="footer-logo">LMS Platform</h3>
  <p>
    Empowering learners worldwide with accessible, 
    high-quality education and expert-led courses.
  </p>
</div>

{/* Section 2: Platform Links */}
<div className="footer-section">
  <h4>Platform</h4>
  <ul>
    <li><Link to="/courses">Browse Courses</Link></li>
    <li><Link to="/instructors">Our Instructors</Link></li>
    <li><Link to="/pricing">Pricing Plans</Link></li>
    <li><Link to="/for-business">LMS for Business</Link></li>
  </ul>
</div>

{/* Section 3: Support & Resources */}
<div className="footer-section">
  <h4>Support</h4>
  <ul>
    <li><Link to="/help">Help Center</Link></li>
    <li><Link to="/become-instructor">Teach on LMS</Link></li>
    <li><Link to="/contact">Contact Us</Link></li>
    <li><Link to="/faq">FAQs</Link></li>
  </ul>
</div>

{/* Section 4: Legal & Social */}
<div className="footer-section">
  <h4>Legal</h4>
  <ul>
    <li><Link to="/privacy">Privacy Policy</Link></li>
    <li><Link to="/terms">Terms of Service</Link></li>
    <li><Link to="/cookie-policy">Cookie Settings</Link></li>
  </ul>
</div>
</div>

    )
}

export default HomeFooter;