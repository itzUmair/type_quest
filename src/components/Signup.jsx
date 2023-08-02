import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase.config.js";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { useState } from "react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError("");
    if (e.target.name === "email") {
      setEmail(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    } else if (e.target.name === "confirmPassword") {
      setConfirmPassword(e.target.value);
    } else {
      return;
    }
  };

  const validateForm = () => {
    if (!email.length) {
      setError("Email is required");
      return false;
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setError("Invalid email address");
      return false;
    } else if (!password.length) {
      setError("Password is required");
      return false;
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      setError(
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      );
      return false;
    } else if (!confirmPassword.length) {
      setError("Please confirm your password");
      return false;
    } else if (confirmPassword !== password) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const authenticate = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (validateForm()) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccess("Account created successfully!");
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          setError("Email already in use.");
        } else {
          setError("Something went wrong. Please try again.");
        }
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center">
      <form className="flex flex-col gap-4 items-center justify-center py-8 w-1/4">
        <img src={Logo} alt="" className="w-10 mb-16" />
        <h2 className="font-semibold text-clr-400 text-3xl">Sign Up</h2>
        <input
          type="email"
          placeholder="Email"
          onChange={handleChange}
          name="email"
          value={email}
          required
          className="px-4 py-2 w-full rounded text-clr-600 border-none outline-clr-400 outline-1"
        />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          onChange={handleChange}
          name="password"
          value={password}
          required
          className="px-4 py-2 w-full rounded text-clr-600 border-none outline-clr-400 outline-1"
        />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          onChange={handleChange}
          name="confirmPassword"
          value={confirmPassword}
          required
          className="px-4 py-2 w-full rounded text-clr-600 border-none outline-clr-400 outline-1"
        />
        <div
          className="text-clr-400 text-sm self-end cursor-pointer italic"
          onClick={(e) => {
            e.preventDefault();
            setShowPassword((prevState) => !prevState);
          }}
        >
          {showPassword ? "Hide Password" : "Show Password"}
        </div>
        {error && (
          <p className="text-sm text-red-500 bg-clr-100 w-full text-center py-2">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-red-500">
            {success}
            <button
              onClick={(e) => {
                e.preventDefault();
                navigate("/signin");
              }}
            >
              Sign in
            </button>
          </p>
        )}
        <button
          type="submit"
          onClick={authenticate}
          disabled={isLoading}
          className="text-clr-400 capitalize bg-clr-690 px-4 py-2 rounded-full hover:text-clr-690 hover:bg-clr-400 focus:text-clr-690 focus:bg-clr-400 transition-all ease-in duration-300  border-none outline-none w-full"
        >
          {isLoading ? "Signing up..." : "Sign up"}
        </button>
        <p className="text-clr-100">
          Already have an account?&nbsp;
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate("/signin");
            }}
            className="underline cursor-pointer"
          >
            Sign in
          </button>
        </p>
      </form>
    </div>
  );
};

export default Signup;
