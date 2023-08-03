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

import { Loader, Navbar, Footer, Table } from "../components";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const yAxisTicks = [0, 50, 100];
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    avgWPM: 0,
    avgACC: 0,
    bestWPM: 0,
    bestACC: 0,
    totalTIME: 0,
    totalWORDS: 0,
    totalMISTAKES: 0,
  });

  const calculateStats = (results) => {
    let avgWPM = 0;
    let avgACC = 0;
    let bestWPM = [];
    let bestACC = [];
    let totalTIME = 0;
    let totalWORDS = 0;
    let totalMISTAKES = 0;

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
    });

    setStats({
      avgWPM: Math.round(avgWPM / results.length),
      avgACC: Math.round(avgACC / results.length),
      bestWPM: Math.max(...bestWPM),
      bestACC: Math.max(...bestACC),
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
      if (!docSnap.data()) {
        setIsLoading(false);
        return;
      }
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
      ) : results.length ? (
        <>
          <Navbar />
          <header className="ml-16 my-8">
            <h1 className="text-clr-100 font-bold text-3xl ">Dashboard</h1>
            <p className="text-clr-100 text-lg">
              Signed in as:{" "}
              <span className="font-bold underline italic">{user.email}</span>
            </p>
          </header>

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
              {!isLoading && <Table data={results} />}
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
          <Footer />
        </>
      ) : (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center flex-col">
          <p className=" text-center text-clr-400 text-2xl">
            No records found on this account! Attempt some typing tests to see
            records.
          </p>
          <button
            onClick={() => navigate("/")}
            className="text-clr-400 capitalize bg-clr-690 px-4 py-2 rounded-full hover:text-clr-690 hover:bg-clr-400 focus:text-clr-690 focus:bg-clr-400 transition-all ease-in duration-300  border-none outline-none"
          >
            Test
          </button>
        </div>
      )}
    </>
  );
};

export default Dashboard;
