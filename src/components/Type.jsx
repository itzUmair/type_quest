import { useEffect, useState } from "react";
import { database } from "../firebase/firebase.config.js";
import { doc, getDoc } from "firebase/firestore";
import Retry from "../assets/retry.svg";

const Type = () => {
  const [test, setTest] = useState("");
  const [isUpdateSetting, setIsUpdateSetting] = useState(false);
  const [regenTest, setRegenTest] = useState(0);
  const [testConfig, setTestConfig] = useState({
    length: 10,
    mode: "normal",
  });
  const docRef = doc(database, "words", "words_list");

  const generateRandomIndex = (range) => {
    return Math.floor(Math.random() * range);
  };

  const generateTest = (length, wordsArray) => {
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
    <div className="flex flex-col content-center items-center">
      <p className="text-clr-100 w-fit text-3xl my-8">{test}</p>
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
