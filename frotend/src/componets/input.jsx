import React from "react";

const Input = React.forwardRef(({
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  maxLength,
  className = "",
  ...props // 👈 Captures any other properties passed by React Hook Form (like onBlur)
}, ref) => { // 👈 Accepts the ref from React Hook Form
  return (
    <input
      ref={ref} // 👈 CRITICAL: Passes the ref directly to the HTML input element
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props} //  Spreads remaining properties so tracking works properly
    />
  );
});

Input.displayName = "Input";

export default Input;