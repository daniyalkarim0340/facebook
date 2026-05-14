import { useForm } from "react-hook-form";
import useAuthStore from "./app/datastore";

function App() {
  const { register, handleSubmit } = useForm();
  const { register: registerUser, loading, error, user } = useAuthStore();

  const onSubmit = (data) => {
    registerUser(data); // send to zustand store
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Register Form</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        
        {/* NAME */}
        <input
          placeholder="Name"
          {...register("name", { required: true })}
        />
        <br /><br />

        {/* EMAIL */}
        <input
          placeholder="Email"
          type="email"
          {...register("email", { required: true })}
        />
        <br /><br />

        {/* PASSWORD */}
        <input
          placeholder="Password"
          type="password"
          {...register("password", { required: true })}
        />
        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {/* ERROR */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* SUCCESS */}
      {user && <p style={{ color: "green" }}>User Registered ✔</p>}
    </div>
  );
}

export default App;