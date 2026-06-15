const Heading = ({ children, className = "" }) => {
  return (
    <h2 className={`text-2xl font-bold text-gray-800 ${className}`}>
      {children}
    </h2>
  );
};

export default Heading;