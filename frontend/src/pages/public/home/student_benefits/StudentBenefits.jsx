import React, { useState, useEffect } from "react";
import { ArrowRight, BrainCircuit, Rocket, Target, Cpu, BriefcaseBusiness } from "lucide-react";
import "./StudentBenefits.css";

// Updated data including appropriate icons for a tech LMS
const benefits = [
  {
    title: "Practical tech skills",
    description: "Master languages and tools used by developers daily.",
    icon: <Cpu className="path-icon" />,
  },
  {
    title: "Industry knowledge",
    description: "Understand agile workflows and best practices.",
    icon: <BrainCircuit className="path-icon" />,
  },
  {
    title: "Hands-on projects",
    description: "Build real-world applications (not just tutorials).",
    icon: <Rocket className="path-icon" />,
  },
  {
    title: "Career-ready portfolio",
    description: "Present a professional showcase.",
    icon: <BriefcaseBusiness className="path-icon" />,
  },
  {
    title: "Certificates",
    description: "Validate your skills and boost credibility.",
    icon: <Target className="path-icon" />,
  },
];

const StudentBenefits = () => {
  const [activeStep, setActiveStep] = useState(0);
  const totalSteps = benefits.length;

  // Auto-advance logic (Interval)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev === totalSteps - 1 ? 0 : prev + 1));
    }, 4500); // Slower interval for better UX (reading time)
    
    // Clear interval when user interacts manually or component unmounts
    return () => clearInterval(interval);
  }, [totalSteps]);

  // Handle click on a specific step
  const handleStepClick = (index) => {
    setActiveStep(index);
  };

  return (
    <section className="student-pathway">
      <div className="pathway-container">
        <header className="pathway-header">
          <h2>Your Path to Success</h2>
          <p>Each course is designed to take you seamlessly from beginner to industry-ready.</p>
        </header>

        <div className="pathway-flow">
          {benefits.map((benefit, index) => {
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;
            const isLast = index === totalSteps - 1;

            return (
              <div key={index} className="pathway-node-container">
                {/* Node (The Card/Div) */}
                <div 
                  className={`pathway-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                  onClick={() => handleStepClick(index)}
                  tabIndex={0} // Makes the div focusable for accessibility
                  role="button" // Informs assistive tech this is clickable
                >
                  <div className="node-number">{index + 1}</div>
                  
                  <div className="node-icon-wrapper">
                    {benefit.icon}
                  </div>

                  <div className="node-content">
                    <h3>{benefit.title}</h3>
                    <p>{benefit.description}</p>
                  </div>
                </div>

                {/* Arrow Connection (except for the last node) */}
                {!isLast && (
                  <div className={`pathway-arrow ${isActive || isCompleted ? 'highlight' : ''}`}>
                    <ArrowRight />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StudentBenefits;