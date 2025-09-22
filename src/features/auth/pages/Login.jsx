import Logo from "../../../shared/assets/Logo.svg";

const Login = () => {
  return (
    <>
      <div className="flex h-screen">
        <div className="flex-1 bg-green-light hidden md:flex items-center justify-center">
          <img src={Logo} alt="Logo" className="max-w-xs" />
        </div>

        <div className="flex-1 flex items-center justify-center">
          
          <form className="w-full max-w-sm px-6">
          <h1 className="text-2xl font-bold mb-8 text-center">Bienvenido</h1>

          {/* Input DNI */}
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              name="dni"
              id="dni"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="dni"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              DNI
            </label>
          </div>

          {/* Input Password */}
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="password"
              name="password"
              id="password"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="password"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Contraseña
            </label>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Registro
            </button>
            <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Entrar
            </button>
            <button className=" py-2 px-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
              Volver atrás
            </button>
          </div>
        </form>

        </div>
      </div>
    </>
  )
}

export default Login;