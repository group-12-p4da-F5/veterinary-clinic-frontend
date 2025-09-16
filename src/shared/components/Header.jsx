import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.svg';

// Referencia: https://www.hyperui.dev/components/marketing/headers

const Header = () => { 

  return(
      <header className="bg-green-light font-cardo">

        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-30 items-center justify-between">
            
            <div className="md:flex md:items-center md:gap-12">
              <Link className="block text-teal-600" to="/">
                <span className="sr-only">Home</span>
                <img src={Logo} alt="Logo" className='h-15 auto' />
              </Link>
            </div>

            {/* Menú */}
            <div class="hidden md:block pt-10">
              <nav aria-label="Global" className="flex items-center gap-6 text-sm">
                  <Link to="/"> Inicio </Link>
                  <Link to="/"> Sobre la clínica </Link>
                  <Link to="/"> Servicio </Link>
              </nav>
            </div>

            {/* Botones + menú mobile */}
            <div class="flex items-center gap-4">
              <div class="sm:flex sm:gap-4">
                <a
                  class="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm"
                  href="#"
                >
                  Login
                </a>

                <div class="hidden sm:flex">
                  <a
                    class="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600"
                    href="#"
                  >
                    Register
                  </a>
                </div>
              </div>

              <div class="block md:hidden">
                <button
                  class="rounded-sm bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="size-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

          </div>
        </div>

      </header>
  )
}

export default Header;