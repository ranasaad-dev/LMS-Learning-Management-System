import { Link } from "react-router-dom";
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-bottom">
        <p>© {currentYear} LMS Platform. All rights reserved.</p>
        <div className="social-links">
          {/* Use standard <a> tags for external links */}
          <a href="https://www.facebook.com/profile.php?id=61573025721189" target="_blank" rel="noreferrer">Facebook</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://github.com/ranasaad-dev" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;