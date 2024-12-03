import React from 'react';
import './ContactUs.css';

function ContactUs({ showModal, setShowModal }) {
  if (!showModal) return null;

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div className="ContactUs-modal-overlay">
      <div className="ContactUs-modal">
        <div className="ContactUs-header">
          <h2 className="Headertitle">Contact Us</h2>
          <p className="intro-text">
            We're here to help and answer any questions you might have. We look forward to hearing from you.
          </p>
          <button onClick={handleClose} className="close-button">ｘ</button>
        </div>

        <div className="team-members">
          {[
            {
              name: "Baguio, Earl Lawrence",
              role: "Leader/Main Frontend Developer",
              phone: "09123456789",
              fb: "https://www.facebook.com/earllawrence.baguio/",
              ig: "https://www.instagram.com/itaintearl/",
              email: "mailto:earllawrence.baguio@cit.edu",
            },
            {
              name: "Adlawan, Dan Vincent",
              role: "Co-Frontend Developer",
              phone: "09566022683",
              fb: "https://www.facebook.com/share/1BAdYiDqjT/",
              ig: "https://www.instagram.com/ivanong.69.96/profilecard/?igsh=cDRzazU4ZGk2bHJn",
              email: "mailto:danvincent.adlawan@cit.edu",
            },
            {
              name: "Adora, Nicko Louis R.",
              role: "Co-Frontend Developer",
              phone: "09456473749",
              fb: "https://www.facebook.com/nickolouisadora",
              ig: "https://www.instagram.com/gameldon_360/?hl=en",
              email: "mailto:nickolouis.adora@cit.edu",
            },
            {
              name: "Butar, Daryl",
              role: "Main Backend Developer",
              phone: "0953 779 0501",
              fb: "https://www.facebook.com/rylee.jalil.dujali",
              ig: "https://www.instagram.com/ryleedujali",
              email: "mailto:daryl.butar@cit.edu",
            },
            {
              name: "Arbien M. Armenion",
              role: "Co-Backend Developer",
              phone: "09942818478",
              fb: "https://www.facebook.com/arbien.armenion.77?mibextid=ZbWKwL",
              ig: "https://www.instagram.com/etherealbien/",
              email: "mailto:arbien.armenion@cit.edu",
            },
            {
              name: "Calbario, Jeremiah",
              role: "Co-Backend Developer",
              phone: "09924363370",
              fb: "https://www.facebook.com/Calbario1",
              ig: "https://www.instagram.com/jayy_jye/",
              email: "mailto:jeremiah.calbario@cit.edu",
            },
            {
              name: "Montesclaros, Daniel M.",
              role: "Tester",
              phone: "09229554202",
              fb: "https://www.facebook.com/montesclaros.daniel.2024",
              ig: "https://www.instagram.com/danieldaniekl",
              email: "mailto:daniel.montesclaros@cit.edu",
            },
          ].map((member, index) => (
            <div className="member" key={index}>
              <h3>{index + 1}. {member.name}</h3>
              <p><strong>Role:</strong> {member.role}</p>
              <p><strong>Phone:</strong> {member.phone}</p>
              <div className="social-icons">
                {member.email && (
                  <a href={member.email}>
                    <img
                      src="Cebu_Institute_of_Technology_University_logo.png"
                      alt="Email"
                      className="social-icon email-icon"
                    />
                  </a>
                )}
                <a href={member.fb} target="_blank" rel="noopener noreferrer">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Facebook_icon.svg/1200px-Facebook_icon.svg.png" alt="Facebook" className="social-icon" />
                </a>
                <a href={member.ig} target="_blank" rel="noopener noreferrer">
                  <img src="https://dreamfoundry.org/wp-content/uploads/2018/12/instagram-logo-png-transparent-background.png" alt="Instagram" className="social-icon" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
