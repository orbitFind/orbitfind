import React, { useState } from "react";
import { Link } from "react-router-dom";
import { styles } from "../styles";
import { navLinks } from "../constants";
import { menu, close } from "../assets";

const Navbar: React.FC = () => {
  const [toggle, setToggle] = useState(false);

  return (
    <nav className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 z-20 bg-[#070F2B]/70 backdrop-blur-lg`}>
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => {
            window.scrollTo(0, 0);
          }}
        >
          <img
            src="/Orbitfind.png"
            alt="Orbitfind"
            className="h-12 md:h-16 lg:h-20 w-auto" // Increased sizes
          />
        </Link>
        <ul className="list-none hidden sm:flex flex-row gap-10">
          {navLinks.map((link) => (
            <div className="button" key={link.id}>
              <li 
                className="text-[#E5E7EB] font-medium cursor-pointer"
              >
                <a href={`#${link.id}`}>{link.title}</a>
              </li>
            </div>
          ))}
        </ul>
        <div className="sm:hidden flex flex-1 justify-end items-center">
          <img
            src={toggle ? close : menu}
            alt="menu"
            className="w-[28px] h-[28px] object-contain cursor-pointer"
            onClick={() => setToggle(!toggle)}
          />

          <div
            className={`absolute top-0 h-screen w-2/3 bg-gradient-to-tl from-[#1B1A55]/10 to-[#535C91]/20 backdrop-blur-lg z-10 p-6 md:hidden smooth-transition ${
              toggle ? "left-0" : "-left-full"
            }`}
          >
            <ul className="list-none flex justify-end items-start flex-col gap-4">
              {navLinks.map((link) => (
                <li
                  key={link.id}
                  className="text-[#919290] font-medium cursor-pointer text-[16px]"
                  onClick={() => {
                    setToggle(!toggle);
                  }}
                >
                  <a href={`#${link.id}`}>{link.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style>
        {`
          .button {
            position: relative;
            padding: 10px 20px;
            border-radius: 7px;
            font-size: 14px;
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 2px;
            background: transparent;
            color: #e5e7eb;
            overflow: hidden;
            box-shadow: 0 0 0 0 transparent;
            transition: all 0.2s ease-in;
          }
          
          .button:hover {
            background: #1b1a55;
            box-shadow: 0 0 15px 2px rgba(255, 255, 255, 0.8); /* White glow */
            transition: all 0.2s ease-out;
          }
          
          .button:hover::before {
            animation: sh02 0.5s 0s linear;
          }
          
          .button::before {
            content: '';
            display: block;
            width: 0px;
            height: 86%;
            position: absolute;
            top: 7%;
            left: 0%;
            opacity: 0;
            background: #ffffff;
            box-shadow: 0 0 30px 10px #ffffff; /* White glow */
            transform: skewX(-20deg);
            transition: all 0.2s ease-in;
          }
          
          @keyframes sh02 {
            from {
              opacity: 0;
              left: 0%;
            }
          
            50% {
              opacity: 1;
            }
          
            to {
              opacity: 0;
              left: 100%;
            }
          }
          
          .button:active {
            box-shadow: 0 0 0 0 transparent;
            transition: box-shadow 0.2s ease-in;
          }

          .smooth-transition {
            transition: all 0.3s ease-in-out;
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;
