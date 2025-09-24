export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const isValidDni = (dni) => /^\d{8}[A-Za-z]$/.test(dni);

export const validateRegisterForm = (data, captchaToken) => {
  const { dni, name, password, verify_password, email, phone } = data;

  if (!dni || !name || !password || !verify_password || !email || !phone)
    return "Complete todos los campos";

  if (password !== verify_password)
    return "Las contraseñas no coinciden";

  if (password.length < 6)
    return "Contraseña muy corta";

  if (!isValidEmail(email))
    return "Ingrese un email válido";

  if (!isValidDni(dni))
    return "El DNI debe tener 8 dígitos y una letra";

  if (!captchaToken)
    return "Rellene el CAPTCHA";

  return null;
};
