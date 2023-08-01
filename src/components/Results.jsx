const Results = ({ testStats, testConfig, setIsTestComplete }) => {
  const seconds = (testStats.endTime - testStats.startTime) / 1000;
  const minutes = seconds / 60;
  const WPM = testConfig.length / minutes;
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
          <span className="text-clr-100/60 text-sm ">Mode:</span>
          {testConfig.mode}
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
      <div>
        <button onClick={() => setIsTestComplete(false)}>Next test</button>
        <button>Test settings</button>
      </div>
    </div>
  );
};

export default Results;
