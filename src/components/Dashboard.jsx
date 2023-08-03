import { useState, useEffect, useMemo } from "react";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "../firebase/firebase.config";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Loader from "./Loader";
import Navbar from "./Navbar";

const Dashboard = () => {
  const [user, setUser] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const yAxisTicks = [0, 50, 100];
  const [stats, setStats] = useState({
    avgWPM: 0,
    avgACC: 0,
    bestWPM: 0,
    bestACC: 0,
    favMODE: "N/A",
    totalTIME: 0,
    totalWORDS: 0,
    totalMISTAKES: 0,
  });

  const calculateStats = (results) => {
    let avgWPM = 0;
    let avgACC = 0;
    let bestWPM = [];
    let bestACC = [];
    let favMODE = [];
    let totalTIME = 0;
    let totalWORDS = 0;
    let totalMISTAKES = 0;

    function maxEL(array) {
      if (array.length === 0) return null;
      let modeMap = {};
      let maxEl = array[0];
      let maxCount = 1;
      for (let i = 0; i < array.length; i++) {
        let el = array[i];
        if (modeMap[el] == null) modeMap[el] = 1;
        else modeMap[el]++;
        if (modeMap[el] > maxCount) {
          maxEl = el;
          maxCount = modeMap[el];
        }
      }
      return maxEl;
    }

    results.forEach((result) => {
      avgWPM += Math.round(
        result.length / ((result.endTime - result.startTime) / 60000)
      );
      avgACC += Math.round(result.acc);
      bestWPM.push(
        Math.round(
          result.length / ((result.endTime - result.startTime) / 60000)
        )
      );
      bestACC.push(result.acc);
      totalTIME += result.endTime - result.startTime;
      totalMISTAKES += result.mistakes;
      totalWORDS += parseInt(result.length);
      favMODE.push(result.mode);
    });

    setStats({
      avgWPM: Math.round(avgWPM / results.length),
      avgACC: Math.round(avgACC / results.length),
      bestWPM: Math.max(...bestWPM),
      bestACC: Math.max(...bestACC),
      favMODE: maxEL(favMODE),
      totalTIME: new Date(totalTIME).toISOString().slice(11, 19),
      totalWORDS,
      totalMISTAKES,
    });
  };

  useEffect(() => {
    const getResults = async (user) => {
      setIsLoading(true);
      const docRef = doc(database, "users", user.uid);
      const docSnap = await getDoc(docRef);
      setResults(docSnap.data().results);
      calculateStats(docSnap.data().results);
      setIsLoading(false);
    };
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      getResults(user);
    });
  }, []);

  const chartData = useMemo(() => {
    return results.map((entry) => {
      const date = new Date(entry.startTime);

      const options = {
        year: "2-digit",
        month: "numeric",
        day: "numeric",
      };

      const formattedDate = date.toLocaleDateString(undefined, options);
      return {
        date: formattedDate,
        accuracy: parseFloat(entry.acc),
        wordsPerMinute: parseFloat(
          (
            entry.length /
            ((entry.endTime - entry.startTime) / 1000 / 60)
          ).toFixed(2)
        ),
        mistakes: entry.mistakes,
      };
    });
  }, [results]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div>
          <p>{`Date: ${label}`}</p>
          {payload.map((data, index) => (
            <p key={index}>{`${data.name}: ${data.value}`}</p>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Navbar />
          <h1 className="text-clr-100 font-bold text-3xl ml-16">Dashboard</h1>
          <p className="text-clr-100 text-lg ml-16">
            Signed in as:{" "}
            <span className="font-bold underline italic">{user.email}</span>
          </p>
          <div className="flex flex-col items-center justify-center my-8 px-16">
            <ResponsiveContainer
              width="100%"
              height={250}
              className="bg-clr-690 p-4"
            >
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 80, left: 20, bottom: 20 }}
              >
                <XAxis dataKey="date" stroke="#D5DFE5" fontSize="12px" />
                <YAxis stroke="#D5DFE5" ticks={yAxisTicks} fontSize="12px" />
                <Tooltip
                  content={<CustomTooltip />}
                  wrapperStyle={{
                    backgroundColor: "#afeafc80",
                    backdropFilter: "blur(5px)",
                    borderStyle: "ridge",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    borderRadius: "0.5rem",
                    color: "black",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#8884d8"
                  strokeWidth="3px"
                  name="Accuracy"
                />
                <Line
                  type="monotone"
                  dataKey="wordsPerMinute"
                  stroke="#FFCF00"
                  strokeWidth="3px"
                  name="Words per Minute"
                />
                <Line
                  type="monotone"
                  dataKey="mistakes"
                  stroke="red"
                  strokeWidth="3px"
                  name="Mistakes"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="my-8 w-full">
              {!isLoading && (
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
                            result.length /
                              ((result.endTime - result.startTime) / 60000)
                          )}
                        </td>
                        <td className=" px-6 py-4">
                          {Math.round(result.acc)}%
                        </td>
                        <td className=" px-6 py-4">{result.length}</td>
                        <td className=" px-6 py-4">{result.mistakes}</td>
                        <td className="px-6 py-4">
                          {Math.round(
                            (result.endTime - result.startTime) / 1000
                          )}
                          s
                        </td>
                        <td className="px-6 py-4">
                          {new Date(result.startTime).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">{result.mode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 grid-rows-2 px-16 gap-4 my-8">
            <span className="flex flex-col justify-center items-center gap-4 bg-clr-690 w-full h-40 rounded-lg">
              <p className="text-clr-100/60 text-sm">Average WPM</p>
              <p className="text-clr-100 font-bold text-2xl">{stats.avgWPM}</p>
            </span>
            <span className="flex flex-col justify-center items-center gap-4 bg-clr-690 w-full h-40 rounded-lg">
              <p className="text-clr-100/60 text-sm">Average Accuracy</p>
              <p className="text-clr-100 font-bold text-2xl">{stats.avgACC}%</p>
            </span>
            <span className="flex flex-col justify-center items-center gap-4 bg-clr-690 w-full h-40 rounded-lg">
              <p className="text-clr-100/60 text-sm">Best WPM</p>
              <p className="text-clr-100 font-bold text-2xl">{stats.bestWPM}</p>
            </span>
            <span className="flex flex-col justify-center items-center gap-4 bg-clr-690 w-full h-40 rounded-lg">
              <p className="text-clr-100/60 text-sm">Best Accuracy</p>
              <p className="text-clr-100 font-bold text-2xl">
                {stats.bestACC}%
              </p>
            </span>
            <span className="flex flex-col justify-center items-center gap-4 bg-clr-690 w-full h-40 rounded-lg">
              <p className="text-clr-100/60 text-sm">Total typing time</p>
              <p className="text-clr-100 font-bold text-2xl">
                {stats.totalTIME}
              </p>
            </span>
            <span className="flex flex-col justify-center items-center gap-4 bg-clr-690 w-full h-40 rounded-lg">
              <p className="text-clr-100/60 text-sm">Total words typed</p>
              <p className="text-clr-100 font-bold text-2xl">
                {stats.totalWORDS}
              </p>
            </span>
            <span className="flex flex-col justify-center items-center gap-4 bg-clr-690 w-full h-40 rounded-lg">
              <p className="text-clr-100/60 text-sm">Total mistakes</p>
              <p className="text-clr-100 font-bold text-2xl">
                {stats.totalMISTAKES}
              </p>
            </span>
            <span className="flex flex-col justify-center items-center gap-4 bg-clr-690 w-full h-40 rounded-lg">
              <p className="text-clr-100/60 text-sm">Favorite moded</p>
              <p className="text-clr-100 font-bold text-2xl">{stats.favMODE}</p>
            </span>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
