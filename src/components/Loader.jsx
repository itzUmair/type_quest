import { useEffect } from "react";

const Loader = () => {
  let i = 0;
  let txt = "Loading Data!";
  let speed = 100;

  const typeWriter = () => {
    if (i < txt.length) {
      document.querySelector("#loader").innerHTML += txt.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    }
  };
  useEffect(() => {
    typeWriter();
  });
  return (
    <div
      id="loader"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-clr-400 text-2xl"
    ></div>
  );
};

export default Loader;
