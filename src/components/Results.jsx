import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "../firebase/firebase.config.js";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  updateDoc,
  arrayUnion,
  setDoc,
} from "firebase/firestore";

const Results = ({
  testStats,
  testConfig,
  setIsTestComplete,
  setIsUpdateSetting,
  setIsTestStarted,
}) => {
  const [isLoggedin, setIsLoggedin] = useState(null);
  const seconds = (testStats.endTime - testStats.startTime) / 1000;
  const minutes = seconds / 60;
  const WPM = testConfig.length / minutes;
  const navigate = useNavigate();

  const listenForShortcuts = (e) => {
    if (e.key === "Enter") {
      setIsTestComplete(false);
    }

    if (e.key === "Shift") {
      setIsTestComplete(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", listenForShortcuts);
    return () => window.removeEventListener("keydown", listenForShortcuts);
  });

  const updateResults = (uid) => {
    const pushResults = async (uid) => {
      const userDocRef = doc(database, "users", uid);

      try {
        await updateDoc(userDocRef, {
          results: arrayUnion({
            ...testStats,
            ...testConfig,
          }),
        });
      } catch (error) {
        try {
          await setDoc(doc(database, "users", uid), {
            results: arrayUnion({
              ...testStats,
              ...testConfig,
            }),
          });
        } catch (error) {
          console.log(error);
        }
      }
    };
    pushResults(uid);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsLoggedin(user.uid);
      updateResults(user.uid);
    });
  }, []);

  return (
    <div className="flex gap-8 flex-col justify-center items-center h-60vh">
      <div className="grid gap-2 grid-rows-2 grid-cols-5 max-w-3xl h-50 text-center">
        <p className="bg-clr-690 rounded-md gap-4 text-clr-100 text-5xl row-start-1 row-span-2 col-start-1 col-span-2 p-8 flex flex-col justify-center items-center">
          <span className="text-clr-100/60 text-sm ">Words Per Minute:</span>
          {Math.round(WPM)}
        </p>
        <p className="bg-clr-690 rounded-md gap-4 p-4 text-clr-100 text-xl flex flex-col justify-center items-center">
          <span className="text-clr-100/60 text-sm ">Words:</span>
          {testConfig.length}
        </p>

        <p className="bg-clr-690 rounded-md gap-4 p-4 text-clr-100 text-xl flex flex-col justify-center items-center">
          <span className="text-clr-100/60 text-sm ">Accuracy:</span>
          {Math.round(testStats.acc)}%
        </p>
        <p className="bg-clr-690 rounded-md gap-4 p-4 text-clr-100 text-xl flex flex-col justify-center items-center">
          <span className="text-clr-100/60 text-sm ">Mistakes:</span>
          {testStats.mistakes}
        </p>
        <p className="bg-clr-690 rounded-md gap-4 p-4 text-clr-100 text-xl flex flex-col justify-center items-center">
          <span className="text-clr-100/60 text-sm ">Incorrect Words:</span>
          {testStats.left}
        </p>
        <p className="bg-clr-690 rounded-md gap-4 p-4 text-clr-100 text-xl flex flex-col justify-center items-center">
          <span className="text-clr-100/60 text-sm ">Total Time:</span>
          {Math.round(seconds)}s
        </p>
      </div>
      {!isLoggedin && (
        <p className="italic text-clr-100 font-xs flex items-center">
          <button
            onClick={() => navigate("/signin")}
            className="text-clr-400 capitalize pr-2 p-1 italic rounded-full hover:text-clr-690 hover:bg-clr-400 focus:text-clr-690 focus:bg-clr-400 transition-all ease-in duration-300  border-none outline-none flex flex-col items-center"
          >
            Sign in
          </button>{" "}
          to save results.
        </p>
      )}
      <div className="flex gap-4">
        <button
          onClick={() => {
            setIsTestComplete(false);
            setIsTestStarted(false);
          }}
          className="text-clr-400 capitalize bg-clr-690 px-4 py-2 rounded-full hover:text-clr-690 hover:bg-clr-400 focus:text-clr-690 focus:bg-clr-400 transition-all ease-in duration-300  border-none outline-none flex flex-col items-center"
        >
          Next test <span className="text-2xs">(enter)</span>
        </button>
        <button
          onClick={() => {
            setIsTestComplete(false);
            setIsUpdateSetting(true);
            setIsTestStarted(false);
          }}
          className="text-clr-400 capitalize bg-clr-690 px-4 py-2 rounded-full hover:text-clr-690 hover:bg-clr-400 focus:text-clr-690 focus:bg-clr-400 transition-all ease-in duration-300  border-none outline-none flex flex-col items-center"
        >
          Test settings <span className="text-2xs">(shift)</span>
        </button>
      </div>
    </div>
  );
};

export default Results;
