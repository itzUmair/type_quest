import { useState } from "react";

const TestConfig = ({ TestConfig, setIsUpdateSetting, setTestConfig }) => {
  const [mode, setMode] = useState("normal");
  const [length, setLength] = useState(10);
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-clr-600 w-80 p-4 layer rounded-lg">
      <h2 className="capitalize font-bold text-clr-100 text-2xl">
        Test Settings
      </h2>
      <p className="text-clr-100 mt-4">Select Mode</p>
      <div className="flex items-center gap-2">
        <input
          type="radio"
          name="modes"
          id="normal"
          value="normal"
          checked={mode === "normal"}
          onChange={(e) => setMode(e.target.value)}
          className="w-4 h-4 bg-clr-100 border-clr-300 focus:ring-clr-400 accent-clr-400"
        />
        <label htmlFor="normal" className="text-clr-100 capitalize">
          normal
        </label>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="radio"
          name="modes"
          id="time"
          value="time"
          checked={mode === "time"}
          onChange={(e) => setMode(e.target.value)}
          className="w-4 h-4 bg-clr-100 border-clr-300 focus:ring-clr-400 accent-clr-400"
        />
        <label htmlFor="time" className="text-clr-100 capitalize">
          time
        </label>
      </div>
      <label
        htmlFor="length"
        className=" mt-4 text-sm font-medium text-clr-100 flex justify-between items-center pr-4"
      >
        Select number of words
        <p className="text-lg">{length}</p>
      </label>
      <input
        type="range"
        name="length"
        id="length"
        min={10}
        max={30}
        step={5}
        value={length}
        onChange={(e) => setLength(e.target.value)}
        className="w-full h-2 bg-clr-690 rounded-lg appearance-none cursor-pointer accent-clr-400"
      />
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => {
            setTestConfig({
              mode,
              length,
            });
            setIsUpdateSetting(false);
          }}
          className="text-clr-400 capitalize bg-clr-690 px-4 py-2 rounded-full hover:text-clr-690 hover:bg-clr-400 focus:text-clr-690 focus:bg-clr-400 transition-all ease-in duration-300  border-none outline-none"
        >
          Save
        </button>
        <button
          onClick={() => setIsUpdateSetting(false)}
          className="text-clr-400 capitalize bg-clr-690 px-4 py-2 rounded-full hover:text-clr-690 hover:bg-clr-400 focus:text-clr-690 focus:bg-clr-400 transition-all ease-in duration-300  border-none outline-none"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default TestConfig;
