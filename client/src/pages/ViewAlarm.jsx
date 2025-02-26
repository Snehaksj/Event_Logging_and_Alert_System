import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/authContext";
import axios from "axios";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Search } from "lucide-react";
import Nav from "../Components/Nav";
import { useNavigate } from "react-router-dom";

const columnHelper = createColumnHelper();

export default function ViewUser() {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [error, setError] = useState(null);
  const { username, role } = useAuth(); // Get the role from the auth context
  const navigate = useNavigate();

  // Fetch alarm data once when the component is mounted
  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log(username)
        const url =
          username === "admin"
            ? "http://localhost:8080/alarms/all"
            : `http://localhost:8080/alarms/${username}`;

        const response = await axios.get(url);
        console.log("API Response:", response);
        setData(response.data); // Set alarms data
      } catch (error) {
        console.error("Error fetching alarms:", error);
        setError("Failed to fetch alarms");
      }
    };

    fetchData(); // Fetch data initially
  }, [username]);

  // Function to resolve alarm
  const resolveAlarm = async (alarmId) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/alarms/resolve/${alarmId}`
      );
      console.log("Resolved Alarm:", response.data);
      // After resolving, fetch data again to update the status
      setData((prevData) =>
        prevData.map((alarm) =>
          alarm.id === alarmId
            ? { ...alarm, resolved: true }
            : alarm
        )
      );
    } catch (error) {
      console.error("Error resolving alarm:", error);
    }
  };

  // Dynamically create columns for alarms data
  const columns = [
    columnHelper.accessor("device.name", {
      header: () => <span className="flex items-center">Device Name</span>,
      cell: (info) => info.getValue(),
      filterFn: "includes", // Make column filterable
    }),
    columnHelper.accessor((row) => row.device.user.username, {
      id: "assignedUser", // Add a unique id for the Assigned User column
      header: () => <span className="flex items-center">Assigned User</span>,
      cell: (info) => info.getValue(),
      filterFn: "includes", // Make column filterable
    }),
    columnHelper.accessor("criticality", {
      header: () => <span className="flex items-center">Criticality</span>,
      cell: (info) => info.getValue(),
      filterFn: "includes", // Make column filterable
    }),
    columnHelper.accessor("message", {
      header: () => <span className="flex items-center">Message</span>,
      cell: (info) => info.getValue(),
      filterFn: "includes", // Make column filterable
    }),
    columnHelper.accessor("timestamp", {
      header: () => <span className="flex items-center">Timestamp</span>,
      cell: (info) => info.getValue(),
      filterFn: "includes", // Make column filterable
    }),
    // Resolved column: Show button only for admin users or display "Yes" / "No"
    columnHelper.accessor("resolved", {
      header: () => <span className="flex items-center">Resolved</span>,
      cell: (info) => {
        const resolved = info.getValue();
        if (role === "[ROLE_ADMIN]") {
          return resolved ? (
            "Yes"
          ) : (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={() => resolveAlarm(info.row.original.id)}
            >
              Resolve
            </button>
          );
        } else {
          return resolved ? "Yes" : "No";
        }
      },
      filterFn: "includes", // Make column filterable
    }),
  ];

  // Reorder columns to make the resolved column last
  const reorderedColumns = [...columns];
  const resolvedColumn = reorderedColumns.pop(); // Remove the resolved column from its position
  reorderedColumns.push(resolvedColumn); // Add it to the end of the array

  const table = useReactTable({
    data,
    columns: reorderedColumns,
    state: { sorting, globalFilter, pagination: { pageIndex, pageSize } },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: ({ pageIndex, pageSize }) => {
      setPageIndex(pageIndex);
      setPageSize(pageSize);
    },
  });

  // Navigate to the dashboard
  const handleBack = () => {
    navigate("/alarms");
  };

  return (
    <>
      <Nav />
      <p
        className="m-10 text-white cursor-pointer hover:text-gray-300 w-36"
        onClick={handleBack}
      >
        &larr; Back to Alarms
      </p>
      <div className="flex flex-col w-11/12 max-h-[500px] mt-4 mx-auto p-3 bg-slate-900 text-gray-300 rounded-lg">
        <div className="mb-4 relative">
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-md shadow-sm focus:ring-indigo-400 focus:border-indigo-400 text-gray-300 bg-slate-900"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
        </div>

        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-y-auto max-h-[500px] bg-slate-900 shadow-md rounded-lg custom-scrollbar">
            <table className="w-full divide-y divide-gray-700 table-auto">
              <thead className="bg-slate-900 sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300"
                      >
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none flex items-center"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <ArrowUpDown className="ml-2" size={14} />
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-700">
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-gray-400">
                      No alarms available.
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-600">
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-2 py-3 whitespace-nowrap text-sm text-gray-300"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
