import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../app/datastore";

import Heading from "../componets/heading";
import Paragraph from "../componets/paragraph";
import Input from "../componets/input";
import Button from "../componets/button";

const LoginForm = () => {
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await login(formData);

    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">

        {/* HEADING */}
        <div className="text-center mb-6">
          <Heading>Welcome Back</Heading>
          <Paragraph>Please login to continue</Paragraph>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <Input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
          />

          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          <Button type="submit" loading={loading}>
            Login
          </Button>

        </form>

        {/* REGISTER LINK */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginForm;