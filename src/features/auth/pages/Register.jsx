import Logo from "../../../shared/assets/Logo.svg";
import Input from "../components/Input";
import { Link } from "react-router-dom";

const Register = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de login o registro
    console.log("Formulario enviado");
  };

  return (
    <div className="flex min-h-screen">
      {/*  */}
      <div className="flex-1 bg-green-light hidden md:flex items-center justify-center">
        <img src={Logo} alt="Logo" className="max-w-xs" />
      </div>

      {/*  */}
      <div className="flex-1 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm px-6 flex flex-col"
        >
          
          <Link to="/"  className="contents">
            <img src={Logo} alt="Logo" className=" max-w-xs hidden-md mb-12 md:hidden" />
          </Link>

          <h1 className="text-4xl font-bold mb-8 text-center font-ovo">Bienvenido</h1>

          {/* Input DNI */}
            <Input
              name = "dni"
              type = "dni"
              id = "dni"
              required = {true}
              label= "DNI"
            />

          {/* Input Name */}
            <Input
              name = "nombre"
              type = "nombre"
              id = "nombre"
              required = {true}
              label= "Nombre"
            />

          {/* Input Password */}
            <Input
              name = "password"
              type = "password"
              id = "password"
              required = {true}
              label= "Contraseña"
            />

          {/* Input Password again */}
            <Input
              name = "verify_password"
              type = "password"
              id = "verify_password"
              required = {true}
              label= "Verificar Contraseña"
            />

          {/* Input Email */}
            <Input
              name = "email"
              type = "email"
              id = "email"
              required = {true}
              label= "Email"
            />

          {/* Input Phone */}
            <Input
              name = "phone"
              type = "phone"
              id = "phone"
              required = {true}
              label= "Teléfono"
            />

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-gray font-semibold rounded-lg transition-all duration-150 ease-in-out hover:bg-gray-dark border-2 border-gray hover:border-gray-dark hover:text-white cursor-pointer"
            >
              Registro
            </button>

            <button
              type="button"
              className="w-full py-2 px-4 bg-transparent font-semibold rounded-lg hover:bg-green-light border-2 border-transparent cursor-pointer"
              onClick={() => window.history.back()}
            >
              Volver atrás
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
