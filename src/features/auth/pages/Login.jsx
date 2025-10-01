import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Logo from "../../../shared/assets/Logo.svg";
import Input from "../components/Input";
import { loginUser, clearError } from "../slices/userSlice"
import FormError from "../../../shared/components/FormError";
import useLoginForm from "../hooks/useLoginForm";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loginStatus, error, isAuthenticated } = useSelector((state) => state.user);

  const { formData, formError, handleInputChange, validate } = useLoginForm();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch])

  useEffect(() => {
    //TODO: change navigate to the new rute
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const resultAction = await dispatch(loginUser(formData)).unwrap();
      console.log("Dispatch login result:", resultAction);
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Link to="/" className="contents">
        <div className="flex-1 bg-green-light hidden md:flex items-center justify-center">
          <img src={Logo} alt="Logo" className="max-w-xs" />
        </div>
      </Link>

      <div className="flex-1 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-sm px-6 flex flex-col">
          <Link to="/" className="contents">
            <img src={Logo} alt="Logo" className="max-w-xs hidden-md m-12 md:hidden" />
          </Link>

          <h1 className="text-4xl font-bold mb-8 text-center font-ovo">Bienvenido</h1>

          <FormError message={error || formError} />

          <Input name="dni" label="DNI" value={formData.dni} onChange={handleInputChange} />
          <Input name="password" type="password" label="Contraseña" value={formData.password} onChange={handleInputChange} />

          <div className="flex flex-col gap-3">
            <button type="submit" disabled={loginStatus === "loading"} className="w-full py-2 px-4 bg-gray font-semibold rounded-lg hover:bg-gray-dark border-2 border-gray">
              {loginStatus === "loading" ? "Iniciando sesión..." : "Entrar"}
            </button>

            <Link to='/register'>
              <button type="button" className="w-full py-2 px-4 bg-transparent font-semibold rounded-lg hover:bg-green-light border-2 border-transparent">
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
