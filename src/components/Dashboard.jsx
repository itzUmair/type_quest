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

  useEffect(() => {
    const getResults = async (user) => {
      setIsLoading(true);
      const docRef = doc(database, "users", user.uid);
      const docSnap = await getDoc(docRef);
      setResults(docSnap.data().results);
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
          <h1 className="text-clr-100 font-semibold text-3xl ml-16">
            Dashboard
          </h1>
          <div className="flex flex-col items-center justify-center">
            <ResponsiveContainer
              width="80%"
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
            <div>
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
        </>
      )}
    </>
  );
};

export default Dashboard;
