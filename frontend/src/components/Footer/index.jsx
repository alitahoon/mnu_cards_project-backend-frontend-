import React from "react";
import {
  FaLinkedin,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
const Footer = () => {

  //   {
  //     title: "Facebook",
  //     href: "https://www.facebook.com/3bdulla7elseginy",
  //     icon: <FaFacebook className="mr-2" />,
  //   },
  //   {
  //     title: "LinkedIn",
  //     href: "https://www.linkedin.com/in/abdullah-elseginy-7bbbb21ba/",
  //     icon: <FaLinkedin className="mr-2" />,
  //   },
  //   {
  //     title: "GitHub",
  //     href: "https://github.com/Abdullah-Elseginy",
  //     icon: <FaGithub className="mr-2" />,
  //   },
  //   {
  //     title: "Instagram",
  //     href:
  //       "https://www.instagram.com/3bdulla7.elseginy/profilecard/?igsh=NnYwd3dpdjZrOWN3",
  //     icon: <FaInstagram className="mr-2" />,
  //   },
  //   {
  //     title: "WhatsApp",
  //     href: "https://wa.link/upgmhp",
  //     icon: <FaWhatsapp className="mr-2" />,
  //   },
  // ];
  return (
    <footer className="bg-gradient-to-r from-mint-green via-mint-blue to-blue text-white py-4">
      <div className="container mx-auto text-center">
        <p>&copy; 2025 Menofia National University. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
