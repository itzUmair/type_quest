import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase.config.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "../assets/logo.svg";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError("");
    if (e.target.name === "email") {
      setEmail(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    } else {
      return;
    }
  };

  const validateForm = () => {
    if (!email.length) {
      setIsLoading(false);
      setError("Email is required");
      return false;
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setIsLoading(false);
      setError("Invalid email address");
      return false;
    } else if (!password.length) {
      setIsLoading(false);
      setError("Password is required");
      return false;
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      setIsLoading(false);
      setError(
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      );
      return false;
    }
    return true;
  };

  const login = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!validateForm()) return;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // const userData = {
      //   uid: response.user.uid,
      //   email: response.user.email,
      //   expires: Date.now()
      // };
      // localStorage.setItem("userID", JSON.stringify(userData));
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setError("Incorrect password");
      } else if (error.code === "auth/user-not-found") {
        setError("No account with this email was found.");
      } else {
        setError("Something went wrong! Please try again.");
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center">
      <form className="flex flex-col gap-4 items-center justify-center py-8 w-1/4">
        <img src={Logo} alt="" className="w-10 mb-16" />
        <h2 className="font-semibold text-clr-400 text-3xl">Sign In</h2>
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

        <button
          type="submit"
          onClick={login}
          disabled={isLoading}
          className="text-clr-400 capitalize bg-clr-690 px-4 py-2 rounded-full hover:text-clr-690 hover:bg-clr-400 focus:text-clr-690 focus:bg-clr-400 transition-all ease-in duration-300  border-none outline-none w-full"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
        <p className="text-clr-100">
          Don&apos;t have an account?&nbsp;
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate("/signup");
            }}
            className="underline cursor-pointer"
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Signin;
