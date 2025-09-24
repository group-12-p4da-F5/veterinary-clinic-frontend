import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../../shared/assets/Logo.svg";
import Input from "../components/Input";
import ReCAPTCHA from "react-google-recaptcha";
import { useEffect } from "react";
import { registerUser, clearError } from "../slices/userSlice"
import useRegisterForm from "../hooks/userRegisterForm.js";
import FormError from "../../../shared/components/FormError";
import.meta.env.VITE_RECAPTCHA_SITE_KEY;


const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { registerStatus, error } = useSelector((state) => state.user);

  const {
    formData,
    captchaToken,
    formError,
    setCaptchaToken,
    handleInputChange,
    validate,
  } = useRegisterForm();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (registerStatus === "succeeded") {
      alert("Registro exitoso.");
      navigate("/login");
    }
  }, [registerStatus, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // eslint-disable-next-line no-unused-vars
    const { verify_password, ...userData } = formData;
    const payload = { ...userData, captchaToken };

    try {
      await dispatch(registerUser(payload)).unwrap();
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
        <form onSubmit={handleSubmit} className="w-full max-w-sm px-6 flex flex-col m-4">
          <Link to="/" className="contents">
            <img src={Logo} alt="Logo" className="max-w-xs hidden-md mb-12 md:hidden" />
          </Link>

          <h1 className="text-4xl font-bold mb-8 text-center font-ovo">Bienvenido</h1>

          <FormError message={error || formError} />

          {/* Inputs */}
          <Input name="dni" label="DNI" value={formData.dni} onChange={handleInputChange} />
          <Input name="name" label="Nombre" value={formData.name} onChange={handleInputChange} />
          <Input name="password" type="password" label="Contraseña" value={formData.password} onChange={handleInputChange} />
          <Input name="verify_password" type="password" label="Verificar Contraseña" value={formData.verify_password} onChange={handleInputChange} />
          <Input name="email" type="email" label="Email" value={formData.email} onChange={handleInputChange} />
          <Input name="phone" type="tel" label="Teléfono" value={formData.phone} onChange={handleInputChange} />

          {/* Captcha */}
          <ReCAPTCHA
            sitekey={
              import.meta.env.VITE_RECAPTCHA_SITE_KEY === "production"
                ? "TU_SITE_KEY_REAL"
                : "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
            }
            onChange={setCaptchaToken}
            className="m-4"
          />

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button type="submit" disabled={registerStatus === "loading"} className="w-full py-2 px-4 bg-gray font-semibold rounded-lg hover:bg-gray-dark border-2 border-gray">
              {registerStatus === "loading" ? "Registrando..." : "Registro"}
            </button>
            <button type="button" onClick={() => navigate("/login")} className="w-full py-2 px-4 bg-transparent font-semibold rounded-lg hover:bg-green-light border-2">
              Volver atrás
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;