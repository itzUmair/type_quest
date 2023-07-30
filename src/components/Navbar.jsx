import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase.config.js";
import { onAuthStateChanged, signOut } from "firebase/auth";

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
    <nav className="flex justify-between items-center tablet:px-16 py-4 text-clr-100 ultra:w-2560 ultra:mx-auto">
      <p className="font-bold text-clr-400 text-2xl">Type Quest</p>
      <div className="flex">
        {isLogin ? (
          <ul className="flex gap-4">
            <li className="cursor-pointer">dashboard</li>
            <li className="cursor-pointer" onClick={logOut}>
              logout
            </li>
          </ul>
        ) : (
          <ul>
            <li className="cursor-pointer" onClick={() => navigate("/signin")}>
              sign in
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
