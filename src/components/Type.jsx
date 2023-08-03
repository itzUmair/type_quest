import { useEffect, useState, useRef } from "react";
import { database } from "../firebase/firebase.config.js";
import { doc, getDoc } from "firebase/firestore";
import { CSSTransition } from "react-transition-group";
import { Results, TestConfig, Footer } from "../components";

const Type = () => {
  const [test, setTest] = useState("");
  const [wordsList, setWordsList] = useState([]);
  const [keysDown, setKeysDown] = useState([]);
  const [isUpdateSetting, setIsUpdateSetting] = useState(false);
  const [regenTest, setRegenTest] = useState(0);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const regenRef = useRef(null);
  const startTimeRef = useRef(0);
  const endTimeRef = useRef(0);
  const [userOnMobile, setUserOnMobile] = useState(false);
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
    length: 20,
  });
  const docRef = doc(database, "words", "words_list");

  const resetColors = () => {
    const letterDisplay = document.querySelectorAll(".letters");
    const originalColor = "rgba(213, 223, 219, 0.4)";
    for (let index = 0; index < letterDisplay.length; index++) {
      letterDisplay[index].style.color = originalColor;
      letterDisplay[index].style.backgroundColor = "transparent";
    }
  };

  const checkKeyDown = (e) => {
    const letterDisplay = document.querySelectorAll(".letters");
    const currentKeyIndex = keysDown.length;
    const currentLetter = test[currentKeyIndex];

    if (currentLetter === " " && e.key !== " " && e.key !== "Backspace") {
      letterDisplay[currentKeyIndex].style.backgroundColor = "red";
      setTestStats({
        ...testStats,
        mistakes: testStats.mistakes + 1,
        left: testStats.left + 1,
      });
    }
    if (currentKeyIndex === 0 && startTimeRef.current === 0) {
      startTimeRef.current = Date.now();
      setIsTestStarted(true);
    }

    if (e.key === "Backspace") {
      let tempArray = [...keysDown];
      const removed = tempArray.pop();
      if (removed === test[currentKeyIndex - 1]) {
        setTestStats({ ...testStats, correct: testStats.correct - 1 });
      } else {
        setTestStats({ ...testStats, left: testStats.left - 1 });
      }
      setKeysDown((prevArray) => prevArray.slice(0, -1));
      letterDisplay[keysDown.length - 1].style.color = "rgba(213,223,219, 0.4)";
      letterDisplay[keysDown.length - 1].style.backgroundColor = "transparent";
      return;
    } else if (e.key === currentLetter) {
      letterDisplay[currentKeyIndex].style.color = "#D5DFE5";
      setTestStats({ ...testStats, correct: testStats.correct + 1 });
    } else {
      letterDisplay[currentKeyIndex].style.color = "red";
      setTestStats({
        ...testStats,
        mistakes: testStats.mistakes + 1,
        left: testStats.left + 1,
      });
    }
    setKeysDown((prevKeys) => [...prevKeys, e.key]);
    if (keysDown.length + 1 === test.length) {
      testComplete();
      return;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", checkKeyDown);
    if (window.innerWidth < 768) {
      setUserOnMobile(true);
    }

    return () => window.removeEventListener("keydown", checkKeyDown);
  });

  const generateRandomIndex = (range) => {
    return Math.floor(Math.random() * range);
  };

  const generateTest = (length, wordsArray) => {
    resetColors();
    setKeysDown([]);
    setIsTestStarted(false);
    startTimeRef.current = 0;
    endTimeRef.current = 0;
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
    regenRef.current?.blur();
    setTestStats({
      mistakes: 0,
      correct: 0,
      acc: 0,
      char: 0,
      left: 0,
      startTime: 0,
      endTime: 0,
    });
  }, [regenTest, testConfig]);

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

  useEffect(() => {
    if (!isTestComplete) {
      const wordsArray = [...wordsList];
      generateTest(testConfig.length, wordsArray);
      setTestStats({
        mistakes: 0,
        correct: 0,
        acc: 0,
        char: 0,
        left: 0,
        startTime: 0,
        endTime: 0,
      });
      startTimeRef.current = 0;
      endTimeRef.current = 0;
      setKeysDown([]);
    }
  }, [isTestComplete]);

  return (
    <>
      {userOnMobile ? (
        <p className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-clr-100 font-bold text-xl text-center w-1/2">
          This app is designed and developed for personal computers. It will not
          function as intended on small screen devices.Please visit with a PC.
        </p>
      ) : (
        <div className="tablet:overflow-y-hidden">
          <CSSTransition
            in={!isTestComplete}
            timeout={300}
            classNames="fade"
            unmountOnExit
          >
            <>
              <div className="flex flex-col justify-center items-center h-[calc(100vh-7rem)]">
                <div className="flex gap-4 bg-clr-690 px-4 py-2">
                  <p className="text-clr-100/60">
                    Words:
                    <span className=" text-clr-100 font-bold">
                      {testConfig.length}
                    </span>
                  </p>
                </div>
                <div className="text-clr-100/40 tablet:w-10/12 mobile:text-2xl mobile:px-4 tablet:text-3xl my-24 tablet:px-16 flex flex-wrap justify-center">
                  {test.split(" ").map((word, index) => (
                    <span key={index} className="flex flex-wrap">
                      {word.split("").map((letter, index) => (
                        <p
                          key={index}
                          className="transition-colors duration-100 ease-in letters"
                        >
                          {letter === " " ? "\u00A0" : letter}
                        </p>
                      ))}
                      <p className="letters">{"\u00A0"}</p>
                    </span>
                  ))}
                </div>
                {!isTestStarted && (
                  <p className="text-clr-100 text-sm mb-4 font-semibold">
                    Start typing when ready.
                  </p>
                )}
                <div className="flex gap-4">
                  <button
                    onClick={() => setRegenTest((prev) => prev + 1)}
                    className="text-clr-400 capitalize bg-clr-690 px-4 py-2 rounded-full hover:text-clr-690 hover:bg-clr-400 focus:text-clr-690 focus:bg-clr-400 transition-all ease-in duration-300  border-none outline-none"
                    ref={regenRef}
                  >
                    restart test
                  </button>
                  <button
                    onClick={() =>
                      setIsUpdateSetting((prevState) => !prevState)
                    }
                    className="text-clr-400 capitalize bg-clr-690 px-4 py-2 rounded-full hover:text-clr-690 hover:bg-clr-400 focus:text-clr-690 focus:bg-clr-400 transition-all ease-in duration-300  border-none outline-none"
                  >
                    test settings
                  </button>
                </div>
              </div>
              <Footer />
            </>
          </CSSTransition>
          <CSSTransition
            in={isTestComplete}
            timeout={300}
            classNames="fade"
            unmountOnExit
          >
            <Results
              testStats={testStats}
              testConfig={testConfig}
              setIsTestComplete={setIsTestComplete}
              setIsUpdateSetting={setIsUpdateSetting}
              setIsTestStarted={setIsTestStarted}
            />
          </CSSTransition>
          <CSSTransition
            in={isUpdateSetting}
            timeout={300}
            classNames="fade"
            unmountOnExit
          >
            <TestConfig
              testConfig={testConfig}
              setIsUpdateSetting={setIsUpdateSetting}
              setTestConfig={setTestConfig}
            />
          </CSSTransition>
        </div>
      )}
    </>
  );
};

export default Type;
