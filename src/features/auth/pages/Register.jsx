import Logo from "../../../shared/assets/Logo.svg";
import Input from "../components/Input";

const Register = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de login o registro
    console.log("Formulario enviado");
  };

  return (
    <div className="flex h-screen">
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
          
          <img src={Logo} alt="Logo" className="max-w-xs hidden-md m-12 md:hidden" />

          <h1 className="text-4xl font-bold mb-8 text-center font-ovo">Bienvenido</h1>

          {/* Input DNI */}
            <Input
              name = "dni"
              type = "dni"
              id = "dni"
              required = {true}
              label= "DNI"
            />

          {/* Input Password */}
            <Input
              name = "contraseña"
              type = "contraseña"
              id = "contraseña"
              required = {true}
              label= "Contraseña"
            />

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
            >
              Registro
            </button>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-gray font-bold rounded-lg transition-all duration-150 ease-in-out hover:bg-gray-dark hover:text-white cursor-pointer"
            >
              Entrar
            </button>
            <button
              type="button"
              className="w-full py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 cursor-pointer"
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
