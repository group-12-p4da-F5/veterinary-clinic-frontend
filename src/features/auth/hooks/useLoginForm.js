// features/auth/hooks/useLoginForm.js
import { useState } from "react";

const useLoginForm = () => {
  const [formData, setFormData] = useState({
    dni: "",
    password: ""
  });

  const [formError, setFormError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const { dni, password } = formData;
    if (!dni || !password) {
      setFormError("Por favor, rellene todos los campos");
      return false;
    }
    setFormError(null);
    return true;
  };

  return {
    formData,
    formError,
    handleInputChange,
    validate
  };
};

export default useLoginForm;