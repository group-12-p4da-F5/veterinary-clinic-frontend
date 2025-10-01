import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.svg";
import { useState, useEffect } from "react";
import imgHeader from "../assets/imgHeader.png";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/slices/userSlice";
import { logoutService } from "../../features/auth/services/authService";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await logoutService();
      dispatch(logout());
      navigate("/");
    } catch (err) {
      console.error(err.message);
    }
  };

  const menuItems = [
    { path: "/", label: "Inicio" },
    { path: "/nueva-cita", label: "Nueva Cita" },
  ];

  return (
    <header 
      className="relative font-cardo bg-cover bg-center h-64 md:h-96" 
      style={{ backgroundImage: `url(${imgHeader})` }}
    >
      {/* Overlay con gradiente mejorado */}
      <div className="bg-gradient-to-b from-black/50 via-black/40 to-black/60 absolute inset-0 z-10"></div>

      <div className="relative z-20 mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex flex-col h-full">
          {/* Barra de navegación superior */}
          <div className="flex items-center justify-between h-24 sm:h-28">
            {/* Logo */}
            <Link to="/" className="group">
              <span className="sr-only">Home</span>
              <img 
                src={Logo} 
                alt="Logo" 
                className="h-20 w-auto filter brightness-0 invert transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" 
              />
            </Link>

            {/* Menú Desktop */}
            <nav
              aria-label="Global"
              className="hidden md:flex items-center gap-8 lg:gap-12"
            >
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative text-white text-lg font-medium tracking-wide
                    transition-all duration-300 ease-in-out
                    hover:text-gray-200 hover:scale-105
                    after:content-[''] after:absolute after:bottom-[-4px] after:left-0 
                    after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300
                    hover:after:w-full
                    ${location.pathname === item.path ? 'after:w-full text-white' : ''}
                  `}
                >
                  {item.label}
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <Link
                    to="/admin"
                    className={`
                      relative text-white text-lg font-medium tracking-wide
                      transition-all duration-300 ease-in-out
                      hover:text-gray-200 hover:scale-105
                      after:content-[''] after:absolute after:bottom-[-4px] after:left-0 
                      after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300
                      hover:after:w-full
                      ${location.pathname === '/admin' ? 'after:w-full text-white' : ''}
                    `}
                  >
                    Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="relative text-white text-lg font-medium tracking-wide
                      transition-all duration-300 ease-in-out
                      hover:text-gray-200 hover:scale-105
                      after:content-[''] after:absolute after:bottom-[-4px] after:left-0 
                      after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300
                      hover:after:w-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className={`
                    relative text-white text-lg font-medium tracking-wide
                    transition-all duration-300 ease-in-out
                    hover:text-gray-200 hover:scale-105
                    after:content-[''] after:absolute after:bottom-[-4px] after:left-0 
                    after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300
                    hover:after:w-full
                    ${location.pathname === '/login' ? 'after:w-full text-white' : ''}
                  `}
                >
                  Login
                </Link>
              )}
            </nav>

            {/* Botón menú móvil */}
            <button
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Título central */}
          <div className="flex-1 flex items-center justify-center pb-8">
            <div className="text-center">
              <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide drop-shadow-2xl">
                Clínica Veterinaria
              </h1>
              <p className="text-white/90 text-lg md:text-xl mt-3 font-light tracking-wider">
                Bienestar animal, bienestar natural
              </p>
            </div>
          </div>
        </div>

        {/* Menú móvil mejorado */}
        {isOpen && (
          <nav
            aria-label="Mobile"
            className="md:hidden absolute top-24 left-0 right-0 bg-gradient-to-b from-black/95 to-black/90 backdrop-blur-md shadow-2xl border-t border-white/10"
          >
            <div className="flex flex-col py-6 px-4 gap-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    text-white text-lg font-medium py-4 px-6 rounded-lg
                    transition-all duration-300 ease-in-out
                    hover:bg-white/10 hover:pl-8
                    ${location.pathname === item.path ? 'bg-white/15 border-l-4 border-white' : ''}
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <Link
                    to="/admin"
                    className={`
                      text-white text-lg font-medium py-4 px-6 rounded-lg
                      transition-all duration-300 ease-in-out
                      hover:bg-white/10 hover:pl-8
                      ${location.pathname === '/admin' ? 'bg-white/15 border-l-4 border-white' : ''}
                    `}
                    onClick={() => setIsOpen(false)}
                  >
                    Perfil
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="text-white text-lg font-medium py-4 px-6 rounded-lg
                      transition-all duration-300 ease-in-out
                      hover:bg-white/10 hover:pl-8 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className={`
                    text-white text-lg font-medium py-4 px-6 rounded-lg
                    transition-all duration-300 ease-in-out
                    hover:bg-white/10 hover:pl-8
                    ${location.pathname === '/login' ? 'bg-white/15 border-l-4 border-white' : ''}
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;