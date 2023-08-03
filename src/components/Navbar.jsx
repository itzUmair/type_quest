import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase.config.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Logo from "../assets/logo.svg";

const Navbar = () => {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsLogin(user);
    });
  }, []);

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="flex justify-between items-center mobile:px-4 mobile:py-2 tablet:px-16 tablet:py-4 text-clr-100 ultra:w-2560 ultra:mx-auto">
      <p className="font-bold text-clr-400 mobile:text-xl tablet:text-2xl flex gap-4">
        <img src={Logo} alt="" className="w-8" />
        Type Quest
      </p>
      <div className="flex">
        {isLogin ? (
          <>
            <ul className={"gap-4 mobile:hidden tablet:flex"}>
              <li
                className="cursor-pointer hover:text-clr-400 focus:text-clr-400"
                onClick={() => navigate("/")}
              >
                type
              </li>
              <li
                className="cursor-pointer hover:text-clr-400 focus:text-clr-400"
                onClick={() => navigate("/dashboard")}
              >
                dashboard
              </li>
              <li
                className="cursor-pointer hover:text-clr-400 focus:text-clr-400"
                onClick={logOut}
              >
                logout
              </li>
              <li className="text-clr-100"> {isLogin.email}</li>
            </ul>
          </>
        ) : (
          <ul className="flex gap-4">
            <li
              className="cursor-pointer hover:text-clr-400 focus:text-clr-400"
              onClick={() => navigate("/")}
            >
              type
            </li>
            <li
              className="cursor-pointer hover:text-clr-400 focus:text-clr-400"
              onClick={() => navigate("/signin")}
            >
              sign in
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
