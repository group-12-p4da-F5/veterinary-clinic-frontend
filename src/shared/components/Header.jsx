import { Link } from "react-router-dom";
import Logo from "../assets/Logo.svg";
import { useState } from "react";
import imgHeader from "../assets/imgHeader.png"

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header 
      className="relative font-cardo bg-cover bg-center h-56 md:h-80" 
      style={{ backgroundImage: `url(${imgHeader})` }}
    >
      <div className=" bg-opacity-40 absolute inset-0 z-10"></div>

      <div className="relative z-20 mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-20 lg:h-full lg:pt-16">


          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <span className="sr-only">Home</span>
              
              <img
                src={Logo}
                alt="Logo"
                className="h-16 w-auto invert brightness-0 transition-all ease-in-out duration-150 hover:invert"
              />
            </Link>
          </div>

          {/* Menu */}
          <div className="hidden md:flex flex-1 justify-center">
            <nav
              aria-label="Global"
              className="flex items-center gap-6 text-sm"
            >
              <Link
                to="/"
                className="transition-all duration-150 ease-in-out hover:text-gray-dark hover:text-lg"
              >
                Inicio
              </Link>
              <Link
                to="/"
                className="transition-all duration-150 ease-in-out hover:text-gray-dark hover:text-lg"
              >
                Sobre la clínica
              </Link>
              <Link
                to="/"
                className="transition-all duration-150 ease-in-out hover:text-gray-dark hover:text-lg"
              >
                Servicio
              </Link>
              <Link
                to="/login"
                className="transition-all duration-150 ease-in-out hover:text-gray-dark hover:text-lg"
              >
                Login
              </Link>
            </nav>
          </div>

          {/* Hamburguer Menu */}
          <div className="flex  md:hidden">

            <button
              className="text-gray-dark"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <i className="fa-solid fa-x text-2xl transition-all duration-150 ease-in-out hover:text-3xl cursor-pointer"></i>
              ) : (
                <i className="fa-solid fa-bars text-2xl transition-all duration-150 ease-in-out hover:text-3xl cursor-pointer"></i>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <nav
            aria-label="Mobile"
            className="flex flex-col items-center gap-4 pb-4 md:hidden text-sm"
          >
            <Link
              to="/"
              className="transition-all duration-150 ease-in-out hover:text-gray-dark hover:text-lg"
              onClick={() => setIsOpen(false)}
            >
              Inicio
            </Link>
            <Link
              to="/"
              className="transition-all duration-150 ease-in-out hover:text-gray-dark hover:text-lg"
              onClick={() => setIsOpen(false)}
            >
              Sobre la clínica
            </Link>
            <Link
              to="/"
              className="transition-all duration-150 ease-in-out hover:text-gray-dark hover:text-lg"
              onClick={() => setIsOpen(false)}
            >
              Servicio
            </Link>
            <Link
              to="/login"
              className="transition-all duration-150 ease-in-out hover:text-gray-dark hover:text-lg"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
