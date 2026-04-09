import React from "react";
import { Mail, CheckCircle, Video, Users, BarChart3 } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import "./TeachOnLms.css";

const TeachOnLms = () => {
  const steps = [
    {
      icon: <FaYoutube size={32} />,
      title: "Host on YouTube",
      desc: "Upload your lectures as a Public or Unlisted playlist on your YouTube channel.",
    },
    {
      icon: <Mail size={32} />,
      title: "Email the Link",
      desc: "Send your playlist URL and course details to admin@lms.com.",
    },
    {
      icon: <CheckCircle size={32} />,
      title: "Admin Review",
      desc: "Our team will review the quality and shortlist it for our platform within 48 hours.",
    },
  ];

  return (
    <div className="teach-container">
      {/* Hero Section */}
      <section className="teach-hero">
        <h1>Share Your Knowledge with the World</h1>
        <p>Join our elite group of instructors. You create the content; we provide the platform.</p>
        <div className="hero-buttons">
          <a href="mailto:admin@lms.com" className="btn-primary">Get Started Now</a>
          <button className="btn-outline">View Instructor Guidelines</button>
        </div>
      </section>

      {/* Process Flow Diagram */}
      <section className="process-section">
        <h2 className="section-title">How It Works</h2>
        <div className="process-grid">
          {steps.map((step, index) => (
            <div key={index} className="process-card">
              <div className="step-number">{index + 1}</div>
              <div className="icon-box">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
              {index < steps.length - 1 && <div className="flow-arrow">→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="benefits-section">
        <h2 className="section-title">Instructor Perks</h2>
        <div className="benefits-grid">
          <div className="benefit-item">
            <Video className="benefit-icon" />
            <div>
              <h4>YouTube Integration</h4>
              <p>Keep your views and subscribers while reaching our dedicated student base.</p>
            </div>
          </div>
          <div className="benefit-item">
            <Users className="benefit-icon" />
            <div>
              <h4>Engaged Community</h4>
              <p>Direct access to students eager for tech-stack mastery.</p>
            </div>
          </div>
          <div className="benefit-item">
            <BarChart3 className="benefit-icon" />
            <div>
              <h4>Analytics & Growth</h4>
              <p>We provide feedback on course performance to help you improve.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-banner">
        <div className="cta-content">
          <h2>Ready to launch your first course?</h2>
          <p>Send your playlist link to <strong>admin@lms.com</strong> or <strong>support@lms.com</strong></p>
          <a href="mailto:support@lms.com" className="btn-primary">
            <Mail size={18} style={{ marginRight: '8px' }} /> Contact Support
          </a>
        </div>
      </section>
    </div>
  );
};

export default TeachOnLms;