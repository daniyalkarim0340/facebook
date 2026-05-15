import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../app/datastore";
import Heading from "../componets/heading";
import Paragraph from "../componets/paragraph";
import Input from "../componets/input";
import Button from "../componets/button";

const RegisterPage = () => {
  // Destructured formState: { errors } to track validation states
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();
  
  const { register: registerUser, loading, error: serverError } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log("FORM DATA SUBMITTED:", data);

    try {
      const res = await registerUser(data);
      console.log("API RESPONSE RECEIVED:", res);

      if (res?.success) {
        navigate("/verify-otp", {
          state: { email: data.email },
        });
      }
    } catch (err) {
      console.error("An unhandled error occurred during registration execution:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">

        {/* HEADER */}
        <div className="text-center mb-6">
          <Heading>Create Account</Heading>
          <Paragraph>Join us by filling the form below</Paragraph>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Name Field */}
          <div>
            <Input
              placeholder="Name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 px-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <Input
              placeholder="Email"
              type="email"
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 px-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <Input
              placeholder="Password"
              type="password"
              {...register("password", { 
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 px-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* SERVER SIDE ERROR DISPLAY */}
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm py-2 px-3 rounded-lg text-center font-medium">
              {serverError}
            </div>
          )}

          {/* BUTTON */}
          <Button type="submit" loading={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>

        </form>

        {/* LOGIN LINK */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;