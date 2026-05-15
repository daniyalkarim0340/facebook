const Button = ({
  children,
  onClick,
  type = "button",
  loading = false,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full py-3 rounded-lg font-semibold transition duration-200 
        ${disabled || loading
          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 text-white"
        } ${className}`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;