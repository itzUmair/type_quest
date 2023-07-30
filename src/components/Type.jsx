import { useEffect, useState } from "react";
import { database } from "../firebase/firebase.config.js";
import { doc, getDoc } from "firebase/firestore";

const Type = () => {
  const [test, setTest] = useState("");
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

      if (response.exists) {
        generateTest(10, response.data().words);
      } else {
        console.log("no such document exists!");
      }
    };
    getWords();
  }, []);
  return (
    <div>
      <p>{test}</p>
    </div>
  );
};

export default Type;
