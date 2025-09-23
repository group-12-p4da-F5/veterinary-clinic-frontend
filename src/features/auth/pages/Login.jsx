import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../../shared/assets/Logo.svg";
import Input from "../components/Input";
import { loginUser, clearError } from "../slices/userSlice"

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loginStatus, error, isAuthenticated } = useSelector((state) => state.user);

  const [formData, setFromData] = useState({
    dni:"",
    password:""
  })

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch])

  useEffect(() => {
    //TODO: change navigate to the new rute
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFromData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!formData.dni || !formData.password) {
      alert('Por favor, rellene todos los campos');
      return;
    }

    console.log('formData: ', formData);
    
    try {
      const result = await dispatch(loginUser(formData)).unwrap();
      console.log('Login success: ', result); 
    } catch(err) {
      console.log('Error: ', err);
      
    }
  };

  return (
    <div className="flex min-h-screen">
      {/*  */}
      <Link to="/"  className="contents">
        <div className="flex-1 bg-green-light hidden md:flex items-center justify-center">
          <img src={Logo} alt="Logo" className="max-w-xs" />
        </div>
      </Link>

      {/*  */}
      <div className="flex-1 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm px-6 flex flex-col"
        >
          
          <Link to="/"  className="contents">
            <img src={Logo} alt="Logo" className="max-w-xs hidden-md m-12 md:hidden" />
          </Link>

          <h1 className="text-4xl font-bold mb-8 text-center font-ovo">Bienvenido</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Input DNI */}
            <Input
              name = "dni"
              type = "dni"
              id = "dni"
              required = {true}
              label = "DNI"
              value = {formData.dni}
              onChange = {handleInputChange}
            />

          {/* Input Password */}
            <Input
              name = "password"
              type = "password"
              id = "password"
              required = {true}
              label = "Contraseña"
              value = {formData.password}
              onChange = {handleInputChange} 
            />

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loginStatus === "loading"}
              className="w-full py-2 px-4 bg-gray font-semibold rounded-lg transition-all duration-150 ease-in-out hover:bg-gray-dark border-2 border-gray hover:border-gray-dark hover:text-white cursor-pointer"
            >
              {loginStatus === "loading" ? "Iniciando sesión..." : "Entrar"}
            </button>

            <Link to='/register'>
              <button
                type="button"
                className="w-full py-2 px-4 bg-transparent font-semibold rounded-lg hover:bg-green-light border-2 border-transparent cursor-pointer"
              >
                Registro
              </button>
            </Link>

          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
