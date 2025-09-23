const Input = ({
  type = "text",
  name,
  id,
  label,
  placeholder = " ",
  required = false,
  ...rest
}) => {
  return (
    <div className="relative z-0 w-full mb-6 group">
      <input
        type={type}
        name={name}
        id={id || name}
        required={required}
        placeholder={placeholder}
        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent 
                   border-0 border-b-2 border-gray-300 appearance-none 
                   focus:outline-none focus:ring-0 focus:border-green-dark peer"
        {...rest}
      />
      <label
        htmlFor={id || name}
        className="absolute text-sm text-gray-500 duration-300 transform 
                   -translate-y-6 scale-75 top-3 -z-10 origin-[0] 
                   peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                   peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
