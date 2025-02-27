import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useAuth } from "../Context/authContext.jsx"; // Assuming you have a context for authentication

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("deviceId", {
    header: () => <span className="flex items-center">Device ID</span>,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("message", {
    header: () => <span className="flex items-center">Message</span>,
    cell: (info) => info.getValue(),
  }),
];

export default function Alarm() {
  const [data, setData] = useState([]); // State to hold the data
  const [sorting, setSorting] = useState([]); // Sorting state
  const [deviceIds, setDeviceIds] = useState([]); // Device IDs for filtering
  const { username, role } = useAuth(); // Get the current username and role from context

  // Combined useEffect for fetching device IDs and alerts
  useEffect(() => {
    const fetchData = async () => {
      try {
        let alerts = [];
        // If the user is a normal user, fetch their devices first
        if (role === "[ROLE_USER]") {
          const deviceResponse = await axios.get(`http://localhost:8080/devices/user/${username}`);
          const devices = deviceResponse.data;
          const ids = devices.map((device) => device.id);
          setDeviceIds(ids);
          console.log(ids);
          // Now fetch the alerts for the user based on the device IDs
          const alertsResponse = await axios.get("http://localhost:8080/alert/critical");
          console.log(alertsResponse.data);
          alerts = alertsResponse.data.filter((alert) => ids.includes(Number(alert.deviceId)));
        } else {
          // If the user is an admin, fetch all alerts
          const alertsResponse = await axios.get("http://localhost:8080/alert/critical");
          alerts = alertsResponse.data;
        }

        setData(alerts); // Set the filtered or all alerts
        console.log(alerts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData(); // Call the function to fetch data

    // Optionally, you can add an interval for periodic fetching:
    const intervalId = setInterval(fetchData, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, [username, role]); // Re-fetch data when username or role changes

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  });

  return (
    <>
      <h4 className="p-1 text-lg text-gray-400">Critical Alarm Logs</h4>
      <div
        className="flex flex-col w-full mx-auto p-3 rounded-lg"
        style={{
          background: "rgba(60,11,194,1)",
        }}
      >
        {/* Table container with max height and scroll */}
        <div className="overflow-y-auto max-h-[300px] rounded-lg custom-scrollbar">
          <table className="w-full divide-y divide-gray-100 sticky">
            <thead className="sticky top-0 z-10" style={{ background: "rgba(60,11,194,1)" }}>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300"
                    >
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none flex items-center"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <ArrowUpDown className="ml-2" size={14} />
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  // Add the line-through style with inline styling to ensure it's applied correctly
                  style={{
                    textDecoration: row.original.resolved === true ? 'line-through' : 'none',
                    color: row.original.resolved === true ? 'red' : 'inherit', // Change color for resolved rows
                    textDecorationThickness: '1.5px'
                  }}
                  className="hover:bg-blue-900"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 whitespace-nowrap text-sm text-gray-300"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                     
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
