import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import './Faqs.css';

const faqData = [
  {
    category: "General",
    questions: [
      {
        id: 1,
        question: "What is this LMS platform?",
        answer: "Our LMS (Learning Management System) is a comprehensive MERN-based platform designed for seamless online education, allowing students to learn and instructors to manage courses efficiently."
      },
      {
        id: 2,
        question: "Is there a mobile app available?",
        answer: "The platform is fully responsive, meaning you can access all features through your mobile browser with a native-like experience."
      }
    ]
  },
  {
    category: "Students",
    questions: [
      {
        id: 3,
        question: "How do I enroll in a course?",
        answer: "Simply browse the course catalog, click on a course you like, and hit the 'Enroll Now' button. If it's a premium course, you'll be redirected to the secure payment gateway."
      },
      {
        id: 4,
        question: "Can I get a certificate after completion?",
        answer: "Yes! Once you complete all modules and pass the final assessment, a digital certificate will be automatically generated in your dashboard."
      }
    ]
  },
  {
    category: "Instructors",
    questions: [
      {
        id: 5,
        question: "How can I upload course materials?",
        answer: "Instructors can use the 'Instructor Dashboard' to create new courses, upload video lectures (MP4), PDFs, and create interactive quizzes."
      }
    ]
  }
];

const Faqs = () => {
  const [activeId, setActiveId] = useState(null);

  const toggleAccordion = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-header">
          <HelpCircle className="faq-icon" />
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about our LMS platform.</p>
        </div>

        <div className="faq-list">
          {faqData.map((section) => (
            <div key={section.category} className="faq-category-group">
              <h3 className="category-title">{section.category}</h3>
              {section.questions.map((item) => (
                <div 
                  key={item.id} 
                  className={`faq-item ${activeId === item.id ? 'active' : ''}`}
                  onClick={() => toggleAccordion(item.id)}
                >
                  <div className="faq-question">
                    <span>{item.question}</span>
                    {activeId === item.id ? <ChevronUp /> : <ChevronDown />}
                  </div>
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faqs;