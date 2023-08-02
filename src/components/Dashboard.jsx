import { useState, useEffect, useMemo } from "react";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "../firebase/firebase.config";
import { useTable } from "react-table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
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

  const data = useMemo(() => results, []);
  const columns = useMemo(
    () => [
      {
        Header: "WPM",
        accessor: (row) => {
          const seconds = (row.endTime - row.startTime) / 1000;
          const minutes = seconds / 60;
          return Math.round(row.length / minutes);
        },
      },
      {
        Header: "Accuracy",
        accessor: "acc",
      },
      {
        Header: "Mode",
        accessor: "mode",
      },
      {
        Header: "Correct",
        accessor: "correct",
      },
      {
        Header: "Wrong",
        accessor: "left",
      },
      {
        Header: "Words",
        accessor: "length",
      },
      {
        Header: "Mistakes",
        accessor: "mistakes",
      },
      {
        Header: "Total time (seconds)",
        accessor: (row) => {
          const startTime = row.startTime;
          const endTime = row.endTime;

          return Math.round((endTime - startTime) / 1000);
        },
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

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
            <table {...getTableProps()}>
              <thead>
                {headerGroups.map((headerGroup, index) => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                    {headerGroup.headers.map((column, index) => (
                      <th {...column.getHeaderProps()} key={index}>
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row, index) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} key={index}>
                      {row.cells.map((cell, index) => (
                        <td {...cell.getCellProps()} key={index}>
                          {" "}
                          {cell.render("Cell")}{" "}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
