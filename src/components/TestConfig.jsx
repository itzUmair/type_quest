import { useState } from "react";

const TestConfig = ({ testConfig, setIsUpdateSetting, setTestConfig }) => {
  const [length, setLength] = useState(testConfig.length);
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-clr-600 w-80 p-4 layer rounded-lg">
      <h2 className="capitalize font-bold text-clr-100 text-2xl">
        Test Settings
      </h2>
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
