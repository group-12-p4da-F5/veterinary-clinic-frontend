import { useDispatch, useSelector } from "react-redux";
import Logo from "../../../shared/assets/Logo.svg";
import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { registerUser, clearError } from "../slices/userSlice"
import ReCAPTCHA from "react-google-recaptcha";
import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {registerStatus, error} = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    dni: "",
    name: "",
    password: "",
    verify_password: "",
    email: "",
    phone: ""
  })

  const [captchaToken, setCaptchaToken] = useState(null);

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch]);

  useEffect(() => {
    if (registerStatus === "succeeded") {
      alert("Registro exitoso.");
      navigate("/login");
    }
  }, [registerStatus, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData( prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { dni, name, password, verify_password, email, phone } = formData;

    if (!dni || !name || !password || !verify_password || !email || !phone ) {
      alert("Complete todos los campos");
      return false;
    }

    if (password !== verify_password) {
      alert("Las contraseñas no coinciden");
      return false;
    }

    if (password.length < 6 ) {
      alert('Contraseña muy corta');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Por favor, inrese un email válido");
      return false;
    }

    const dniRegex = /^\d{8}$/;
    if (!dniRegex.test(dni)) {
      alert("El DNI debe tener 8 dígitos");
      return false;
    }

    if (!captchaToken) {
      alert("Rellene el CAPTCHA");
      return false;
    }

    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const { verify_password, ...userData} = formData;

    const payload = { ...userData, captchaToken }

    console.log("FormData con CAPTCHA: ", payload);

    console.log("FormData: ", userData);

    try {
      const result = await dispatch(registerUser(userData)).unwrap();
      console.log("Success: ", result);
    } catch (err) {
      console.log('Error: ', err);
      
    }
  };

  return (
    <div className="flex min-h-screen">
      {/*  */}
      <Link to="/" className="contents">
        <div className="flex-1 bg-green-light hidden md:flex items-center justify-center">
          <img src={Logo} alt="Logo" className="max-w-xs" />
        </div>
      </Link>

      {/*  */}
      <div className="flex-1 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm px-6 flex flex-col m-4"
        >
          
          <Link to="/"  className="contents">
            <img src={Logo} alt="Logo" className=" max-w-xs hidden-md mb-12 md:hidden" />
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

          {/* Input Name  nombre*/}
            <Input
              name = "name"
              type = "name"
              id = "name"
              required = {true}
              label= "Nombre"
              value = {formData.name}
              onChange = {handleInputChange}
            />

          {/* Input Password */}
            <Input
              name = "password"
              type = "password"
              id = "password"
              required = {true}
              label= "Contraseña"
              value = {formData.password}
              onChange = {handleInputChange}
            />

          {/* Input Password again */}
            <Input
              name = "verify_password"
              type = "password"
              id = "verify_password"
              required = {true}
              label= "Verificar Contraseña"
              value = {formData.verify_password}
              onChange = {handleInputChange}
            />

          {/* Input Email */}
            <Input
              name = "email"
              type = "email"
              id = "email"
              required = {true}
              label= "Email"
              value = {formData.email}
              onChange = {handleInputChange}
            />

          {/* Input Phone */}
            <Input
              name = "phone"
              type = "tel"
              id = "phone"
              required = {true}
              label= "Teléfono"
              value = {formData.phone}
              onChange = {handleInputChange}
            />

            {/* CAPTCHA */}

            <div>
              <ReCAPTCHA
              sitekey={
                import.meta.env.VITE_RECAPTCHA_SITE_KEY === "production"
                ? "TU_SITE_KEY_REAL"
                : "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              }
              onChange={(token) => setCaptchaToken(token)}
              className="m-4"
              />
            </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={registerStatus === "loading"}
              className="w-full py-2 px-4 bg-gray font-semibold rounded-lg transition-all duration-150 ease-in-out hover:bg-gray-dark border-2 border-gray hover:border-gray-dark hover:text-white cursor-pointer"
            >
              {registerStatus === 'loading'? "Registrando..." : "Registro"}
            </button>

            <button
              type="button"
              className="w-full py-2 px-4 bg-transparent font-semibold rounded-lg hover:bg-green-light border-2 border-transparent cursor-pointer"
              onClick={() => navigate("/login")}
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
