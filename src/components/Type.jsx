import { useEffect, useState } from "react";
import { database } from "../firebase/firebase.config.js";
import { doc, getDoc } from "firebase/firestore";
import Retry from "../assets/retry.svg";

const Type = () => {
  const [test, setTest] = useState("");
  const [keysDown, setKeysDown] = useState([]);
  const [isUpdateSetting, setIsUpdateSetting] = useState(false);
  const [regenTest, setRegenTest] = useState(0);
  const [testConfig, setTestConfig] = useState({
    length: 10,
    mode: "normal",
  });
  const docRef = doc(database, "words", "words_list");

  const resetColors = () => {
    const letterDisplay = document.querySelector("#test-container");
    const originalColor = "rgba(213, 223, 219, 0.4)";

    for (let index = 0; index < letterDisplay.children.length; index++) {
      letterDisplay.children[index].style.color = originalColor;
    }
  };

  const checkKeyDown = (e) => {
    const letterDisplay = document.querySelector("#test-container");
    const currentKeyIndex = keysDown.length;
    const currentLetter = test[currentKeyIndex];

    if (e.key === "Backspace") {
      setKeysDown((prevArray) => prevArray.slice(0, -1));

      letterDisplay.children[currentKeyIndex - 1].style.color =
        "rgba(213,223,219, 0.4)";
      return;
    } else if (e.key === currentLetter) {
      letterDisplay.children[currentKeyIndex].style.color = "#D5DFE5";
    } else {
      letterDisplay.children[currentKeyIndex].style.color = "red";
    }
    setKeysDown((prevKeys) => [...prevKeys, e.key]);
  };

  useEffect(() => {
    window.addEventListener("keydown", checkKeyDown);

    return () => window.removeEventListener("keydown", checkKeyDown);
  });

  const generateRandomIndex = (range) => {
    return Math.floor(Math.random() * range);
  };

  const generateTest = (length, wordsArray) => {
    resetColors();
    setKeysDown([]);
    const randomWords = [];
    for (let i = 0; i < length; i++) {
      const index = generateRandomIndex(wordsArray.length);
      randomWords.push(wordsArray[index]);
      wordsArray.splice(index, 1);
    }
    setTest(randomWords.join(" "));
  };

  useEffect(() => {
    const getWords = async () => {
      const response = await getDoc(docRef);
      generateTest(testConfig.length, response.data().words);
    };
    getWords();
  }, [regenTest]);

  return (
    <div className="flex flex-col justify-center items-center h-60vh">
      <div
        id="test-container"
        className="text-clr-100/40 w-fit mobile:text-2xl mobile:px-4 tablet:text-3xl my-8 tablet:px-16 flex"
      >
        {test.split("").map((letter, index) => (
          <p key={index} className="transition-colors duration-100 ease-in">
            {letter === " " ? "\u00A0" : letter}
          </p>
        ))}
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => setRegenTest((prev) => prev + 1)}
          className="text-clr-400 capitalize bg-clr-690 px-4 py-2 rounded-full hover:text-clr-690 hover:bg-clr-400 focus:text-clr-690 focus:bg-clr-400 transition-all ease-in duration-300  border-none outline-none"
        >
          restart test
        </button>
        <button
          onClick={() => setRegenTest((prev) => prev + 1)}
          className="text-clr-400 capitalize bg-clr-690 px-4 py-2 rounded-full hover:text-clr-690 hover:bg-clr-400 focus:text-clr-690 focus:bg-clr-400 transition-all ease-in duration-300  border-none outline-none"
        >
          test settings
        </button>
      </div>
    </div>
  );
};

export default Type;
