import React, { useEffect, useRef, useState } from "react";

const Table = ({ data }) => {
  const [allResults, setAllResults] = useState(data);
  const [results, setResults] = useState([]);
  const [record, setRecord] = useState(10);
  const loadBtnRef = useRef(null);

  useEffect(() => {
    setResults([]);
    loadBtnRef.current?.blur();
    setResults((prevResults) => [
      ...prevResults,
      ...allResults.slice(0, record),
    ]);
  }, [record]);

  return (
    <>
      <table className="w-full text-sm text-gray-500 text-center rounded">
        <thead className="text-xs uppercase bg-clr-700 text-clr-100 ">
          <tr>
            <th className="px-6 py-3">WPM</th>
            <th className="px-6 py-3">Accuracy</th>
            <th className="px-6 py-3">Words</th>
            <th className="px-6 py-3">Mistakes</th>
            <th className="px-6 py-3">Total time</th>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Mode</th>
          </tr>
        </thead>
        <tbody className="text-clr-100">
          {results.map((result, index) => (
            <tr
              key={index}
              className={
                index % 2
                  ? "bg-clr-690 border-b border-clr-400"
                  : "bg-clr-650 border-b border-clr-400"
              }
            >
              <td className="px-6 py-4 font-medium whitespace-nowrap">
                {Math.round(
                  result.length / ((result.endTime - result.startTime) / 60000)
                )}
              </td>
              <td className=" px-6 py-4">{Math.round(result.acc)}%</td>
              <td className=" px-6 py-4">{result.length}</td>
              <td className=" px-6 py-4">{result.mistakes}</td>
              <td className="px-6 py-4">
                {Math.round((result.endTime - result.startTime) / 1000)}s
              </td>
              <td className="px-6 py-4">
                {new Date(result.startTime).toLocaleString()}
              </td>
              <td className="px-6 py-4">{result.mode}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-clr-400 text-center text-sm mt-1">
        {results.length} out of {allResults.length} results visible
      </p>
      {record < allResults.length && (
        <button
          ref={loadBtnRef}
          onClick={() => setRecord((prevRecords) => prevRecords + 10)}
          className="text-clr-400 capitalize bg-clr-690 px-4 py-2 rounded-lg hover:text-clr-690 hover:bg-clr-400 focus:text-clr-690 focus:bg-clr-400 transition-all ease-in duration-300  border-none outline-none w-full my-2"
        >
          Load more
        </button>
      )}
    </>
  );
};

export default Table;
