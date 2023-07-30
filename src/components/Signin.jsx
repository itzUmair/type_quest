import { signInWithPopup, sendSignInLinkToEmail } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase.config.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (error) {
      console.log(error.code);
    }
  };

  const signInWithEmail = async (e) => {
    e.preventDefault();
    try {
      await sendSignInLinkToEmail(auth, email, {
        url: "http://localhost:5173",
        handleCodeInApp: true,
      });
      setEmailSent(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {emailSent ? (
        <div>
          <p>Email sent to {email}</p>
        </div>
      ) : (
        <>
          <p className="font-bold text-clr-400 text-2xl my-8">Type Quest</p>
          <form className="flex flex-col gap-1 text-clr-100 items-center">
            <label htmlFor="email" className="self-start">
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-96 px-1 py-1 rounded text-clr-600 border-none outline-clr-400 outline-1"
            />
            <button
              onClick={signInWithEmail}
              className="bg-clr-690 px-4 py-2 rounded-full w-full my-2"
            >
              Sign in
            </button>
            <p className="font-bold text-clr-100 text-lg mb-2">OR</p>
            <button
              onClick={signInWithGoogle}
              className="bg-clr-100 text-clr-600 px-4 py-2 rounded-full"
            >
              Sign in with Google
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Signin;
