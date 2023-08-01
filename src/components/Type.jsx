import { useEffect, useState, useRef } from "react";
import { database } from "../firebase/firebase.config.js";
import { doc, getDoc } from "firebase/firestore";
import { CSSTransition } from "react-transition-group";
import { Results } from "../components";

const Type = () => {
  const [test, setTest] = useState("");
  const [wordsList, setWordsList] = useState([]);
  const [keysDown, setKeysDown] = useState([]);
  // const [isUpdateSetting, setIsUpdateSetting] = useState(false);
  const [regenTest, setRegenTest] = useState(0);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const regenRef = useRef(null);
  const startTimeRef = useRef(0);
  const endTimeRef = useRef(0);
  const [testStats, setTestStats] = useState({
    mistakes: 0,
    correct: 0,
    acc: 0,
    char: 0,
    left: 0,
    startTime: 0,
    endTime: 0,
  });
  const [testConfig, setTestConfig] = useState({
    length: 5,
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

    if (currentKeyIndex === 0 && startTimeRef.current === 0) {
      startTimeRef.current = Date.now();
      console.log(startTimeRef);
    }

    if (e.key === "Backspace") {
      let tempArray = [...keysDown];
      const removed = tempArray.pop();
      if (removed === test[currentKeyIndex - 1]) {
        setTestStats({ ...testStats, correct: testStats.correct - 1 });
      }
      setKeysDown((prevArray) => prevArray.slice(0, -1));
      letterDisplay.children[currentKeyIndex - 1].style.color =
        "rgba(213,223,219, 0.4)";
      return;
    } else if (e.key === currentLetter) {
      letterDisplay.children[currentKeyIndex].style.color = "#D5DFE5";
      setTestStats({ ...testStats, correct: testStats.correct + 1 });
    } else {
      letterDisplay.children[currentKeyIndex].style.color = "red";
      setTestStats({ ...testStats, mistakes: testStats.mistakes + 1 });
    }
    setKeysDown((prevKeys) => [...prevKeys, e.key]);
    if (keysDown.length + 1 === letterDisplay.children.length) {
      testComplete();
      return;
    }
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
    const wordsArray = [...wordsList];
    generateTest(testConfig.length, wordsArray);
    regenRef.current.blur();
    setTestStats({
      mistakes: 0,
      correct: 0,
      acc: 0,
      char: 0,
      left: 0,
      startTime: 0,
      endTime: 0,
    });
  }, [regenTest]);

  useEffect(() => {
    setTestStats({
      mistakes: 0,
      correct: 0,
      acc: 0,
      char: test.length,
      left: 0,
      startTime: 0,
      endTime: 0,
    });
  }, [test]);

  const testComplete = () => {
    endTimeRef.current = Date.now();
    const accuracy = Math.round(
      (1 - testStats.mistakes / testStats.correct) * 100
    );

    setTestStats({
      ...testStats,
      correct: testStats.correct + 1,
      acc: accuracy.toFixed(2),
      startTime: startTimeRef.current,
      endTime: endTimeRef.current,
    });
    setIsTestComplete(true);
  };

  useEffect(() => {
    const getWords = async () => {
      const response = await getDoc(docRef);
      setWordsList(response.data().words);
      generateTest(testConfig.length, response.data().words);
    };
    getWords();
  }, []);

  return (
    <>
      <CSSTransition in={!isTestComplete} timeout={100} unmountOnExit>
        <>
          <div className="flex flex-col justify-center items-center h-60vh">
            <div
              id="test-container"
              className="text-clr-100/40 w-fit mobile:text-2xl mobile:px-4 tablet:text-3xl my-8 tablet:px-16 flex"
            >
              {test.split("").map((letter, index) => (
                <p
                  key={index}
                  className="transition-colors duration-100 ease-in"
                >
                  {letter === " " ? "\u00A0" : letter}
                </p>
              ))}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setRegenTest((prev) => prev + 1)}
                className="text-clr-400 capitalize bg-clr-690 px-4 py-2 rounded-full hover:text-clr-690 hover:bg-clr-400 focus:text-clr-690 focus:bg-clr-400 transition-all ease-in duration-300  border-none outline-none"
                ref={regenRef}
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
        </>
      </CSSTransition>
      <CSSTransition in={isTestComplete} timeout={100} unmountOnExit>
        <Results testStats={testStats} />
      </CSSTransition>
    </>
  );
};

export default Type;
