import { useState } from "react";
import { validateRegisterForm } from "../utils/validation";

const useRegisterForm = () => {
  const [formData, setFormData] = useState({
    dni: "",
    name: "",
    password: "",
    verify_password: "",
    email: "",
    phone: ""
  });

  const [captchaToken, setCaptchaToken] = useState(null);
  const [formError, setFormError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const error = validateRegisterForm(formData, captchaToken);
    setFormError(error);
    return !error;
  };

  return {
    formData,
    captchaToken,
    formError,
    setCaptchaToken,
    handleInputChange,
    validate,
  };
};

export default useRegisterForm;